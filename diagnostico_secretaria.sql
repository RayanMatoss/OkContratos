-- DIAGNÓSTICO COMPLETO DA COLUNA SECRETARIA
-- Execute este script no Supabase SQL Editor

-- 1. VERIFICAR ESTRUTURA DA TABELA
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'ordem_solicitacoes' 
AND column_name = 'secretaria';

-- 2. VERIFICAR CONSTRAINTS
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'ordem_solicitacoes' 
AND kcu.column_name = 'secretaria';

-- 3. VERIFICAR RLS (Row Level Security)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'ordem_solicitacoes';

-- 4. VERIFICAR TRIGGERS
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'ordem_solicitacoes';

-- 5. VERIFICAR FUNCTIONS QUE PODEM AFETAR A TABELA
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND pg_get_functiondef(p.oid) LIKE '%ordem_solicitacoes%';

-- 6. VERIFICAR PERMISSÕES DO USUÁRIO ATUAL
SELECT 
    grantee,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'ordem_solicitacoes'
AND grantee IN ('authenticated', 'anon', current_user);

-- 7. TESTAR INSERÇÃO DIRETA (SEM SUPABASE)
-- IMPORTANTE: Execute esta parte com cuidado
INSERT INTO ordem_solicitacoes (
    contrato_id, 
    solicitante, 
    secretaria, 
    justificativa, 
    quantidade, 
    status
) VALUES (
    '5f1c89ba-8bf2-40be-964f-ba2cb8352563',
    '687f6fd0-d3b3-45e4-9fb2-134d25deb6db',
    'assistencia',
    'TESTE DIRETO SQL',
    1,
    'PENDENTE'
) RETURNING id, secretaria;

-- 8. VERIFICAR SE A INSERÇÃO FUNCIONOU
SELECT 
    id,
    contrato_id,
    solicitante,
    secretaria,
    justificativa,
    quantidade,
    status,
    created_at
FROM ordem_solicitacoes 
WHERE justificativa = 'TESTE DIRETO SQL'
ORDER BY created_at DESC
LIMIT 1;

-- 9. LIMPAR TESTE
DELETE FROM ordem_solicitacoes 
WHERE justificativa = 'TESTE DIRETO SQL';

