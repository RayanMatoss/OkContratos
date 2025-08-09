# Recuperação de Senha - OkContratos

Este documento explica como configurar e usar a funcionalidade de recuperação de senha no sistema OkContratos.

## 📋 Funcionalidades Implementadas

### 1. Páginas Criadas
- **`/recuperar-senha`** - Página para solicitar recuperação de senha
- **`/redefinir-senha`** - Página para definir nova senha após clicar no link

### 2. Componentes
- Interface moderna e responsiva
- Validação de formulários
- Feedback visual para o usuário
- Integração com o sistema de notificações

### 3. Segurança
- Verificação de existência do usuário
- Limitação de tentativas por hora
- Registro de tentativas de recuperação
- Links de recuperação com expiração

## 🚀 Configuração no Supabase

### 1. Habilitar Recuperação de Senha

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **Authentication > Settings**
4. Em **Auth Providers > Email**, habilite:
   - ✅ **Enable password reset**
   - ✅ **Enable email confirmations**

### 2. Configurar Email SMTP (Opcional)

Para usar um servidor SMTP personalizado:

1. Vá para **Authentication > Settings > SMTP Settings**
2. Configure seu servidor SMTP:
   ```
   Host: seu-servidor-smtp.com
   Port: 587
   Username: seu-email@dominio.com
   Password: sua-senha
   ```

### 3. Executar Script SQL

Execute o script `supabase/migrations/password_recovery_setup.sql` no SQL Editor do Supabase:

```sql
-- Copie e cole o conteúdo do arquivo password_recovery_setup.sql
-- Este script criará:
-- - Tabela password_recovery_attempts
-- - Funções de verificação e registro
-- - Políticas de segurança (RLS)
-- - Views para relatórios
```

### 4. Configurar URL de Redirecionamento

1. Vá para **Authentication > Settings > URL Configuration**
2. Adicione suas URLs:
   ```
   Site URL: https://seu-dominio.com
   Redirect URLs: 
   - https://seu-dominio.com/redefinir-senha
   - http://localhost:5173/redefinir-senha (para desenvolvimento)
   ```

## 📧 Configuração de Email

### Template de Email (Opcional)

Você pode personalizar o template de email no Supabase:

1. Vá para **Authentication > Email Templates**
2. Selecione **Password Reset**
3. Personalize o template:

```html
<h2>Recuperação de Senha - OkContratos</h2>
<p>Olá,</p>
<p>Você solicitou a recuperação de sua senha no sistema OkContratos.</p>
<p>Clique no link abaixo para redefinir sua senha:</p>
<a href="{{ .ConfirmationURL }}">Redefinir Senha</a>
<p>Este link expira em 24 horas.</p>
<p>Se você não solicitou esta recuperação, ignore este email.</p>
<p>Atenciosamente,<br>Equipe OkContratos</p>
```

## 🔧 Uso da Funcionalidade

### 1. Solicitar Recuperação

1. Na página de login, clique em "Esqueceu a senha?"
2. Digite seu email cadastrado
3. Clique em "Enviar Link de Recuperação"
4. Verifique sua caixa de entrada

### 2. Redefinir Senha

1. Clique no link recebido por email
2. Digite sua nova senha
3. Confirme a nova senha
4. Clique em "Redefinir Senha"
5. Você será redirecionado para o login

## 🛡️ Recursos de Segurança

### 1. Limitação de Tentativas
- Máximo 3 tentativas por hora por email
- Registro de IP e User Agent
- Limpeza automática de tentativas antigas

### 2. Verificações
- Email deve estar confirmado
- Usuário deve ter perfil no sistema
- Link de recuperação com expiração

### 3. Monitoramento
- Relatórios de tentativas de recuperação
- Estatísticas de sucesso/falha
- Logs para administradores

## 📊 Relatórios e Monitoramento

### Visualizar Tentativas de Recuperação

```sql
-- Ver todas as tentativas
SELECT * FROM password_recovery_report;

-- Ver estatísticas
SELECT * FROM get_password_recovery_stats();

-- Ver tentativas recentes (últimas 24h)
SELECT * FROM password_recovery_attempts 
WHERE created_at > NOW() - INTERVAL '24 hours';
```

### Limpar Tentativas Antigas

```sql
-- Executar limpeza manual
SELECT cleanup_old_recovery_attempts();
```

## 🔍 Troubleshooting

### Problemas Comuns

1. **Email não recebido**
   - Verificar configuração SMTP
   - Verificar pasta de spam
   - Verificar se o email está confirmado

2. **Link não funciona**
   - Verificar URLs de redirecionamento
   - Verificar se o link não expirou
   - Verificar configuração de domínio

3. **Erro "Usuário não encontrado"**
   - Verificar se o usuário tem perfil no sistema
   - Verificar se o email está correto
   - Verificar se o email está confirmado

### Logs de Debug

```sql
-- Verificar usuários sem perfil
SELECT u.email, u.email_confirmed_at 
FROM auth.users u 
LEFT JOIN user_profiles up ON u.id = up.user_id 
WHERE up.user_id IS NULL;

-- Verificar tentativas de recuperação
SELECT email, success, created_at, ip_address 
FROM password_recovery_attempts 
ORDER BY created_at DESC;
```

## 📝 Notas Importantes

1. **Desenvolvimento**: Use `http://localhost:5173` nas URLs de redirecionamento
2. **Produção**: Use `https://seu-dominio.com` nas URLs de redirecionamento
3. **Segurança**: Monitore regularmente os logs de tentativas
4. **Backup**: Mantenha backup das configurações de email

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique os logs no Supabase Dashboard
2. Consulte a documentação do Supabase Auth
3. Entre em contato com a equipe de desenvolvimento 