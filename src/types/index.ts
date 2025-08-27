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

export interface Contrato {
  id: string;
  numero: string;
  sufixo?: string;
  numeroCompleto?: string;
  contratoBaseId?: string;
  fornecedorIds: string[];
  fornecedores?: Fornecedor[];
  fundoMunicipal: FundoMunicipal[];
  objeto: string;
  valor: number;
  dataInicio: Date;
  dataTermino: Date;
  status: StatusContrato;
  createdAt: Date;
  itens: Item[];
}

export interface Item {
  id: string;
  contratoId: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  quantidadeConsumida: number;
  createdAt: Date;
  fundos?: string[];
}

export interface OrdemFornecimento {
  id: string;
  numero: string;
  contratoId: string;
  contrato?: Contrato;
  dataEmissao: Date;
  dataConclusao?: Date;
  status: StatusOrdem;
  itens: ItemOrdem[];
  valorTotal: number;
  createdAt: Date;
}

// Novos tipos para o sistema de solicitações
export type OrdemSolicitacaoStatus = 'PENDENTE' | 'APROVADA' | 'RECUSADA' | 'CANCELADA';

export interface OrdemSolicitacao {
  id: string;
  contrato_id: string;
  solicitante: string;
  secretaria: string;
  justificativa: string | null;
  quantidade: number | null;
  status: OrdemSolicitacaoStatus;
  criado_em: string;
  decidido_por: string | null;
  decidido_em: string | null;
  motivo_decisao: string | null;

  // campos adicionados via select encadeado para exibição
  contrato?: {
    numero: string | null;
    fornecedor?: {
      nome: string | null;
    } | null;
  } | null;
}

export interface ItemSolicitacao {
  id: string;
  solicitacaoId: string;
  itemId: string;
  item?: Item;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface ItemOrdem {
  id: string;
  ordemId: string;
  itemId: string;
  item?: Item;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Aditivo {
  id: string;
  contratoId: string;
  tipo: "periodo" | "valor";
  descricao: string;
  dataInicio?: Date;
  dataTermino?: Date;
  percentual?: number;
  valorAdicional?: number;
  createdAt: Date;
}

export interface RelatorioMensal {
  id: string;
  ano: number;
  mes: number;
  totalContratos?: number;
  contratosAtivos?: number;
  contratosVencidos?: number;
  valorTotalContratos?: number;
  ordensRealizadas?: number;
  ordensConcluidas?: number;
  ordensPendentes?: number;
  valorTotalOrdens?: number;
  createdAt: Date;
}

export interface FormStep {
  step: number;
  totalSteps: number;
}

export interface Municipio {
  id: string;
  nome: string;
  uf: string;
  codigoIBGE?: string;
}

export interface Perfil {
  id: string;
  nome: string;
  descricao?: string;
  permissoes?: string[];
}

export interface Usuario {
  id: string;
  email: string;
  nome?: string;
  perfilId?: string;
  perfil?: Perfil;
  municipioId?: string;
  municipio?: Municipio;
  createdAt: Date;
}
