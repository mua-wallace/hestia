-- Ensure AM and PM shifts exist so staff assignment can persist (app looks up shift by name).
-- Idempotent: only inserts if no row with that name exists.

INSERT INTO shifts (name, start_time, end_time)
SELECT 'AM', '06:00'::time, '14:00'::time
WHERE NOT EXISTS (SELECT 1 FROM shifts WHERE name ILIKE 'AM');

INSERT INTO shifts (name, start_time, end_time)
SELECT 'PM', '14:00'::time, '22:00'::time
WHERE NOT EXISTS (SELECT 1 FROM shifts WHERE name ILIKE 'PM');
