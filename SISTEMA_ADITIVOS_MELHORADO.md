# Sistema de Aditivos Melhorado - OkContratos

## 🚀 Novas Funcionalidades Implementadas

### ✅ Aditivo de Valor com Limite de 25%
- **Percentual máximo**: Limitado a 25% por aditivo
- **Validação automática**: O sistema impede percentuais superiores a 25%
- **Controle acumulado**: Soma total de todos os aditivos de valor não pode exceder 25%

### ✅ Duas Opções de Aplicação

#### 1. Aplicar a Todos os Itens
- **Percentual único**: Um percentual aplicado automaticamente a todos os itens
- **Cálculo automático**: Sistema recalcula valores unitários e total do contrato
- **Interface simples**: Campo único para percentual

#### 2. Percentuais Individuais por Item
- **Controle granular**: Percentual específico para cada item do contrato
- **Validação por item**: Cada item pode ter até 25%
- **Validação total**: Soma de todos os percentuais não pode exceder 25%
- **Interface intuitiva**: Lista de itens com campos individuais

## 🎯 Como Usar

### Criar Aditivo de Valor - Todos os Itens
1. Acesse os detalhes do contrato
2. Clique em "Novo Aditivo"
3. Selecione "Aditivo de Valor"
4. Mantenha "Aplicar percentual a todos os itens" ativado
5. Digite o percentual (ex: 15.50)
6. Clique em "Salvar Aditivo"

### Criar Aditivo de Valor - Percentuais Individuais
1. Acesse os detalhes do contrato
2. Clique em "Novo Aditivo"
3. Selecione "Aditivo de Valor"
4. Desative "Aplicar percentual a todos os itens"
5. Defina percentuais específicos para cada item
6. Clique em "Salvar Aditivo"

## 🛡️ Validações e Segurança

### Validações Automáticas
- **Contrato ativo**: Apenas contratos com status "ativo"
- **Limite temporal**: Máximo 1 aditivo de valor a cada 30 dias
- **Percentual máximo**: 25% por aditivo individual
- **Total acumulado**: Soma de todos os aditivos não pode exceder 25%
- **Validação por item**: Cada item individual pode ter até 25%

### Mensagens de Erro Inteligentes
- **Percentual excedido**: "Percentual deve estar entre 0.01% e 25%"
- **Total excedido**: "Percentual total excederia o limite de 25%. Máximo permitido: X%"
- **Aditivo recente**: "Já existe um aditivo de valor para este contrato nos últimos 30 dias"
- **Contrato inativo**: "Apenas contratos ativos podem receber aditivos de valor"

## 🔧 Estrutura Técnica

### Banco de Dados
```sql
-- Novas colunas na tabela aditivos
ALTER TABLE aditivos 
ADD COLUMN aplicar_todos_itens BOOLEAN DEFAULT true,
ADD COLUMN percentuais_por_item JSONB;

-- Constraint para limite de 25%
ALTER TABLE aditivos 
ADD CONSTRAINT check_percentual_maximo 
CHECK (percentual_itens IS NULL OR (percentual_itens > 0 AND percentual_itens <= 25));
```

### Funções Principais
- `validar_aditivo_valor()`: Valida regras de negócio
- `aplicar_aditivo_valor_todos_itens()`: Aplica percentual a todos os itens
- `aplicar_aditivo_valor_individual()`: Aplica percentuais individuais
- `trigger_aplicar_aditivo_valor()`: Trigger automático para validação e aplicação

### Frontend
- **AditivoFormDialog**: Formulário com opções de percentual
- **Switch**: Alternar entre "todos os itens" e "individuais"
- **Validação em tempo real**: Feedback imediato de erros
- **Interface responsiva**: Adaptável a diferentes tamanhos de tela

## 📊 Exemplos de Uso

### Cenário 1: Aumento Geral
```
Contrato: 001/2025
Aditivo: 15% para todos os itens
Resultado: Todos os itens aumentam 15% automaticamente
```

### Cenário 2: Aumentos Específicos
```
Contrato: 001/2025
Item A: 20% (material específico)
Item B: 5% (serviço básico)
Total: 25% (limite máximo)
```

### Cenário 3: Múltiplos Aditivos
```
Aditivo 1: 10% (primeiro mês)
Aditivo 2: 12% (segundo mês)
Total acumulado: 22% (dentro do limite de 25%)
```

## 🔄 Fluxo de Funcionamento

1. **Usuário seleciona tipo**: Aditivo de Valor
2. **Escolhe aplicação**: Todos os itens ou individuais
3. **Define percentuais**: Único ou múltiplos
4. **Validação automática**: Sistema verifica regras
5. **Aplicação imediata**: Valores são recalculados
6. **Registro**: Aditivo é salvo no histórico

## 📈 Benefícios

### Para o Usuário
- **Flexibilidade**: Escolher entre aplicação geral ou específica
- **Controle**: Percentuais individuais por item
- **Segurança**: Limites automáticos de 25%
- **Simplicidade**: Interface intuitiva e clara

### Para o Sistema
- **Integridade**: Validações automáticas no banco
- **Performance**: Triggers otimizados
- **Auditoria**: Histórico completo de alterações
- **Escalabilidade**: Suporte a múltiplos tipos de aditivo

## 🚨 Limitações e Regras

### Regras de Negócio
- **Percentual máximo**: 25% por aditivo
- **Total acumulado**: Máximo 25% em todos os aditivos
- **Frequência**: Máximo 1 aditivo de valor a cada 30 dias
- **Status**: Apenas contratos ativos

### Validações Técnicas
- **Formato**: Percentuais com até 2 casas decimais
- **Range**: Entre 0.01% e 25%
- **Integridade**: Validação automática via triggers
- **Transações**: Aplicação atômica (tudo ou nada)

## 🔮 Futuras Melhorias

### Funcionalidades Planejadas
- **Histórico de valores**: Rastrear mudanças nos itens
- **Relatórios**: Análise de impacto dos aditivos
- **Notificações**: Alertas para percentuais próximos ao limite
- **Aprovação**: Workflow de aprovação para aditivos grandes

### Melhorias Técnicas
- **Cache**: Otimização de consultas frequentes
- **Logs**: Auditoria detalhada de alterações
- **API**: Endpoints para integração externa
- **Backup**: Sistema de reversão de aditivos

---

**Sistema implementado com sucesso!** 🎉

O sistema de aditivos de valor agora oferece flexibilidade total com controles de segurança robustos, permitindo tanto aplicação geral quanto individual, sempre respeitando o limite de 25% para garantir a estabilidade financeira dos contratos. 