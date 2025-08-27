-- Configuração de Recuperação de Senha para OkContratos - Versão Corrigida
-- Execute este script em partes para evitar erros

-- PARTE 1: Criar tabela de tentativas de recuperação
CREATE TABLE IF NOT EXISTS password_recovery_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PARTE 2: Criar funções básicas
CREATE OR REPLACE FUNCTION check_user_exists(email_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM auth.users 
        WHERE email = email_address 
        AND email_confirmed_at IS NOT NULL
    ) INTO user_exists;
    
    RETURN user_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

CREATE OR REPLACE FUNCTION can_user_recover_password(email_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_profile_exists BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM user_profiles up
        JOIN auth.users u ON u.id = up.user_id
        WHERE u.email = email_address
        AND u.email_confirmed_at IS NOT NULL
    ) INTO user_profile_exists;
    
    RETURN user_profile_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PARTE 3: Habilitar RLS e criar políticas
ALTER TABLE password_recovery_attempts ENABLE ROW LEVEL SECURITY;

-- Política para administradores verem todas as tentativas
CREATE POLICY "Apenas admins podem ver tentativas de recuperação" ON password_recovery_attempts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND permissao = 'admin'
        )
    );

-- PARTE 4: Criar índices
CREATE INDEX IF NOT EXISTS idx_password_recovery_email ON password_recovery_attempts(email);
CREATE INDEX IF NOT EXISTS idx_password_recovery_created_at ON password_recovery_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_password_recovery_success ON password_recovery_attempts(success);

-- PARTE 5: Criar view de relatório (após garantir que a tabela existe)
CREATE OR REPLACE VIEW password_recovery_report AS
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

-- PARTE 6: Funções adicionais
CREATE OR REPLACE FUNCTION cleanup_old_recovery_attempts()
RETURNS VOID AS $$
BEGIN
    DELETE FROM password_recovery_attempts 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_recent_recovery_attempts(email_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    recent_attempts_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO recent_attempts_count
    FROM password_recovery_attempts
    WHERE email = email_address
    AND created_at > NOW() - INTERVAL '1 hour';
    
    -- Permitir no máximo 3 tentativas por hora
    RETURN recent_attempts_count < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_password_recovery_stats()
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

-- PARTE 7: Verificar se tudo foi criado
SELECT 'Configuração de recuperação de senha concluída com sucesso!' as status; 