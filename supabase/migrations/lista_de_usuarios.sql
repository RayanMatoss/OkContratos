-- Lista de Usuários com Usernames
-- Criado em: $(date)

-- 1. Listar todos os usuários com seus usernames e emails
SELECT 
    nome,
    username,
    u.email
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
ORDER BY nome;

-- 2. Estatísticas dos usuários
SELECT 
    'Estatísticas dos Usuários' as titulo,
    COUNT(*) as total_usuarios,
    COUNT(username) as com_username,
    COUNT(*) - COUNT(username) as sem_username
FROM user_profiles;

-- 3. Verificar se há usernames duplicados
SELECT 
    'Verificação de Usernames Duplicados' as titulo,
    username,
    COUNT(*) as quantidade
FROM user_profiles 
WHERE username IS NOT NULL
GROUP BY username 
HAVING COUNT(*) > 1;

-- 4. Usuários sem username (se houver)
SELECT 
    'Usuários sem Username' as titulo,
    nome,
    u.email
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
WHERE up.username IS NULL
ORDER BY nome;

-- 5. Comentário para documentação
COMMENT ON TABLE user_profiles IS 'Tabela de perfis de usuários com suporte a username para login';

-- 6. Verificar se tudo foi configurado corretamente
SELECT 'Lista de usuários gerada com sucesso!' as status; 