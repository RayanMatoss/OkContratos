
import { 
  Contrato, 
  Fornecedor, 
  FundoMunicipal, 
  Item, 
  Notificacao, 
  OrdemFornecimento, 
  RelatorioMensal,
  StatusContrato,
  StatusOrdem,
  Usuario 
} from "@/types";

// Fornecedores
export const fornecedores: Fornecedor[] = [
  {
    id: "1",
    nome: "Construções Silva LTDA",
    cnpj: "12.345.678/0001-90",
    email: "contato@construcoessilva.com",
    telefone: "(11) 98765-4321",
    endereco: "Av. Principal, 123 - Centro",
    createdAt: new Date("2023-01-15")
  },
  {
    id: "2",
    nome: "Tech Solutions S.A.",
    cnpj: "98.765.432/0001-10",
    email: "vendas@techsolutions.com",
    telefone: "(11) 91234-5678",
    endereco: "Rua Tecnologia, 456 - Distrito Digital",
    createdAt: new Date("2023-02-20")
  },
  {
    id: "3",
    nome: "Móveis e Cia LTDA",
    cnpj: "45.678.901/0001-23",
    email: "vendas@moveisecia.com",
    telefone: "(11) 94567-8901",
    endereco: "Av. dos Móveis, 789 - Setor Industrial",
    createdAt: new Date("2023-03-10")
  }
];

// Itens
export const itens: Item[] = [
  {
    id: "1",
    contratoId: "1",
    descricao: "Cimento CP II",
    quantidade: 500,
    valorUnitario: 35.90,
    unidade: "Saco 50kg",
    quantidadeConsumida: 200
  },
  {
    id: "2",
    contratoId: "1",
    descricao: "Areia média",
    quantidade: 100,
    valorUnitario: 120.00,
    unidade: "m³",
    quantidadeConsumida: 40
  },
  {
    id: "3",
    contratoId: "2",
    descricao: "Computador Desktop i7",
    quantidade: 20,
    valorUnitario: 4500.00,
    unidade: "Unidade",
    quantidadeConsumida: 15
  },
  {
    id: "4",
    contratoId: "2",
    descricao: "Monitor 24\"",
    quantidade: 20,
    valorUnitario: 1200.00,
    unidade: "Unidade",
    quantidadeConsumida: 15
  },
  {
    id: "5",
    contratoId: "3",
    descricao: "Mesa de escritório",
    quantidade: 30,
    valorUnitario: 850.00,
    unidade: "Unidade",
    quantidadeConsumida: 20
  }
];

// Contratos
export const contratos: Contrato[] = [
  {
    id: "1",
    numero: "2023/001",
    fornecedorId: "1",
    fornecedor: fornecedores[0],
    fundoMunicipal: "Prefeitura",
    objeto: "Fornecimento de materiais de construção para obras municipais",
    valor: 100000.00,
    dataInicio: new Date("2023-03-01"),
    dataTermino: new Date("2024-03-01"),
    status: "Ativo",
    itens: [itens[0], itens[1]],
    createdAt: new Date("2023-02-15")
  },
  {
    id: "2",
    numero: "2023/002",
    fornecedorId: "2",
    fornecedor: fornecedores[1],
    fundoMunicipal: "Educação",
    objeto: "Aquisição de equipamentos de informática para escolas municipais",
    valor: 150000.00,
    dataInicio: new Date("2023-04-01"),
    dataTermino: new Date("2023-10-01"),
    status: "Expirado",
    itens: [itens[2], itens[3]],
    createdAt: new Date("2023-03-20")
  },
  {
    id: "3",
    numero: "2023/003",
    fornecedorId: "3",
    fornecedor: fornecedores[2],
    fundoMunicipal: "Saúde",
    objeto: "Fornecimento de mobiliário para unidades de saúde",
    valor: 75000.00,
    dataInicio: new Date("2023-06-01"),
    dataTermino: new Date(new Date().setDate(new Date().getDate() + 20)),
    status: "A Vencer",
    itens: [itens[4]],
    createdAt: new Date("2023-05-15")
  }
];

// Ordens de Fornecimento
export const ordens: OrdemFornecimento[] = [
  {
    id: "1",
    numero: "OF-2023/001",
    contratoId: "1",
    contrato: contratos[0],
    dataEmissao: new Date("2023-04-15"),
    status: "Concluída",
    itensConsumidos: [
      { itemId: "1", quantidade: 100 },
      { itemId: "2", quantidade: 20 }
    ],
    createdAt: new Date("2023-04-15")
  },
  {
    id: "2",
    numero: "OF-2023/002",
    contratoId: "1",
    contrato: contratos[0],
    dataEmissao: new Date("2023-06-10"),
    status: "Concluída",
    itensConsumidos: [
      { itemId: "1", quantidade: 100 },
      { itemId: "2", quantidade: 20 }
    ],
    createdAt: new Date("2023-06-10")
  },
  {
    id: "3",
    numero: "OF-2023/003",
    contratoId: "2",
    contrato: contratos[1],
    dataEmissao: new Date("2023-05-05"),
    status: "Concluída",
    itensConsumidos: [
      { itemId: "3", quantidade: 15 },
      { itemId: "4", quantidade: 15 }
    ],
    createdAt: new Date("2023-05-05")
  },
  {
    id: "4",
    numero: "OF-2023/004",
    contratoId: "3",
    contrato: contratos[2],
    dataEmissao: new Date(),
    status: "Pendente",
    itensConsumidos: [
      { itemId: "5", quantidade: 10 }
    ],
    createdAt: new Date()
  }
];

// Usuários
export const usuarios: Usuario[] = [
  {
    id: "1",
    nome: "Admin Sistema",
    email: "admin@sistema.gov.br",
    cargo: "Administrador de Sistema",
    permissao: "admin",
    createdAt: new Date("2023-01-01")
  },
  {
    id: "2",
    nome: "João Silva",
    email: "joao.silva@sistema.gov.br",
    cargo: "Gestor de Contratos",
    permissao: "basico",
    createdAt: new Date("2023-01-10")
  }
];

// Notificações
export const notificacoes: Notificacao[] = [
  {
    id: "1",
    titulo: "Contrato próximo ao vencimento",
    mensagem: "O contrato nº 2023/003 vencerá em menos de 30 dias.",
    tipo: "contrato",
    lida: false,
    data: new Date(),
    usuarioId: "1"
  },
  {
    id: "2",
    titulo: "Nova ordem de fornecimento pendente",
    mensagem: "A ordem OF-2023/004 precisa de sua aprovação.",
    tipo: "ordem",
    lida: false,
    data: new Date(),
    usuarioId: "1"
  }
];

// Relatórios
export const relatorios: RelatorioMensal[] = [
  {
    mes: 4, // Abril
    ano: 2023,
    totalContratos: 2,
    contratosVencidos: 0,
    contratosAtivos: 2,
    ordensRealizadas: 1,
    ordensPendentes: 0,
    ordensConcluidas: 1,
    valorTotalContratos: 250000.00,
    valorTotalOrdens: 30000.00
  },
  {
    mes: 5, // Maio
    ano: 2023,
    totalContratos: 3,
    contratosVencidos: 0,
    contratosAtivos: 3,
    ordensRealizadas: 1,
    ordensPendentes: 0,
    ordensConcluidas: 1,
    valorTotalContratos: 325000.00,
    valorTotalOrdens: 45000.00
  },
  {
    mes: 6, // Junho
    ano: 2023,
    totalContratos: 3,
    contratosVencidos: 0,
    contratosAtivos: 3,
    ordensRealizadas: 1,
    ordensPendentes: 0,
    ordensConcluidas: 1,
    valorTotalContratos: 325000.00,
    valorTotalOrdens: 25000.00
  },
  {
    mes: 7, // Julho
    ano: 2023,
    totalContratos: 3,
    contratosVencidos: 0,
    contratosAtivos: 3,
    ordensRealizadas: 0,
    ordensPendentes: 0,
    ordensConcluidas: 0,
    valorTotalContratos: 325000.00,
    valorTotalOrdens: 0
  },
  {
    mes: 8, // Agosto
    ano: 2023,
    totalContratos: 3,
    contratosVencidos: 0,
    contratosAtivos: 3,
    ordensRealizadas: 0,
    ordensPendentes: 0,
    ordensConcluidas: 0,
    valorTotalContratos: 325000.00,
    valorTotalOrdens: 0
  },
  {
    mes: 9, // Setembro
    ano: 2023,
    totalContratos: 3,
    contratosVencidos: 0,
    contratosAtivos: 3,
    ordensRealizadas: 0,
    ordensPendentes: 0,
    ordensConcluidas: 0,
    valorTotalContratos: 325000.00,
    valorTotalOrdens: 0
  }
];

// Util function
export const getDashboardData = () => {
  const totalContratos = contratos.length;
  const contratosAVencer = contratos.filter(c => 
    c.status === "A Vencer" && 
    c.dataTermino.getTime() <= new Date().setDate(new Date().getDate() + 30)
  ).length;
  const totalFornecedores = fornecedores.length;
  const ordensPendentes = ordens.filter(o => o.status === "Pendente").length;

  return {
    totalContratos,
    contratosAVencer,
    totalFornecedores,
    ordensPendentes
  };
};
