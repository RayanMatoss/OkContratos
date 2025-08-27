-- Script para verificar se as tabelas e funções foram criadas
-- Execute este script para diagnosticar o problema

-- 1. Verificar se a tabela password_recovery_attempts existe
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Criada'
        ELSE '❌ Não encontrada'
    END as status
FROM information_schema.tables 
WHERE table_name = 'password_recovery_attempts';

-- 2. Verificar se as funções foram criadas
SELECT 
    routine_name,
    CASE 
        WHEN routine_name IS NOT NULL THEN '✅ Criada'
        ELSE '❌ Não encontrada'
    END as status
FROM information_schema.routines 
WHERE routine_name IN (
    'check_user_exists',
    'log_password_recovery_attempt',
    'can_user_recover_password',
    'get_user_recovery_info',
    'cleanup_old_recovery_attempts',
    'check_recent_recovery_attempts',
    'get_password_recovery_stats'
);

-- 3. Verificar se a view password_recovery_report existe
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Criada'
        ELSE '❌ Não encontrada'
    END as status
FROM information_schema.views 
WHERE table_name = 'password_recovery_report';

-- 4. Verificar se os índices foram criados
SELECT 
    indexname,
    CASE 
        WHEN indexname IS NOT NULL THEN '✅ Criado'
        ELSE '❌ Não encontrado'
    END as status
FROM pg_indexes 
WHERE indexname IN (
    'idx_password_recovery_email',
    'idx_password_recovery_created_at',
    'idx_password_recovery_success'
); 