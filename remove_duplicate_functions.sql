-- Script para remover funções duplicadas salvar_contrato_com_itens
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos listar todas as funções com esse nome para ver as assinaturas
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type,
    p.oid as function_oid
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'salvar_contrato_com_itens'
AND n.nspname = 'public';

-- 2. Remover TODAS as funções com esse nome (vamos recriar apenas a correta)
-- Execute estes comandos um por vez:

-- Remover a primeira função (se existir)
DROP FUNCTION IF EXISTS salvar_contrato_com_itens(
    p_fundo_municipal text[],
    p_objeto text,
    p_valor numeric,
    p_data_inicio date,
    p_data_termino date,
    p_fornecedor_id uuid,
    p_itens jsonb
);

-- Remover a segunda função (se existir)
DROP FUNCTION IF EXISTS salvar_contrato_com_itens(
    p_fundo_municipal text[],
    p_objeto text,
    p_valor numeric,
    p_data_inicio date,
    p_data_termino date,
    p_fornecedor_id text[],
    p_itens jsonb
);

-- Remover a terceira função (se existir)
DROP FUNCTION IF EXISTS salvar_contrato_com_itens(
    p_fundo_municipal text,
    p_objeto text,
    p_valor numeric,
    p_data_inicio date,
    p_data_termino date,
    p_fornecedor_id uuid,
    p_itens jsonb
);

-- 3. Agora vamos criar apenas a função correta (com p_fornecedor_id como UUID único)
CREATE OR REPLACE FUNCTION salvar_contrato_com_itens(
    p_fundo_municipal text[],
    p_objeto text,
    p_valor numeric,
    p_data_inicio date,
    p_data_termino date,
    p_fornecedor_id uuid,
    p_itens jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_contrato_id uuid;
    v_municipio_id uuid;
    v_item jsonb;
BEGIN
    -- Obter o município do usuário logado
    SELECT municipio_id INTO v_municipio_id
    FROM user_profiles
    WHERE user_id = auth.uid();
    
    IF v_municipio_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não possui município associado';
    END IF;

    -- Inserir o contrato
    INSERT INTO contratos (
        numero,
        fornecedor_id,
        fundo_municipal,
        objeto,
        valor,
        data_inicio,
        data_termino,
        municipio_id,
        status
    ) VALUES (
        'CONTRATO-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-' || LPAD(CAST(nextval('contrato_numero_seq') AS TEXT), 4, '0'),
        p_fornecedor_id,
        p_fundo_municipal,
        p_objeto,
        p_valor,
        p_data_inicio,
        p_data_termino,
        v_municipio_id,
        'Ativo'
    ) RETURNING id INTO v_contrato_id;

    -- Inserir itens se fornecidos
    IF p_itens IS NOT NULL AND jsonb_array_length(p_itens) > 0 THEN
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_itens)
        LOOP
            INSERT INTO itens (
                contrato_id,
                descricao,
                quantidade,
                unidade,
                valor_unitario,
                fundos,
                municipio_id
            ) VALUES (
                v_contrato_id,
                v_item->>'descricao',
                (v_item->>'quantidade')::numeric,
                v_item->>'unidade',
                (v_item->>'valor_unitario')::numeric,
                CASE 
                    WHEN v_item->'fundos' IS NOT NULL THEN 
                        ARRAY(SELECT jsonb_array_elements_text(v_item->'fundos'))
                    ELSE NULL
                END,
                v_municipio_id
            );
        END LOOP;
    END IF;

    -- Criar notificação
    INSERT INTO notificacoes (
        usuario_id,
        tipo,
        titulo,
        mensagem,
        dados,
        municipio_id
    ) VALUES (
        auth.uid(),
        'contrato_criado',
        'Novo contrato criado',
        'Contrato ' || v_contrato_id || ' foi criado com sucesso',
        jsonb_build_object('contrato_id', v_contrato_id),
        v_municipio_id
    );

    RETURN v_contrato_id;
END;
$$;

-- 4. Verificar se a função foi criada corretamente
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'salvar_contrato_com_itens'
AND n.nspname = 'public';

-- 5. Criar a sequência para números de contrato se não existir
CREATE SEQUENCE IF NOT EXISTS contrato_numero_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1; 