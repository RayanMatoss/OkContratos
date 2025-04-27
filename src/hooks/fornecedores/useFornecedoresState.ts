
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Fornecedor } from "@/types";
import type { NewFornecedor } from "./types";
import { useFornecedoresCrud } from "./useFornecedoresCrud";
import { useFetchFornecedores } from "./useFetchFornecedores";

export const useFornecedoresState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFornecedor, setNewFornecedor] = useState<NewFornecedor>({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  const { toast } = useToast();
  const { fornecedores, fetchFornecedores } = useFetchFornecedores();
  const { loading, addFornecedor, deleteFornecedor } = useFornecedoresCrud();

  const handleAddFornecedor = async () => {
    const result = await addFornecedor(newFornecedor);
    if (result) {
      await fetchFornecedores();
      setShowAddDialog(false);
      setNewFornecedor({
        nome: "",
        cnpj: "",
        email: "",
        telefone: "",
        endereco: "",
      });
    }
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    toast({
      title: "Em breve",
      description: "A edição de fornecedores será implementada em breve",
    });
  };

  const handleDelete = async (fornecedor: Fornecedor) => {
    const success = await deleteFornecedor(fornecedor);
    if (success) {
      await fetchFornecedores();
    }
  };

  const filteredFornecedores = fornecedores.filter((fornecedor) => {
    return (
      fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleFornecedorChange = (field: keyof NewFornecedor, value: string) => {
    setNewFornecedor({ ...newFornecedor, [field]: value });
  };

  return {
    searchTerm,
    setSearchTerm,
    showAddDialog,
    setShowAddDialog,
    loading,
    newFornecedor,
    filteredFornecedores,
    handleAddFornecedor,
    handleEdit,
    handleDelete,
    handleFornecedorChange,
    fetchFornecedores
  };
};
