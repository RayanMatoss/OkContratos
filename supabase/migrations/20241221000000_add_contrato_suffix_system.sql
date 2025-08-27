-- Migração para implementar sistema de sufixos nos contratos
-- Criado em: 2024-12-21
-- Objetivo: Permitir múltiplos contratos com a mesma numeração base (ex: 001.1/2025, 001.2/2025)

-- 1. Adicionar coluna de sufixo na tabela contratos
ALTER TABLE contratos 
ADD COLUMN IF NOT EXISTS sufixo VARCHAR(10) DEFAULT '1';

-- 2. Adicionar coluna de contrato_base_id para relacionar contratos com a mesma numeração
ALTER TABLE contratos 
ADD COLUMN IF NOT EXISTS contrato_base_id UUID;

-- 3. Criar índice para melhor performance na busca por contratos base
CREATE INDEX IF NOT EXISTS idx_contratos_base_id ON contratos(contrato_base_id);
CREATE INDEX IF NOT EXISTS idx_contratos_numero_sufixo ON contratos(numero, sufixo);

-- 4. Função para gerar sufixo automático para um contrato
CREATE OR REPLACE FUNCTION gerar_sufixo_contrato(p_numero VARCHAR(50), p_ano VARCHAR(4))
RETURNS VARCHAR(10) AS $$
DECLARE
    v_proximo_sufixo INTEGER;
    v_sufixo VARCHAR(10);
BEGIN
    -- Buscar o maior sufixo existente para este número e ano
    SELECT COALESCE(MAX(CAST(sufixo AS INTEGER)), 0) + 1
    INTO v_proximo_sufixo
    FROM contratos 
    WHERE numero = p_numero 
    AND EXTRACT(YEAR FROM data_inicio) = CAST(p_ano AS INTEGER);
    
    -- Retornar o sufixo como string
    RETURN v_proximo_sufixo::VARCHAR(10);
END;
$$ LANGUAGE plpgsql;

-- 5. Função para criar múltiplos contratos com a mesma numeração
CREATE OR REPLACE FUNCTION criar_contratos_multiplos_fornecedores(
    p_numero VARCHAR(50),
    p_objeto TEXT,
    p_valor DECIMAL,
    p_data_inicio DATE,
    p_data_termino DATE,
    p_fundo_municipal TEXT[],
    p_municipio_id UUID,
    p_fornecedor_ids UUID[]
)
RETURNS TABLE (
    contrato_id UUID,
    numero_completo VARCHAR(60),
    fornecedor_id UUID,
    sufixo VARCHAR(10)
) AS $$
DECLARE
    v_ano VARCHAR(4);
    v_contrato_base_id UUID;
    v_fornecedor_id UUID;
    v_sufixo VARCHAR(10);
    v_numero_completo VARCHAR(60);
    v_novo_contrato_id UUID;
BEGIN
    -- Gerar ID base para relacionar os contratos
    v_contrato_base_id := gen_random_uuid();
    
    -- Extrair ano da data de início
    v_ano := EXTRACT(YEAR FROM p_data_inicio)::VARCHAR(4);
    
    -- Criar um contrato para cada fornecedor
    FOREACH v_fornecedor_id IN ARRAY p_fornecedor_ids
    LOOP
        -- Gerar sufixo único para este contrato
        v_sufixo := gerar_sufixo_contrato(p_numero, v_ano);
        
        -- Criar o contrato
        INSERT INTO contratos (
            numero,
            sufixo,
            contrato_base_id,
            objeto,
            valor,
            data_inicio,
            data_termino,
            fundo_municipal,
            municipio_id,
            fornecedor_id,
            status
        ) VALUES (
            p_numero,
            v_sufixo,
            v_contrato_base_id,
            p_objeto,
            p_valor,
            p_data_inicio,
            p_data_termino,
            p_fundo_municipal,
            p_municipio_id,
            v_fornecedor_id,
            'ativo'
        ) RETURNING id INTO v_novo_contrato_id;
        
        -- Formatar número completo (ex: 001.1/2025)
        v_numero_completo := p_numero || '.' || v_sufixo || '/' || v_ano;
        
        -- Retornar dados do contrato criado
        RETURN QUERY SELECT v_novo_contrato_id, v_numero_completo, v_fornecedor_id, v_sufixo;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 6. Função para obter todos os contratos relacionados (mesma numeração base)
CREATE OR REPLACE FUNCTION obter_contratos_relacionados(p_contrato_id UUID)
RETURNS TABLE (
    id UUID,
    numero VARCHAR(50),
    sufixo VARCHAR(10),
    numero_completo VARCHAR(60),
    fornecedor_id UUID,
    fornecedor_nome VARCHAR(255),
    valor DECIMAL,
    status VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.numero,
        c.sufixo,
        c.numero || '.' || c.sufixo || '/' || EXTRACT(YEAR FROM c.data_inicio) as numero_completo,
        c.fornecedor_id,
        f.nome as fornecedor_nome,
        c.valor,
        c.status
    FROM contratos c
    INNER JOIN fornecedores f ON f.id = c.fornecedor_id
    WHERE c.contrato_base_id = (
        SELECT contrato_base_id 
        FROM contratos 
        WHERE id = p_contrato_id
    )
    ORDER BY c.sufixo;
END;
$$ LANGUAGE plpgsql;

-- 7. View para exibir contratos com numeração completa
CREATE OR REPLACE VIEW vw_contratos_completos AS
SELECT 
    c.id,
    c.numero,
    c.sufixo,
    c.numero || '.' || c.sufixo || '/' || EXTRACT(YEAR FROM c.data_inicio) as numero_completo,
    c.objeto,
    c.valor,
    c.data_inicio,
    c.data_termino,
    c.status,
    c.fundo_municipal,
    c.municipio_id,
    c.fornecedor_id,
    c.contrato_base_id,
    f.nome as fornecedor_nome,
    f.cnpj as fornecedor_cnpj,
    m.nome as municipio_nome,
    c.created_at
FROM contratos c
INNER JOIN fornecedores f ON f.id = c.fornecedor_id
INNER JOIN municipios m ON m.id = c.municipio_id;

-- 8. Comentários para documentação
COMMENT ON COLUMN contratos.sufixo IS 'Sufixo para diferenciar contratos com a mesma numeração base';
COMMENT ON COLUMN contratos.contrato_base_id IS 'ID para relacionar contratos com a mesma numeração base';
COMMENT ON FUNCTION gerar_sufixo_contrato IS 'Gera sufixo automático para contratos com a mesma numeração';
COMMENT ON FUNCTION criar_contratos_multiplos_fornecedores IS 'Cria múltiplos contratos para diferentes fornecedores com a mesma numeração base';
COMMENT ON FUNCTION obter_contratos_relacionados IS 'Retorna todos os contratos relacionados pela mesma numeração base';
COMMENT ON VIEW vw_contratos_completos IS 'View para exibir contratos com numeração completa (ex: 001.1/2025)';

-- 9. Verificar se tudo foi criado corretamente
SELECT 'Sistema de sufixos de contratos configurado com sucesso!' as status; 