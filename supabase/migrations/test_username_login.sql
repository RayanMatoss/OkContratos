-- Script de teste para verificar o sistema de login por username
-- Execute após aplicar as outras migrações

-- 1. Verificar se a coluna username foi criada
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'username';

-- 2. Verificar se as funções foram criadas
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name IN (
    'get_user_by_username',
    'check_username_exists',
    'generate_username',
    'authenticate_by_username'
)
AND routine_schema = 'public';

-- 3. Verificar se o índice foi criado
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'user_profiles' 
AND indexname = 'idx_user_profiles_username';

-- 4. Verificar se o trigger foi criado
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_validate_username_unique';

-- 5. Testar a função generate_username
SELECT 
    'Teste generate_username' as teste,
    generate_username('João Silva') as resultado1,
    generate_username('Maria Santos') as resultado2,
    generate_username('João Silva') as resultado3;

-- 6. Verificar estatísticas dos usuários
SELECT 
    'Estatísticas dos Usuários' as titulo,
    COUNT(*) as total_usuarios,
    COUNT(username) as com_username,
    COUNT(*) - COUNT(username) as sem_username
FROM user_profiles;

-- 7. Listar alguns usuários com seus usernames
SELECT 
    'Usuários com Username' as titulo,
    nome,
    username,
    u.email
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE username IS NOT NULL
ORDER BY nome
LIMIT 10;

-- 8. Testar a função get_user_by_username (substitua 'admin' por um username real)
-- SELECT * FROM get_user_by_username('admin');

-- 9. Verificar se há usernames duplicados
SELECT 
    'Verificação de Duplicatas' as titulo,
    username,
    COUNT(*) as quantidade
FROM user_profiles 
WHERE username IS NOT NULL
GROUP BY username 
HAVING COUNT(*) > 1;

-- 10. Resumo final
SELECT 
    'RESUMO DA CONFIGURAÇÃO' as titulo,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'username')
        THEN '✅ Coluna username criada'
        ELSE '❌ Coluna username não encontrada'
    END as coluna_username,
    
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_user_by_username')
        THEN '✅ Função get_user_by_username criada'
        ELSE '❌ Função get_user_by_username não encontrada'
    END as funcao_busca,
    
    CASE 
        WHEN EXISTS(SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_profiles_username')
        THEN '✅ Índice criado'
        ELSE '❌ Índice não encontrado'
    END as indice,
    
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'trigger_validate_username_unique')
        THEN '✅ Trigger criado'
        ELSE '❌ Trigger não encontrado'
    END as trigger_validacao; 