# Sistema de Aditivos - OkContratos

## 📋 Visão Geral

O sistema de aditivos permite modificar contratos existentes de duas formas principais:
1. **Aditivo de Período**: Estender a vigência do contrato
2. **Aditivo de Valor**: Aumentar o valor dos itens por percentual

## 🚀 Funcionalidades

### ✅ Aditivo de Período
- Estende a data de término do contrato
- Validação automática de datas futuras
- Aplicação imediata ao contrato

### ✅ Aditivo de Valor
- Aumenta o valor dos itens por percentual
- Atualiza automaticamente o valor total do contrato
- Suporte a percentuais decimais (ex: 15.50%)

### ✅ Validações Automáticas
- Apenas contratos ativos podem receber aditivos
- Limite de um aditivo do mesmo tipo por contrato a cada 30 dias
- Validação de datas e percentuais
- Aplicação automática via triggers do banco

## 🗄️ Estrutura do Banco de Dados

### Tabela `aditivos`
```sql
CREATE TABLE aditivos (
    id UUID PRIMARY KEY,
    contrato_id UUID REFERENCES contratos(id),
    tipo VARCHAR(20) CHECK (tipo IN ('periodo', 'valor')),
    nova_data_termino DATE,
    percentual_itens DECIMAL(5,2),
    criado_em TIMESTAMP WITH TIME ZONE,
    municipio_id UUID
);
```

### Funções Principais
- `aplicar_aditivo_valor()`: Aplica acréscimo percentual aos itens
- `aplicar_aditivo_periodo()`: Estende a vigência do contrato
- `validar_aditivo()`: Valida regras de negócio
- `trigger_validar_aditivo()`: Trigger automático para validação e aplicação

### View `vw_aditivos_completos`
Exibe aditivos com informações completas do contrato e formatação automática.

## 🎯 Como Usar

### 1. Criar Aditivo de Período
1. Acesse os detalhes do contrato
2. Clique em "Novo Aditivo"
3. Selecione "Aditivo de Período"
4. Escolha a nova data de vigência
5. Clique em "Salvar Aditivo"

### 2. Criar Aditivo de Valor
1. Acesse os detalhes do contrato
2. Clique em "Novo Aditivo"
3. Selecione "Aditivo de Valor"
4. Digite o percentual de acréscimo (ex: 15.50)
5. Clique em "Salvar Aditivo"

## 🔧 Componentes Frontend

### `AditivoFormDialog`
- Modal para criação de aditivos
- Validação em tempo real
- Interface moderna com ícones
- Tratamento de erros

### `AditivosTab`
- Lista todos os aditivos do contrato
- Visualização em cards
- Funcionalidade de exclusão
- Estados de carregamento

### `useAditivos`
- Hook para gerenciar aditivos
- Operações CRUD
- Integração com Supabase
- Tratamento de erros

## 🛡️ Segurança

### Row Level Security (RLS)
- Usuários só veem aditivos do seu município
- Políticas de acesso por operação (SELECT, INSERT, UPDATE, DELETE)
- Validação automática de permissões

### Validações
- Contrato deve estar ativo
- Limite de aditivos por tipo
- Validação de dados de entrada
- Aplicação automática via triggers

## 📊 Monitoramento

### Logs Automáticos
- Data/hora de criação
- Tipo de modificação
- Usuário responsável
- Contrato afetado

### Histórico
- Lista cronológica de aditivos
- Informações detalhadas
- Rastreabilidade completa

## 🚨 Limitações e Regras

### Aditivo de Período
- Nova data deve ser futura
- Não pode ser anterior à data atual de término
- Aplicação imediata ao contrato

### Aditivo de Valor
- Percentual entre 0.01% e 100%
- Aplicação a todos os itens do contrato
- Atualização automática do valor total

### Regras Gerais
- Máximo 1 aditivo do mesmo tipo por contrato a cada 30 dias
- Apenas contratos com status "ativo"
- Aplicação automática via triggers

## 🔄 Fluxo de Funcionamento

1. **Usuário cria aditivo** via interface
2. **Validação automática** via trigger
3. **Aplicação imediata** ao contrato
4. **Registro na tabela** de aditivos
5. **Atualização da interface** com novo aditivo

## 📝 Exemplos de Uso

### Cenário 1: Extensão de Prazo
```
Contrato: 001/2025
Data atual de término: 31/12/2025
Aditivo: Nova data de término: 31/03/2026
Resultado: Contrato estendido até 31/03/2026
```

### Cenário 2: Aumento de Valor
```
Contrato: 002/2025
Valor original: R$ 100.000,00
Aditivo: Acréscimo de 15,5%
Resultado: Novo valor R$ 115.500,00
```

## 🐛 Troubleshooting

### Erro: "Contrato não encontrado"
- Verificar se o contrato existe
- Confirmar permissões de acesso

### Erro: "Apenas contratos ativos podem receber aditivos"
- Verificar status do contrato
- Ativar contrato se necessário

### Erro: "Já existe um aditivo do tipo X nos últimos 30 dias"
- Aguardar período de 30 dias
- Verificar aditivos existentes

### Erro: "Data inválida"
- Verificar se a data é futura
- Confirmar formato da data

## 🔮 Próximas Funcionalidades

- [ ] Histórico de alterações
- [ ] Aprovação em múltiplas etapas
- [ ] Notificações automáticas
- [ ] Relatórios de aditivos
- [ ] Exportação de dados
- [ ] Integração com workflow

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do sistema
2. Consultar documentação
3. Contatar equipe técnica
4. Abrir ticket de suporte

---

**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024  
**Desenvolvido por**: Equipe OkContratos 