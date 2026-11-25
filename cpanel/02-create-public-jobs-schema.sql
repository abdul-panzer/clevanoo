-- Run once after backing up the database and checking 01-check-public-jobs.sql.
-- This is the SQL equivalent of the Laravel migration for this release.
ALTER TABLE clevanoo_jobs
  ADD COLUMN public_status VARCHAR(20) NOT NULL DEFAULT 'published',
  ADD INDEX jobs_public_rank (public_status, created_at, id);

ALTER TABLE candidates
  ADD COLUMN job_id BIGINT UNSIGNED NULL,
  ADD INDEX candidates_job_id_index (job_id);

CREATE TABLE public_job_locks (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY
) ENGINE = InnoDB;

INSERT INTO public_job_locks (id) VALUES (1);

INSERT INTO migrations (migration, batch)
SELECT '2026_11_25_000000_add_public_job_visibility', COALESCE(MAX(batch), 0) + 1
FROM migrations;
