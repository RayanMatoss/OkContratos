
<<<<<<< HEAD
<<<<<<< HEAD
=======
export type FundoMunicipal = "Prefeitura" | "Educação" | "Saúde" | "Assistência";

// Updated contract status values - only managed by database now
export type StatusContrato = "Ativo" | "Expirado" | "A Vencer" | "Em Aprovação";

// Simplified order status values - only managed by database now
export type StatusOrdem = "Pendente" | "Concluída";

>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  createdAt: Date;
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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

<<<<<<< HEAD
=======
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
export interface Item {
  id: string;
  contratoId: string;
  descricao: string;
  quantidade: number;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  unidade: string;
  valorUnitario: number;
  quantidadeConsumida: number;
  createdAt: Date;
  fundos?: string[];
}

export type FundoMunicipal = string;
<<<<<<< HEAD
=======
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
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

export interface OrdemFornecimento {
  id: string;
  numero: string;
  contratoId: string;
  contrato?: Contrato;
  dataEmissao: Date;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
  aplicar_todos_itens?: boolean;
  percentuais_por_item?: { [itemId: string]: number };
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  criado_em: string;
}

export type TipoAditivo = 'periodo' | 'valor';
<<<<<<< HEAD
=======
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
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

export interface RelatorioMensal {
  mes: number;
  ano: number;
  totalContratos: number;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
=======
  contratosVencidos: number;
  contratosAtivos: number;
  ordensRealizadas: number;
  ordensPendentes: number;
  ordensConcluidas: number;
  valorTotalContratos: number;
  valorTotalOrdens: number;
}
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
