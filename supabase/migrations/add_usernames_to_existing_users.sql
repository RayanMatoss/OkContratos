-- Script para adicionar usernames aos usuários existentes
-- Execute após a migração add_username_login.sql

-- 1. Função para gerar username baseado no nome do usuário
CREATE OR REPLACE FUNCTION generate_username(nome VARCHAR(255))
RETURNS VARCHAR(50) AS $$
DECLARE
    base_username VARCHAR(50);
    final_username VARCHAR(50);
    counter INTEGER := 1;
BEGIN
    -- Remove acentos e caracteres especiais, converte para minúsculas
    base_username := lower(regexp_replace(nome, '[^a-zA-Z0-9]', '', 'g'));
    
    -- Remove espaços e limita a 20 caracteres
    base_username := substring(replace(base_username, ' ', ''), 1, 20);
    
    -- Se base_username estiver vazio, usa 'usuario'
    IF base_username = '' THEN
        base_username := 'usuario';
    END IF;
    
    final_username := base_username;
    
    -- Verifica se username já existe e adiciona número se necessário
    WHILE EXISTS(SELECT 1 FROM user_profiles WHERE username = final_username) LOOP
        final_username := base_username || counter::VARCHAR;
        counter := counter + 1;
        
        -- Evita loop infinito
        IF counter > 1000 THEN
            final_username := base_username || floor(random() * 10000)::VARCHAR;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN final_username;
END;
$$ LANGUAGE plpgsql;

-- 2. Atualizar usuários existentes com username
UPDATE user_profiles 
SET username = generate_username(nome)
WHERE username IS NULL;

-- 3. Verificar se todos os usuários têm username
SELECT 
    COUNT(*) as total_users,
    COUNT(username) as users_with_username,
    COUNT(*) - COUNT(username) as users_without_username
FROM user_profiles;

-- 4. Mostrar os usernames gerados
SELECT 
    nome,
    username,
    u.email
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
ORDER BY nome;

-- 5. Comentário para documentação
COMMENT ON FUNCTION generate_username IS 'Função para gerar username único baseado no nome do usuário';

-- 6. Verificar se tudo foi configurado corretamente
SELECT 'Usernames adicionados aos usuários existentes com sucesso!' as status;  