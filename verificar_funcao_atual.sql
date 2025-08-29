-- Verificar a assinatura atual da função create_solicitacao_ordem
SELECT 
    proname as nome_funcao,
    pg_get_function_arguments(oid) as argumentos,
    prosrc as codigo_fonte
FROM pg_proc 
WHERE proname = 'create_solicitacao_ordem';

-- Verificar se há múltiplas versões da função
SELECT 
    n.nspname as schema,
    p.proname as nome_funcao,
    pg_get_function_arguments(p.oid) as argumentos
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'create_solicitacao_ordem';

