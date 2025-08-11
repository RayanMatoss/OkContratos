# Configuração do Login por Nome de Usuário

Este documento explica como configurar o sistema para usar login por nome de usuário em vez de email.

## Alterações Realizadas

### 1. Banco de Dados

#### Migração `add_username_login.sql`
- Adiciona coluna `username` na tabela `user_profiles`
- Cria função `get_user_by_username()` para buscar usuário por username
- Cria função `check_username_exists()` para verificar duplicatas
- Adiciona trigger para garantir unicidade do username
- Cria índice para melhor performance

#### Migração `add_usernames_to_existing_users.sql`
- Cria função `generate_username()` para gerar usernames únicos
- Atualiza usuários existentes com usernames baseados em seus nomes
- Mostra estatísticas dos usuários atualizados

### 2. Frontend

#### Hook `useAuth.tsx`
- Modifica função `login()` para aceitar username em vez de email
- Implementa busca do email pelo username antes da autenticação
- Mantém compatibilidade com o sistema de municípios e fundos

#### Página `Login.tsx`
- Altera campo de entrada de "Email" para "Nome de Usuário"
- Atualiza mensagens de erro para refletir a mudança
- Mantém todas as outras funcionalidades (município, fundos, etc.)

## Como Aplicar as Migrações

### 1. Execute as migrações no Supabase

```sql
-- Execute primeiro
\i supabase/migrations/add_username_login.sql

-- Execute depois
\i supabase/migrations/add_usernames_to_existing_users.sql
```

### 2. Verifique os Usernames Gerados

Após executar as migrações, verifique os usernames gerados:

```sql
SELECT 
    nome,
    username,
    email
FROM user_profiles up
JOIN auth.users u ON u.id = up.user_id
ORDER BY nome;
```

### 3. Teste o Login

1. Use um dos usernames gerados para fazer login
2. Digite a senha correspondente ao email do usuário
3. Selecione o município e fundos/secretarias
4. O sistema deve autenticar normalmente

## Como Funciona

1. **Login por Username**: O usuário digita seu nome de usuário em vez do email
2. **Busca do Email**: O sistema busca o email correspondente ao username
3. **Autenticação**: Usa o email encontrado para autenticar no Supabase Auth
4. **Validações**: Mantém todas as validações de município e fundos/secretarias

## Geração Automática de Username

Para novos usuários, o username é gerado automaticamente baseado no nome:
- Remove acentos e caracteres especiais
- Converte para minúsculas
- Remove espaços
- Adiciona número se necessário para garantir unicidade

**Exemplos:**
- "João Silva" → "joaosilva"
- "Maria Santos" → "mariasantos"
- "João Silva" (segundo) → "joaosilva1"

## Compatibilidade

- ✅ Usuários existentes continuam funcionando
- ✅ Sistema de municípios mantido
- ✅ Sistema de fundos/secretarias mantido
- ✅ Todas as permissões mantidas
- ✅ Recuperação de senha ainda funciona por email

## Próximos Passos

1. Teste o login com usuários existentes
2. Verifique se novos usuários recebem usernames automaticamente
3. Considere adicionar uma tela para usuários alterarem seus usernames
4. Implemente validação de formato de username se necessário

## Troubleshooting

### Erro: "Username já existe"
- Execute novamente a migração `add_usernames_to_existing_users.sql`
- Verifique se não há conflitos manuais

### Erro: "Função não encontrada"
- Certifique-se de que executou `add_username_login.sql` primeiro
- Verifique se as funções foram criadas corretamente

### Login não funciona
- Verifique se o username foi gerado corretamente
- Confirme se o email correspondente existe no auth.users
- Teste o login com email para verificar se a senha está correta 