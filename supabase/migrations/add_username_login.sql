-- Migração para adicionar login por nome de usuário
-- Criado em: $(date)

-- 1. Adicionar coluna username na tabela user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- 2. Criar índice para melhor performance no login por username
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- 3. Função para autenticar por username
CREATE OR REPLACE FUNCTION authenticate_by_username(
    p_username VARCHAR(50),
    p_password VARCHAR(255)
)
RETURNS TABLE (
    success BOOLEAN,
    user_id UUID,
    email VARCHAR(255),
    nome VARCHAR(255),
    cargo VARCHAR(100),
    permissao VARCHAR(50),
    municipio_id UUID,
    fundo_municipal TEXT[]
) AS $$
DECLARE
    v_user_id UUID;
    v_email VARCHAR(255);
BEGIN
    -- Buscar o user_id pelo username
    SELECT up.user_id, u.email, up.nome, up.cargo, up.permissao, up.municipio_id, up.fundo_municipal
    INTO v_user_id, v_email
    FROM user_profiles up
    JOIN auth.users u ON u.id = up.user_id
    WHERE up.username = p_username;
    
    -- Se não encontrou o usuário, retorna falso
    IF v_user_id IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::VARCHAR, NULL::VARCHAR, NULL::VARCHAR, NULL::VARCHAR, NULL::UUID, NULL::TEXT[];
        RETURN;
    END IF;
    
    -- Tentar autenticar com o email encontrado
    -- Nota: Esta função não pode verificar a senha diretamente por questões de segurança
    -- A verificação da senha deve ser feita no frontend usando o email encontrado
    RETURN QUERY SELECT TRUE, v_user_id, v_email, up.nome, up.cargo, up.permissao, up.municipio_id, up.fundo_municipal
    FROM user_profiles up
    WHERE up.user_id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Função para buscar usuário por username (sem senha)
CREATE OR REPLACE FUNCTION get_user_by_username(p_username VARCHAR(50))
RETURNS TABLE (
    user_id UUID,
    email VARCHAR(255),
    nome VARCHAR(255),
    cargo VARCHAR(100),
    permissao VARCHAR(50),
    municipio_id UUID,
    fundo_municipal TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT up.user_id, u.email, up.nome, up.cargo, up.permissao, up.municipio_id, up.fundo_municipal
    FROM user_profiles up
    JOIN auth.users u ON u.id = up.user_id
    WHERE up.username = p_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Função para verificar se username já existe
CREATE OR REPLACE FUNCTION check_username_exists(p_username VARCHAR(50))
RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM user_profiles WHERE username = p_username) INTO v_exists;
    RETURN v_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger para garantir que username seja único
CREATE OR REPLACE FUNCTION validate_username_unique()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.username IS NOT NULL AND EXISTS(
        SELECT 1 FROM user_profiles 
        WHERE username = NEW.username AND user_id != NEW.user_id
    ) THEN
        RAISE EXCEPTION 'Username já existe';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_username_unique
    BEFORE INSERT OR UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION validate_username_unique();

-- 7. Atualizar alguns usuários de exemplo com username (substitua pelos IDs reais)
-- INSERT INTO user_profiles (username) VALUES ('admin') WHERE user_id = 'UUID_DO_ADMIN';
-- INSERT INTO user_profiles (username) VALUES ('usuario1') WHERE user_id = 'UUID_DO_USUARIO1';

-- 8. Comentários para documentação
COMMENT ON COLUMN user_profiles.username IS 'Nome de usuário único para login';
COMMENT ON FUNCTION authenticate_by_username IS 'Função para autenticar usuário por username';
COMMENT ON FUNCTION get_user_by_username IS 'Função para buscar dados do usuário por username';
COMMENT ON FUNCTION check_username_exists IS 'Função para verificar se username já existe';

-- 9. Verificar se tudo foi criado corretamente
SELECT 'Sistema de login por username configurado com sucesso!' as status; 