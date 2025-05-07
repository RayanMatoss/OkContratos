export type FundoMunicipal = "Prefeitura" | "Educação" | "Saúde" | "Assistência";

// Updated contract status values - only managed by database now
export type StatusContrato = "Ativo" | "Expirado" | "A Vencer" | "Em Aprovação";

// Simplified order status values - only managed by database now
export type StatusOrdem = "Pendente" | "Concluída";

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  createdAt: Date;
}

export interface Item {
  id: string;
  contratoId: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  unidade: string;
  quantidadeConsumida: number;
}

export interface Contrato {
  id: string;
  numero: string;
  fornecedorId: string;
  fornecedor?: Fornecedor;
  fundoMunicipal: FundoMunicipal[]; // Changed to only accept array type
  objeto: string;
  valor: number;
  dataInicio: Date;
  dataTermino: Date;
  status: StatusContrato;
  itens: Item[];
  createdAt: Date;
}

export interface OrdemFornecimento {
  id: string;
  numero: string;
  contratoId: string;
  contrato?: Contrato;
  dataEmissao: Date;
  status: StatusOrdem;
  itensConsumidos: {
    itemId: string;
    quantidade: number;
  }[];
  createdAt: Date;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  permissao: "admin" | "basico";
  createdAt: Date;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "contrato" | "ordem" | "sistema";
  lida: boolean;
  data: Date;
  usuarioId: string;
}

export interface RelatorioMensal {
  mes: number;
  ano: number;
  totalContratos: number;
  contratosVencidos: number;
  contratosAtivos: number;
  ordensRealizadas: number;
  ordensPendentes: number;
  ordensConcluidas: number;
  valorTotalContratos: number;
  valorTotalOrdens: number;
}

export type TipoAditivo = "periodo" | "valor";

export interface Aditivo {
  id: string;
  contrato_id: string;
  tipo: TipoAditivo;
  nova_data_termino?: string; // ISO date string
  percentual_itens?: number;  // Ex: 10.00 para 10%
  criado_em: string;          // ISO date string
}
