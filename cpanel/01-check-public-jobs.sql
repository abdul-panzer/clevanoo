-- Select the website database in phpMyAdmin before running this file.
SELECT DATABASE() AS selected_database, VERSION() AS database_version;

SELECT TABLE_NAME, ENGINE
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('clevanoo_jobs', 'candidates', 'migrations', 'public_job_locks');

SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND ((TABLE_NAME = 'clevanoo_jobs' AND COLUMN_NAME = 'public_status')
    OR (TABLE_NAME = 'candidates' AND COLUMN_NAME = 'job_id'));

SELECT migration, batch
FROM migrations
WHERE migration = '2026_11_25_000000_add_public_job_visibility';
