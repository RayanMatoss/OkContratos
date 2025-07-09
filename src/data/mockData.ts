
// Temporary mock data until we replace with real Supabase data

export const municipios = [
  { id: "1", nome: "Capela do Alto Alegre", uf: "BA" }
];

export const usuarios = [
  {
    id: "1",
    nome: "Admin",
    email: "admin@sistema.gov.br",
    cargo: "Administrador",
    permissao: "admin",
    municipioId: "1", // Capela do Alto Alegre
    createdAt: new Date()
  },
  {
    id: "2",
    nome: "Usuário Básico",
    email: "usuario@sistema.gov.br",
    cargo: "Analista",
    permissao: "basico",
    municipioId: "1", // Capela do Alto Alegre
    createdAt: new Date()
  }
];
