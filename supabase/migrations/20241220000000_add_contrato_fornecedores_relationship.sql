-- Migração para adicionar suporte a múltiplos fornecedores por contrato
-- Criado em: 2024-12-20

-- 1. Criar tabela de relacionamento contrato_fornecedores
CREATE TABLE IF NOT EXISTS contrato_fornecedores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contrato_id UUID NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
    fornecedor_id UUID NOT NULL REFERENCES fornecedores(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(contrato_id, fornecedor_id)
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_contrato_fornecedores_contrato_id ON contrato_fornecedores(contrato_id);
CREATE INDEX IF NOT EXISTS idx_contrato_fornecedores_fornecedor_id ON contrato_fornecedores(fornecedor_id);

-- 3. Migrar dados existentes da tabela contratos para a nova tabela de relacionamento
INSERT INTO contrato_fornecedores (contrato_id, fornecedor_id)
SELECT id, fornecedor_id 
FROM contratos 
WHERE fornecedor_id IS NOT NULL
ON CONFLICT (contrato_id, fornecedor_id) DO NOTHING;

-- 4. Criar view para facilitar consultas de contratos com fornecedores
CREATE OR REPLACE VIEW vw_contratos_fornecedores AS
SELECT 
    c.id as contrato_id,
    c.numero,
    c.objeto,
    c.valor,
    c.data_inicio,
    c.data_termino,
    c.status,
    c.fundo_municipal,
    c.municipio_id,
    c.created_at,
    array_agg(f.id) as fornecedor_ids,
    array_agg(f.nome) as fornecedor_nomes,
    array_agg(f.cnpj) as fornecedor_cnpjs
FROM contratos c
LEFT JOIN contrato_fornecedores cf ON c.id = cf.contrato_id
LEFT JOIN fornecedores f ON cf.fornecedor_id = f.id
GROUP BY c.id, c.numero, c.objeto, c.valor, c.data_inicio, c.data_termino, c.status, c.fundo_municipal, c.municipio_id, c.created_at;

-- 5. Criar função para adicionar fornecedor a um contrato
CREATE OR REPLACE FUNCTION adicionar_fornecedor_contrato(
    p_contrato_id UUID,
    p_fornecedor_id UUID
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO contrato_fornecedores (contrato_id, fornecedor_id)
    VALUES (p_contrato_id, p_fornecedor_id)
    ON CONFLICT (contrato_id, fornecedor_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar função para remover fornecedor de um contrato
CREATE OR REPLACE FUNCTION remover_fornecedor_contrato(
    p_contrato_id UUID,
    p_fornecedor_id UUID
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM contrato_fornecedores 
    WHERE contrato_id = p_contrato_id AND fornecedor_id = p_fornecedor_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Criar função para obter fornecedores de um contrato
CREATE OR REPLACE FUNCTION obter_fornecedores_contrato(
    p_contrato_id UUID
)
RETURNS TABLE (
    fornecedor_id UUID,
    nome TEXT,
    cnpj TEXT,
    email TEXT,
    telefone TEXT,
    endereco TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.nome,
        f.cnpj,
        f.email,
        f.telefone,
        f.endereco
    FROM fornecedores f
    INNER JOIN contrato_fornecedores cf ON f.id = cf.fornecedor_id
    WHERE cf.contrato_id = p_contrato_id;
END;
$$ LANGUAGE plpgsql; 