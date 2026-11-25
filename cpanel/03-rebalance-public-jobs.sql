-- Run the entire script in one submission. First run with 0 for a dry run.
-- To apply, change only @apply_public_jobs from 0 to 1 and run again.
SET @apply_public_jobs = 0;

-- Laravel uses UTC. Convert the session too, for TIMESTAMP comparisons.
SET SESSION time_zone = '+00:00';
SET @as_of = UTC_TIMESTAMP();
CREATE TEMPORARY TABLE IF NOT EXISTS clevanoo_public_job_cutoff (
  id BIGINT UNSIGNED NOT NULL PRIMARY KEY
) ENGINE = InnoDB;
DELETE FROM clevanoo_public_job_cutoff;

START TRANSACTION;

-- Share the singleton lock with publishing and application intake.
SET @public_job_lock = NULL;
SELECT id INTO @public_job_lock FROM public_job_locks WHERE id = 1 FOR UPDATE;

INSERT INTO clevanoo_public_job_cutoff (id)
SELECT id
FROM clevanoo_jobs
WHERE public_status IN ('published', 'limited') AND created_at <= @as_of
ORDER BY created_at DESC, id DESC
LIMIT 48;

SELECT j.id AS active_id, j.jobtitle, j.created_at AS posted_at_utc
FROM clevanoo_public_job_cutoff AS a
JOIN clevanoo_jobs AS j ON j.id = a.id
ORDER BY j.created_at DESC, j.id DESC;

SELECT COUNT(a.id) AS active_total,
       COUNT(CASE WHEN a.id IS NULL AND j.public_status = 'published' THEN 1 END) AS becoming_inactive,
       COUNT(CASE WHEN a.id IS NOT NULL AND j.public_status = 'limited' THEN 1 END) AS becoming_active,
       COUNT(CASE WHEN j.public_status = 'published'
                    AND (j.created_at IS NULL OR j.created_at > @as_of) THEN 1 END) AS date_exceptions_becoming_inactive
FROM clevanoo_jobs AS j
LEFT JOIN clevanoo_public_job_cutoff AS a ON a.id = j.id;

SELECT public_status AS excluded_status, COUNT(*) AS total
FROM clevanoo_jobs
WHERE public_status NOT IN ('published', 'limited')
GROUP BY public_status;

SELECT id, jobtitle, created_at,
       CASE WHEN created_at IS NULL THEN 'missing posting date' ELSE 'future posting date' END AS exclusion
FROM clevanoo_jobs
WHERE public_status IN ('published', 'limited') AND (created_at IS NULL OR created_at > @as_of)
ORDER BY id;

UPDATE clevanoo_jobs AS j
LEFT JOIN clevanoo_public_job_cutoff AS a ON a.id = j.id
SET j.public_status = CASE WHEN a.id IS NULL THEN 'limited' ELSE 'published' END
WHERE @apply_public_jobs = 1 AND @public_job_lock = 1
  AND ((a.id IS NULL AND j.public_status = 'published')
    OR (a.id IS NOT NULL AND j.public_status = 'limited'));

SELECT ROW_COUNT() AS job_statuses_changed,
       CASE WHEN @public_job_lock IS NULL THEN 'ERROR: public job lock row missing'
            WHEN @apply_public_jobs = 1 THEN 'apply'
            ELSE 'dry run' END AS run_mode;

COMMIT;
DROP TEMPORARY TABLE clevanoo_public_job_cutoff;
