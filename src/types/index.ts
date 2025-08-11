
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

export type FundoMunicipal = string;

export interface OrdemFornecimento {
  id: string;
  numero: string;
  contratoId: string;
  contrato?: Contrato;
  dataEmissao: Date;
  observacoes: string;
  status: StatusOrdem;
  itensConsumidos: { itemId: string; quantidade: number }[];
  createdAt: Date;
  itens?: Item[];
}

export type StatusContrato = 'Ativo' | 'Expirado' | 'Suspenso' | 'Finalizado' | 'A Vencer' | 'Em Aprovação';

export type StatusOrdem = 'Pendente' | 'Concluída' | 'Cancelada';

export interface Aditivo {
  id: string;
  contrato_id: string;
  tipo: TipoAditivo;
  nova_data_termino?: string;
  percentual_itens?: number;
  aplicar_todos_itens?: boolean;
  percentuais_por_item?: { [itemId: string]: number };
  criado_em: string;
}

export type TipoAditivo = 'periodo' | 'valor';

export interface RelatorioMensal {
  mes: number;
  ano: number;
  totalContratos: number;
  contratosAtivos: number;
  contratosVencidos: number;
  ordensRealizadas: number;
  ordensConcluidas: number;
  ordensPendentes: number;
  valorTotalContratos: number;
  valorTotalOrdens: number;
}

export interface ContratoFormValues {
  numero: string;
  objeto: string;
  fornecedor_ids: string | string[]; // Mantido como array para compatibilidade, mas agora sempre terá apenas um elemento
  valor: string;
  fundo_municipal: FundoMunicipal[];
  data_inicio: Date;
  data_termino: Date;
  items?: Item[];
}

export type FormStep = 'basic' | 'dates' | 'items';
