
import { 
  Contrato, 
  Fornecedor, 
  Item, 
  OrdemFornecimento,
  RelatorioMensal,
  Usuario 
} from "@/types";

// Data collections
export const fornecedores: Fornecedor[] = [];
export const itens: Item[] = [];
export const contratos: Contrato[] = [];
export const ordens: OrdemFornecimento[] = [];
export const usuarios: Usuario[] = [];
export const relatorios: RelatorioMensal[] = [];

// Dashboard data
export const getDashboardData = () => ({
  totalContratos: contratos.length,
  contratosAVencer: contratos.filter(c => new Date(c.dataTermino) > new Date()).length,
  totalFornecedores: fornecedores.length,
  ordensPendentes: ordens.filter(o => o.status === "Pendente").length
});
