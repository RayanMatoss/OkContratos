
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
  fornecedorId: string;
  fornecedor?: Fornecedor;
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
  criado_em: string;
}

export type TipoAditivo = 'periodo' | 'valor';

export interface RelatorioMensal {
  mes: string;
  contratos: number;
  ordens: number;
  valor_total: number;
}
