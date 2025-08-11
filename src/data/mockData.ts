
// Temporary mock data until we replace with real Supabase data

<<<<<<< HEAD
export const municipios = [
  { id: "550e8400-e29b-41d4-a716-446655440001", nome: "Capela do Alto Alegre", uf: "BA" }
];

// Usuários mockados não são mais usados, pois o login é feito pelo Supabase Auth
=======
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
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
