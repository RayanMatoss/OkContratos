
import type { Fornecedor } from "@/types";

export interface NewFornecedor {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
}

export const formatFornecedor = (fornecedor: any): Fornecedor => {
  return {
    id: fornecedor.id,
    nome: fornecedor.nome,
    cnpj: fornecedor.cnpj,
    email: fornecedor.email || "",
    telefone: fornecedor.telefone || "",
    endereco: fornecedor.endereco || "",
    createdAt: new Date(fornecedor.created_at),
  };
};
