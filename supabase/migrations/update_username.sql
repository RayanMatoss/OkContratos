-- Script para alterar username de um usuário
-- Substitua 'joaovictor' pelo username atual e 'novo_username' pelo novo username desejado

-- 1. Função para alterar username de forma segura
CREATE OR REPLACE FUNCTION update_user_username(
    p_current_username VARCHAR(50),
    p_new_username VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_exists BOOLEAN;
BEGIN
    -- Verificar se o usuário atual existe
    SELECT user_id INTO v_user_id
    FROM user_profiles
    WHERE username = p_current_username;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário com username % não encontrado', p_current_username;
    END IF;
    
    -- Verificar se o novo username já existe
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE username = p_new_username) INTO v_exists;
    
    IF v_exists THEN
        RAISE EXCEPTION 'Username % já existe', p_new_username;
    END IF;
    
    -- Atualizar o username
    UPDATE user_profiles 
    SET username = p_new_username
    WHERE user_id = v_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Exemplo de como usar a função:
-- SELECT update_user_username('joaovictor', 'joao_victor');

-- 3. Ou fazer a alteração diretamente:
-- UPDATE user_profiles 
-- SET username = 'novo_username' 
-- WHERE username = 'joaovictor';

-- 4. Verificar se a alteração foi feita:
-- SELECT nome, username, u.email
-- FROM user_profiles up
-- JOIN auth.users u ON u.id = up.user_id
-- WHERE up.user_id = (SELECT user_id FROM user_profiles WHERE username = 'novo_username');

-- 5. Comentário para documentação
COMMENT ON FUNCTION update_user_username IS 'Função para alterar username de um usuário de forma segura';

-- 6. Verificar se tudo foi criado corretamente
SELECT 'Função para alterar username criada com sucesso!' as status; 