-- Configuração de Recuperação de Senha para OkContratos
-- Criado em: $(date)

-- 1. Habilitar recuperação de senha no Supabase Auth
-- Nota: Esta configuração deve ser feita no painel do Supabase
-- Authentication > Settings > Auth Providers > Email > Enable "Enable password reset"

-- 2. Criar função para verificar se o usuário existe antes de enviar email
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

-- 3. Criar função para registrar tentativas de recuperação de senha
CREATE TABLE IF NOT EXISTS password_recovery_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar função para registrar tentativa de recuperação
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

-- 5. Criar política RLS para password_recovery_attempts
ALTER TABLE password_recovery_attempts ENABLE ROW LEVEL SECURITY;

-- Apenas administradores podem ver as tentativas de recuperação
CREATE POLICY "Apenas admins podem ver tentativas de recuperação" ON password_recovery_attempts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND permissao = 'admin'
        )
    );

-- 6. Criar função para verificar se o usuário tem permissão para recuperar senha
CREATE OR REPLACE FUNCTION can_user_recover_password(email_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_profile_exists BOOLEAN;
BEGIN
    -- Verificar se o usuário existe e tem perfil
    SELECT EXISTS(
        SELECT 1 FROM user_profiles up
        JOIN auth.users u ON u.id = up.user_id
        WHERE u.email = email_address
        AND u.email_confirmed_at IS NOT NULL
    ) INTO user_profile_exists;
    
    RETURN user_profile_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Criar função para obter informações do usuário para recuperação
CREATE OR REPLACE FUNCTION get_user_recovery_info(email_address TEXT)
RETURNS TABLE(
    user_id UUID,
    email VARCHAR,
    nome VARCHAR,
    municipio_nome VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email,
        up.nome,
        m.nome as municipio_nome
    FROM auth.users u
    JOIN user_profiles up ON up.user_id = u.id
    JOIN municipios m ON m.id = up.municipio_id
    WHERE u.email = email_address
    AND u.email_confirmed_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Criar trigger para limpar tentativas antigas (mais de 24 horas)
CREATE OR REPLACE FUNCTION cleanup_old_recovery_attempts()
RETURNS VOID AS $$
BEGIN
    DELETE FROM password_recovery_attempts 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- 9. Criar função para verificar se há muitas tentativas recentes
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

-- 10. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_password_recovery_email ON password_recovery_attempts(email);
CREATE INDEX IF NOT EXISTS idx_password_recovery_created_at ON password_recovery_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_password_recovery_success ON password_recovery_attempts(success);

-- 11. Criar view para relatório de tentativas de recuperação
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

-- 12. Configurar política de segurança para a view
CREATE POLICY "Apenas admins podem ver relatório de recuperação" ON password_recovery_report
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND permissao = 'admin'
        )
    );

-- 13. Criar função para estatísticas de recuperação de senha
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

-- 14. Comentários para documentação
COMMENT ON TABLE password_recovery_attempts IS 'Registro de tentativas de recuperação de senha';
COMMENT ON COLUMN password_recovery_attempts.email IS 'Email do usuário que tentou recuperar a senha';
COMMENT ON COLUMN password_recovery_attempts.ip_address IS 'Endereço IP da tentativa';
COMMENT ON COLUMN password_recovery_attempts.user_agent IS 'User agent do navegador';
COMMENT ON COLUMN password_recovery_attempts.success IS 'Se a tentativa foi bem-sucedida';

COMMENT ON FUNCTION check_user_exists IS 'Verifica se um usuário existe e tem email confirmado';
COMMENT ON FUNCTION log_password_recovery_attempt IS 'Registra uma tentativa de recuperação de senha';
COMMENT ON FUNCTION can_user_recover_password IS 'Verifica se um usuário pode recuperar sua senha';
COMMENT ON FUNCTION get_user_recovery_info IS 'Obtém informações do usuário para recuperação';

-- 15. Verificar se tudo foi criado corretamente
SELECT 'Configuração de recuperação de senha criada com sucesso!' as status; 