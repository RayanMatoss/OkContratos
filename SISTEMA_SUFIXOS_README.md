# Sistema de Sufixos para Contratos - OkContratos

## Visão Geral

Este sistema foi implementado para resolver o problema de vincular múltiplos fornecedores ao mesmo contrato. Em vez de criar um relacionamento complexo, agora criamos **múltiplos contratos separados** com a mesma numeração base, mas com sufixos diferentes.

## Como Funciona

### Antes (Sistema Anterior)
- Um contrato podia ter múltiplos fornecedores
- Todos os fornecedores compartilhavam o mesmo saldo
- Dificuldade para controlar individualmente cada fornecedor

### Agora (Novo Sistema)
- Cada fornecedor recebe um contrato separado
- Contratos com a mesma numeração base recebem sufixos diferentes
- Exemplo: Contrato 001/2025
  - Fornecedor A → Contrato 001.1/2025
  - Fornecedor B → Contrato 001.2/2025
  - Fornecedor C → Contrato 001.3/2025

## Benefícios

1. **Controle Individual**: Cada fornecedor tem seu próprio contrato e saldo
2. **Rastreabilidade**: Fácil identificar qual contrato pertence a qual fornecedor
3. **Flexibilidade**: Pode ter valores diferentes para cada fornecedor
4. **Simplicidade**: Não há relacionamentos complexos no banco de dados

## Estrutura do Banco de Dados

### Novas Colunas na Tabela `contratos`
- `sufixo`: Número sequencial do contrato (1, 2, 3...)
- `contrato_base_id`: UUID para relacionar contratos com a mesma numeração base

### Nova View: `vw_contratos_completos`
- Exibe contratos com numeração completa (ex: 001.1/2025)
- Inclui informações do fornecedor e município

### Nova Função: `criar_contratos_multiplos_fornecedores`
- Cria automaticamente múltiplos contratos para diferentes fornecedores
- Gera sufixos sequenciais automaticamente
- Relaciona contratos através do `contrato_base_id`

## Como Usar

### 1. Criação de Contratos
1. Abra o formulário "Novo Contrato"
2. Digite o número base do contrato (ex: 001)
3. Selecione **um ou mais fornecedores**
4. Preencha os demais dados
5. Clique em "Salvar"

### 2. Comportamento do Sistema
- **Um fornecedor**: Cria contrato único (ex: 001.1/2025)
- **Múltiplos fornecedores**: Cria contratos separados (001.1/2025, 001.2/2025, etc.)

### 3. Visualização
- A tabela de contratos mostra a numeração completa
- O modal de detalhes exibe o sufixo quando aplicável
- Componente "Contratos Relacionados" mostra todos os contratos com a mesma numeração base

## Interface do Usuário

### Formulário de Criação
- Seleção múltipla de fornecedores
- Mensagem explicativa quando múltiplos fornecedores são selecionados
- Validação automática dos dados

### Tabela de Contratos
- Coluna "Número" mostra a numeração completa
- Filtros e ordenação funcionam normalmente
- Ações (editar, excluir, visualizar) para cada contrato individual

### Detalhes do Contrato
- Exibe número completo e sufixo
- Seção "Contratos Relacionados" para contratos com a mesma numeração base
- Navegação entre contratos relacionados

## Migração de Dados

### Executar a Migração
```sql
-- Executar o arquivo de migração
\i supabase/migrations/20241221000000_add_contrato_suffix_system.sql
```

### Dados Existentes
- Contratos existentes receberão sufixo "1" por padrão
- Campo `contrato_base_id` será preenchido com UUID único para cada contrato
- Funcionalidade retrocompatível

## Considerações Técnicas

### Performance
- Índices criados para otimizar consultas por sufixo e contrato base
- View materializada para consultas frequentes
- Funções otimizadas para criação em lote

### Segurança
- RLS (Row Level Security) mantido
- Validações de entrada implementadas
- Transações para garantir consistência

### Manutenibilidade
- Código modular e bem documentado
- Tipos TypeScript atualizados
- Componentes reutilizáveis

## Exemplos de Uso

### Cenário 1: Contrato Único
```
Número: 001
Fornecedor: Empresa ABC
Resultado: Contrato 001.1/2025
```

### Cenário 2: Múltiplos Fornecedores
```
Número: 001
Fornecedores: Empresa ABC, Empresa XYZ, Empresa 123
Resultado: 
- Contrato 001.1/2025 (Empresa ABC)
- Contrato 001.2/2025 (Empresa XYZ)
- Contrato 001.3/2025 (Empresa 123)
```

## Troubleshooting

### Problema: Erro ao criar múltiplos contratos
**Solução**: Verificar se a função `criar_contratos_multiplos_fornecedores` foi criada corretamente

### Problema: Sufixos não aparecem
**Solução**: Verificar se a view `vw_contratos_completos` está funcionando

### Problema: Contratos não se relacionam
**Solução**: Verificar se o campo `contrato_base_id` está sendo preenchido

## Suporte

Para dúvidas ou problemas:
1. Verificar logs do console do navegador
2. Verificar logs do Supabase
3. Consultar a documentação das migrações
4. Entrar em contato com a equipe de desenvolvimento

---

**Data de Implementação**: 21/12/2024  
**Versão**: 1.0.0  
**Status**: Ativo e Funcionando 