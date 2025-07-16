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
  fundoMunicipal: FundoMunicipal[];
}

export type FundoMunicipal = {
  id: string;
  nome: string;
};

export interface OrdemFornecimento {
  id: string;
  numero: string;
  contratoId: string;
  contrato?: Contrato;
  dataEmissao: Date;
  observacoes: string;
  createdAt: Date;
}

export type StatusContrato = 'Ativo' | 'Expirado' | 'Suspenso' | 'Finalizado';
