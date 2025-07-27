-- Dados iniciais para o sistema OkContratos
-- Execute após criar as tabelas com create_municipio_system.sql

-- 1. Inserir usuários de exemplo (você precisa criar os usuários no auth primeiro)
-- Execute estes comandos no Supabase Auth ou via API

-- Exemplo de como inserir perfil de usuário (substitua o UUID pelo ID real do usuário):
-- INSERT INTO user_profiles (user_id, nome, cargo, permissao, municipio_id) VALUES 
--     ('UUID_DO_USUARIO_ADMIN', 'Admin', 'Administrador', 'admin', '550e8400-e29b-41d4-a716-446655440001'),
--     ('UUID_DO_USUARIO_BASICO', 'Usuário Básico', 'Analista', 'basico', '550e8400-e29b-41d4-a716-446655440001');

-- 2. Função para criar perfil de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_nome VARCHAR(255);
    v_username VARCHAR(50);
BEGIN
    v_nome := COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário');
    
    -- Gerar username baseado no nome
    v_username := generate_username(v_nome);
    
    INSERT INTO public.user_profiles (user_id, nome, cargo, permissao, municipio_id, username)
    VALUES (
        NEW.id,
        v_nome,
        COALESCE(NEW.raw_user_meta_data->>'cargo', 'Analista'),
        COALESCE(NEW.raw_user_meta_data->>'permissao', 'basico'),
        '550e8400-e29b-41d4-a716-446655440001', -- Capela do Alto Alegre
        v_username
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger para criar perfil automaticamente quando usuário se registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Função para obter dados do município do usuário
CREATE OR REPLACE FUNCTION get_municipio_data()
RETURNS TABLE (
    municipio_id UUID,
    municipio_nome VARCHAR(255),
    municipio_uf VARCHAR(2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.nome,
        m.uf
    FROM municipios m
    INNER JOIN user_profiles up ON up.municipio_id = m.id
    WHERE up.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Função para listar fornecedores do município do usuário
CREATE OR REPLACE FUNCTION get_fornecedores_municipio()
RETURNS TABLE (
    id UUID,
    nome VARCHAR(255),
    cnpj VARCHAR(18),
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    municipio_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.nome,
        f.cnpj,
        f.email,
        f.telefone,
        f.endereco,
        f.municipio_id
    FROM fornecedores f
    INNER JOIN user_profiles up ON up.municipio_id = f.municipio_id
    WHERE up.user_id = auth.uid()
    ORDER BY f.nome;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Função para listar contratos do município do usuário
CREATE OR REPLACE FUNCTION get_contratos_municipio()
RETURNS TABLE (
    id UUID,
    numero VARCHAR(50),
    fornecedor_id UUID,
    valor DECIMAL,
    data_inicio DATE,
    data_fim DATE,
    status VARCHAR(50),
    municipio_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.numero,
        c.fornecedor_id,
        c.valor,
        c.data_inicio,
        c.data_fim,
        c.status,
        c.municipio_id
    FROM contratos c
    INNER JOIN user_profiles up ON up.municipio_id = c.municipio_id
    WHERE up.user_id = auth.uid()
    ORDER BY c.data_inicio DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Views para facilitar consultas
CREATE OR REPLACE VIEW vw_fornecedores_municipio AS
SELECT 
    f.*,
    m.nome as municipio_nome,
    m.uf as municipio_uf
FROM fornecedores f
INNER JOIN municipios m ON m.id = f.municipio_id
INNER JOIN user_profiles up ON up.municipio_id = f.municipio_id
WHERE up.user_id = auth.uid();

CREATE OR REPLACE VIEW vw_contratos_municipio AS
SELECT 
    c.*,
    f.nome as fornecedor_nome,
    m.nome as municipio_nome,
    m.uf as municipio_uf
FROM contratos c
INNER JOIN fornecedores f ON f.id = c.fornecedor_id
INNER JOIN municipios m ON m.id = c.municipio_id
INNER JOIN user_profiles up ON up.municipio_id = c.municipio_id
WHERE up.user_id = auth.uid();

-- 8. (Removido) Políticas de segurança para as views
-- As views não suportam RLS, então as políticas devem ser aplicadas apenas nas tabelas reais.

-- 9. Comentários para documentação
COMMENT ON FUNCTION get_municipio_data() IS 'Retorna dados do município do usuário logado';
COMMENT ON FUNCTION get_fornecedores_municipio() IS 'Retorna fornecedores do município do usuário logado';
COMMENT ON FUNCTION get_contratos_municipio() IS 'Retorna contratos do município do usuário logado';

-- 10. Verificar se tudo foi criado corretamente
SELECT 'Dados iniciais configurados com sucesso!' as status; 