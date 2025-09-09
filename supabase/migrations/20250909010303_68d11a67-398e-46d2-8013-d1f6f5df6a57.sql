-- Fix all remaining functions that might still have mutable search paths
-- These are likely other functions in the system or recently added ones

-- Check what functions exist and fix their search paths
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Find all public functions and set their search path to empty
    FOR func_record IN 
        SELECT p.proname as func_name,
               pg_get_function_identity_arguments(p.oid) as func_args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname NOT LIKE 'pg_%'
        AND p.proname NOT LIKE 'uuid_%'
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION public.%I(%s) SET search_path = ''''', 
                          func_record.func_name, 
                          func_record.func_args);
            RAISE NOTICE 'Fixed search path for function: %', func_record.func_name;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not fix function %: %', func_record.func_name, SQLERRM;
        END;
    END LOOP;
END $$;