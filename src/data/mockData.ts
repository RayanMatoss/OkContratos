
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

// Dashboard data
export const getDashboardData = () => ({
  totalContratos: 0,
  contratosAVencer: 0,
  totalFornecedores: 0,
  ordensPendentes: 0
});

// Notifications
export type Notification = {
  id: string;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
};

export const notificacoes: Notification[] = [];

