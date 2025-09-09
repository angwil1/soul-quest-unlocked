-- Query to find remaining functions with mutable search paths
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND (prosecdef IS NULL OR prosecdef = false)
ORDER BY routine_name;