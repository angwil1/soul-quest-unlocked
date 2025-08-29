-- Fix critical security issues for app store readiness

-- Add security definer and search_path to critical functions
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SECURITY DEFINER SET search_path = public;

-- Ensure all tables have proper RLS policies by adding default policies where missing
DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- Add default RLS policies for any tables that have RLS enabled but no policies
    FOR table_record IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tableowner != 'supabase_admin'
    LOOP
        -- Check if table has RLS enabled and add basic user-based policies if missing
        EXECUTE format('
            DO $inner$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_class c 
                    JOIN pg_namespace n ON n.oid = c.relnamespace 
                    WHERE c.relname = %L AND n.nspname = %L AND c.relrowsecurity = true
                ) AND NOT EXISTS (
                    SELECT 1 FROM pg_policies 
                    WHERE schemaname = %L AND tablename = %L
                ) THEN
                    -- Only add if table has user_id column
                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_schema = %L AND table_name = %L AND column_name = ''user_id''
                    ) THEN
                        EXECUTE format(''CREATE POLICY "Users can manage own data" ON %I.%I FOR ALL USING (auth.uid() = user_id)'', %L, %L);
                    END IF;
                END IF;
            END $inner$;
        ', table_record.tablename, table_record.schemaname, table_record.schemaname, table_record.tablename, table_record.schemaname, table_record.tablename, table_record.schemaname, table_record.tablename);
    END LOOP;
END $$;