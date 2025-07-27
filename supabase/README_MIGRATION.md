# Migração do Sistema de Municípios - OkContratos

Este documento contém as instruções para implementar o sistema de municípios no seu banco de dados Supabase.

## 📋 Pré-requisitos

- Acesso ao painel do Supabase
- Tabelas existentes: `fornecedores`, `contratos`, `ordens`, `itens` (se não existirem, serão criadas automaticamente)

## 🚀 Passos para Implementação

### 1. Acesse o SQL Editor do Supabase

1. Faça login no [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **SQL Editor** no menu lateral

### 2. Execute o Script Principal

Copie e cole o conteúdo do arquivo `create_municipio_system.sql` no SQL Editor e execute.

**Este script irá:**
- ✅ Criar tabela `municipios`
- ✅ Adicionar município "Capela do Alto Alegre"
- ✅ Criar tabela `user_profiles`
- ✅ Adicionar coluna `municipio_id` em todas as tabelas
- ✅ Criar índices para performance
- ✅ Configurar RLS (Row Level Security)
- ✅ Criar triggers automáticos

### 3. Execute o Script de Dados Iniciais

Copie e cole o conteúdo do arquivo `insert_initial_data.sql` no SQL Editor e execute.

**Este script irá:**
- ✅ Configurar trigger para criar perfil automático
- ✅ Criar funções para consultas por município
- ✅ Criar views para facilitar consultas
- ✅ Configurar políticas de segurança

### 4. Criar Usuários no Auth

No painel do Supabase, vá para **Authentication > Users** e crie os usuários:

**Usuário Admin:**
- Email: `admin@sistema.gov.br`
- Senha: `senha123`

**Usuário Básico:**
- Email: `usuario@sistema.gov.br`
- Senha: `senha123`

### 5. Verificar Implementação

Execute esta query para verificar se tudo foi criado corretamente:

```sql
-- Verificar municípios
SELECT * FROM municipios;

-- Verificar perfis de usuário
SELECT up.*, m.nome as municipio_nome 
FROM user_profiles up 
JOIN municipios m ON m.id = up.municipio_id;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 🔧 Funcionalidades Implementadas

### Segurança por Município
- ✅ Usuários só veem dados do seu município
- ✅ RLS (Row Level Security) ativo em todas as tabelas
- ✅ Políticas de acesso configuradas

### Triggers Automáticos
- ✅ Município adicionado automaticamente aos novos registros
- ✅ Perfil de usuário criado automaticamente no registro
- ✅ Timestamps atualizados automaticamente

### Funções Úteis
- ✅ `get_municipio_data()` - Dados do município do usuário
- ✅ `get_fornecedores_municipio()` - Fornecedores do município
- ✅ `get_contratos_municipio()` - Contratos do município

### Views Otimizadas
- ✅ `vw_fornecedores_municipio` - Fornecedores com dados do município
- ✅ `vw_contratos_municipio` - Contratos com dados do fornecedor e município

## 🛠️ Como Usar no Frontend

### Exemplo de Consulta

```typescript
// Buscar fornecedores do município do usuário
const { data: fornecedores } = await supabase
  .from('vw_fornecedores_municipio')
  .select('*');

// Buscar contratos do município do usuário
const { data: contratos } = await supabase
  .from('vw_contratos_municipio')
  .select('*');
```

### Exemplo de Inserção

```typescript
// O município será adicionado automaticamente
const { data, error } = await supabase
  .from('fornecedores')
  .insert({
    nome: 'Nova Empresa',
    cnpj: '12.345.678/0001-90',
    email: 'contato@empresa.com'
  });
```

## 🔍 Troubleshooting

### Erro: "Tabela não existe"
Se alguma tabela não existir, crie-a primeiro:

```sql
-- Exemplo para criar tabela fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Erro: "Política já existe"
Se alguma política já existir, remova-a primeiro:

```sql
DROP POLICY IF EXISTS "Nome da Política" ON nome_da_tabela;
```

### Verificar RLS
Para verificar se o RLS está funcionando:

```sql
-- Testar como usuário anônimo
SELECT * FROM fornecedores; -- Deve retornar vazio

-- Testar como usuário autenticado
-- (Execute após fazer login)
SELECT * FROM fornecedores; -- Deve retornar apenas dados do município
```

## 📞 Suporte

Se encontrar problemas, verifique:
1. ✅ Logs do Supabase
2. ✅ Políticas RLS ativas
3. ✅ Usuário autenticado corretamente
4. ✅ Perfil de usuário criado

---

**Sistema de Municípios implementado com sucesso! 🎉** 