-- Front-office status by time of day:
-- PM = 17:00:00 to 11:59:59 → show as turndown
-- AM = 00:00:00 to 16:59:59 → show as stayover
--
-- Schedule in Supabase Dashboard → Database → Extensions → pg_cron (or Scheduled Jobs):
-- - pm_stayover_to_turndown: cron "0 17 * * *" (daily 17:00)
-- - am_turndown_to_stayover: cron "0 0 * * *" (daily 00:00)

CREATE OR REPLACE FUNCTION public.pm_stayover_to_turndown()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE reservations
  SET front_office_status = 'turndown'
  WHERE front_office_status = 'stayover'
    AND reservation_status = 'checked_in';
$$;

CREATE OR REPLACE FUNCTION public.am_turndown_to_stayover()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE reservations
  SET front_office_status = 'stayover'
  WHERE front_office_status = 'turndown'
    AND reservation_status = 'checked_in';
$$;
