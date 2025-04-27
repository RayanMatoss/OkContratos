
import { 
  Contrato, 
  Fornecedor, 
  Item, 
  OrdemFornecimento,
  RelatorioMensal,
  Usuario 
} from "@/types";

// Fornecedores
export const fornecedores: Fornecedor[] = [];

// Itens
export const itens: Item[] = [];

// Contratos
export const contratos: Contrato[] = [];

// Ordens de Fornecimento
export const ordens: OrdemFornecimento[] = [];

// Usuários
export const usuarios: Usuario[] = [];

// Relatórios
export const relatorios: RelatorioMensal[] = [];

// Util function
export const getDashboardData = () => ({
  totalContratos: 0,
  contratosAVencer: 0,
  totalFornecedores: 0,
  ordensPendentes: 0
});
