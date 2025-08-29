-- CRIAR FUNÇÃO RPC PARA INSERÇÃO DIRETA
-- Execute este script no Supabase SQL Editor

-- 1. CRIAR FUNÇÃO exec_sql_insert
CREATE OR REPLACE FUNCTION exec_sql_insert(sql_query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    -- Executar a query SQL fornecida
    EXECUTE sql_query INTO result;
    
    -- Retornar o resultado
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        -- Em caso de erro, retornar detalhes
        RETURN json_build_object(
            'error', true,
            'message', SQLERRM,
            'detail', SQLSTATE
        );
END;
$$;

-- 2. CONCEDER PERMISSÕES
GRANT EXECUTE ON FUNCTION exec_sql_insert TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql_insert TO anon;

-- 3. TESTAR A FUNÇÃO
SELECT exec_sql_insert('SELECT 1 as test');

-- 4. VERIFICAR SE A FUNÇÃO FOI CRIADA
SELECT 
    proname,
    prosrc,
    proacl
FROM pg_proc 
WHERE proname = 'exec_sql_insert';

