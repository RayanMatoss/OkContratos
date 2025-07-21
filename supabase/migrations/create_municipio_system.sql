-- Sistema de Municípios para OkContratos
-- Criado em: $(date)

-- 1. Criar tabela de municípios
CREATE TABLE IF NOT EXISTS municipios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    uf VARCHAR(2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Adicionar município Capela do Alto Alegre
INSERT INTO municipios (id, nome, uf) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Capela do Alto Alegre', 'BA')
ON CONFLICT (id) DO NOTHING;

-- 3. Adicionar coluna municipio_id na tabela de usuários (se existir)
-- Se a tabela auth.users não existir, você pode criar uma tabela de perfis
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    permissao VARCHAR(50) DEFAULT 'basico',
    municipio_id UUID REFERENCES municipios(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 4. Adicionar coluna municipio_id na tabela de fornecedores
ALTER TABLE fornecedores 
ADD COLUMN IF NOT EXISTS municipio_id UUID REFERENCES municipios(id) ON DELETE RESTRICT;

-- 5. Adicionar coluna municipio_id na tabela de contratos
ALTER TABLE contratos 
ADD COLUMN IF NOT EXISTS municipio_id UUID REFERENCES municipios(id) ON DELETE RESTRICT;

-- 6. Adicionar coluna municipio_id na tabela de ordens (se existir)
ALTER TABLE ordens 
ADD COLUMN IF NOT EXISTS municipio_id UUID REFERENCES municipios(id) ON DELETE RESTRICT;

-- 7. Adicionar coluna municipio_id na tabela de itens (se existir)
ALTER TABLE itens 
ADD COLUMN IF NOT EXISTS municipio_id UUID REFERENCES municipios(id) ON DELETE RESTRICT;

-- 8. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_fornecedores_municipio ON fornecedores(municipio_id);
CREATE INDEX IF NOT EXISTS idx_contratos_municipio ON contratos(municipio_id);
CREATE INDEX IF NOT EXISTS idx_ordens_municipio ON ordens(municipio_id);
CREATE INDEX IF NOT EXISTS idx_itens_municipio ON itens(municipio_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_municipio ON user_profiles(municipio_id);

-- 9. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Criar triggers para atualizar updated_at
CREATE TRIGGER update_municipios_updated_at 
    BEFORE UPDATE ON municipios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Criar RLS (Row Level Security) para filtrar por município
-- Habilitar RLS nas tabelas
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 12. Criar políticas de segurança
-- Política para fornecedores (usuário só vê fornecedores do seu município)
CREATE POLICY "Usuários podem ver fornecedores do seu município" ON fornecedores
    FOR ALL USING (
        municipio_id IN (
            SELECT municipio_id FROM user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Política para contratos
CREATE POLICY "Usuários podem ver contratos do seu município" ON contratos
    FOR ALL USING (
        municipio_id IN (
            SELECT municipio_id FROM user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Política para ordens
CREATE POLICY "Usuários podem ver ordens do seu município" ON ordens
    FOR ALL USING (
        municipio_id IN (
            SELECT municipio_id FROM user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Política para itens
CREATE POLICY "Usuários podem ver itens do seu município" ON itens
    FOR ALL USING (
        municipio_id IN (
            SELECT municipio_id FROM user_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Política para user_profiles (usuário só vê seu próprio perfil)
CREATE POLICY "Usuários podem ver seu próprio perfil" ON user_profiles
    FOR ALL USING (user_id = auth.uid());

-- 13. Função para obter município do usuário atual
CREATE OR REPLACE FUNCTION get_user_municipio()
RETURNS UUID AS $$
DECLARE
    user_municipio_id UUID;
BEGIN
    SELECT municipio_id INTO user_municipio_id
    FROM user_profiles
    WHERE user_id = auth.uid();
    
    RETURN user_municipio_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Função para adicionar município automaticamente aos dados
CREATE OR REPLACE FUNCTION add_municipio_to_data()
RETURNS TRIGGER AS $$
BEGIN
    NEW.municipio_id = get_user_municipio();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 15. Triggers para adicionar município automaticamente
CREATE TRIGGER add_municipio_to_fornecedores
    BEFORE INSERT ON fornecedores
    FOR EACH ROW EXECUTE FUNCTION add_municipio_to_data();

CREATE TRIGGER add_municipio_to_contratos
    BEFORE INSERT ON contratos
    FOR EACH ROW EXECUTE FUNCTION add_municipio_to_data();

CREATE TRIGGER add_municipio_to_ordens
    BEFORE INSERT ON ordens
    FOR EACH ROW EXECUTE FUNCTION add_municipio_to_data();

CREATE TRIGGER add_municipio_to_itens
    BEFORE INSERT ON itens
    FOR EACH ROW EXECUTE FUNCTION add_municipio_to_data();

-- 16. Comentários para documentação
COMMENT ON TABLE municipios IS 'Tabela de municípios do sistema';
COMMENT ON COLUMN municipios.nome IS 'Nome do município';
COMMENT ON COLUMN municipios.uf IS 'Sigla do estado (UF)';

COMMENT ON TABLE user_profiles IS 'Perfis de usuários com informações municipais';
COMMENT ON COLUMN user_profiles.municipio_id IS 'Município vinculado ao usuário';

-- 17. Verificar se tudo foi criado corretamente
SELECT 'Sistema de municípios criado com sucesso!' as status; 