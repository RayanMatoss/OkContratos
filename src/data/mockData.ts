
// Temporary mock data until we replace with real Supabase data

export const usuarios = [
  {
    id: "1",
    nome: "Admin",
    email: "admin@sistema.gov.br",
    cargo: "Administrador",
    permissao: "admin",
    createdAt: new Date()
  },
  {
    id: "2",
    nome: "Usuário Básico",
    email: "usuario@sistema.gov.br",
    cargo: "Analista",
    permissao: "basico",
    createdAt: new Date()
  }
];

export const relatorios = Array.from({ length: 12 }).map((_, index) => {
  const date = new Date();
  date.setMonth(date.getMonth() - index);
  
  return {
    mes: date.getMonth() + 1,
    ano: date.getFullYear(),
    totalContratos: Math.floor(Math.random() * 10) + 10,
    contratosAtivos: Math.floor(Math.random() * 8) + 5,
    contratosVencidos: Math.floor(Math.random() * 5),
    ordensRealizadas: Math.floor(Math.random() * 15) + 5,
    ordensPendentes: Math.floor(Math.random() * 5),
    ordensConcluidas: Math.floor(Math.random() * 12),
    valorTotalContratos: Math.floor(Math.random() * 1000000) + 500000,
    valorTotalOrdens: Math.floor(Math.random() * 800000) + 200000
  };
}).sort((a, b) => {
  if (a.ano !== b.ano) return b.ano - a.ano;
  return b.mes - a.mes;
});
