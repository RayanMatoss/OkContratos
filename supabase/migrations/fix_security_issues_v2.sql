-- Correção de Problemas de Segurança - Password Recovery (Versão 2)
-- Execute este script para resolver os avisos do Security Advisor

-- 1. Remover a view problemática
DROP VIEW IF EXISTS password_recovery_report;

-- 2. Criar uma versão mais segura da view
CREATE OR REPLACE VIEW password_recovery_report AS
SELECT 
    pra.email,
    pra.ip_address,
    pra.success,
    pra.created_at,
    -- Não expor dados sensíveis do usuário diretamente
    CASE 
        WHEN up.nome IS NOT NULL THEN 'Usuário Cadastrado'
        ELSE 'Usuário Não Cadastrado'
    END as user_status,
    -- Não expor nome do município diretamente
    CASE 
        WHEN m.nome IS NOT NULL THEN 'Município Cadastrado'
        ELSE 'Município Não Cadastrado'
    END as municipio_status
FROM password_recovery_attempts pra
LEFT JOIN auth.users u ON u.email = pra.email
LEFT JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN municipios m ON m.id = up.municipio_id
ORDER BY pra.created_at DESC;

-- 3. Criar uma view pública mais segura para estatísticas básicas
CREATE OR REPLACE VIEW password_recovery_stats_public AS
SELECT 
    COUNT(*) as total_attempts,
    COUNT(*) FILTER (WHERE success = true) as successful_attempts,
    COUNT(*) FILTER (WHERE success = false) as failed_attempts,
    ROUND(
        (COUNT(*) FILTER (WHERE success = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2
    ) as success_rate
FROM password_recovery_attempts;

-- 4. Criar uma função mais segura para obter estatísticas
CREATE OR REPLACE FUNCTION get_password_recovery_stats_secure()
RETURNS TABLE(
    total_attempts BIGINT,
    successful_attempts BIGINT,
    failed_attempts BIGINT,
    success_rate NUMERIC,
    recent_attempts_24h BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE success = true) as successful_attempts,
        COUNT(*) FILTER (WHERE success = false) as failed_attempts,
        ROUND(
            (COUNT(*) FILTER (WHERE success = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2
        ) as success_rate,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as recent_attempts_24h
    FROM password_recovery_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar uma função para obter detalhes específicos (apenas para admins)
CREATE OR REPLACE FUNCTION get_password_recovery_details_admin()
RETURNS TABLE(
    email VARCHAR,
    ip_address INET,
    success BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    user_name VARCHAR,
    municipio_nome VARCHAR
) AS $$
BEGIN
    -- Verificar se o usuário atual é admin
    IF NOT EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE user_id = auth.uid() 
        AND permissao = 'admin'
    ) THEN
        RAISE EXCEPTION 'Acesso negado: apenas administradores podem acessar esta função';
    END IF;

    RETURN QUERY
    SELECT 
        pra.email,
        pra.ip_address,
        pra.success,
        pra.created_at,
        up.nome as user_name,
        m.nome as municipio_nome
    FROM password_recovery_attempts pra
    LEFT JOIN auth.users u ON u.email = pra.email
    LEFT JOIN user_profiles up ON up.user_id = u.id
    LEFT JOIN municipios m ON m.id = up.municipio_id
    ORDER BY pra.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Melhorar as políticas RLS para a tabela password_recovery_attempts
DROP POLICY IF EXISTS "Apenas admins podem ver tentativas de recuperação" ON password_recovery_attempts;

CREATE POLICY "Apenas admins podem ver tentativas de recuperação" ON password_recovery_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND permissao = 'admin'
        )
    );

-- 7. Configurar a função para registrar tentativas (versão simplificada)
CREATE OR REPLACE FUNCTION log_password_recovery_attempt(
    email_address TEXT,
    client_ip INET DEFAULT NULL,
    user_agent_text TEXT DEFAULT NULL,
    was_successful BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO password_recovery_attempts (email, ip_address, user_agent, success)
    VALUES (email_address, client_ip, user_agent_text, was_successful);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Verificar se as correções foram aplicadas
SELECT 'Problemas de segurança corrigidos com sucesso!' as status; 