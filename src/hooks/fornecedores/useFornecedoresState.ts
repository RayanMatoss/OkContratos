
import { useState } from "react";
import type { Fornecedor } from "@/types";
import type { NewFornecedor } from "./types";
import { useFornecedoresCrud } from "./useFornecedoresCrud";
import { useFetchFornecedores } from "./useFetchFornecedores";

const emptyFornecedor: NewFornecedor = {
  nome: "",
  cnpj: "",
  email: "",
  telefone: "",
  endereco: "",
};

export const useFornecedoresState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [fornecedorForm, setFornecedorForm] = useState<NewFornecedor>(emptyFornecedor);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { fornecedores, fetchFornecedores } = useFetchFornecedores();
  const { loading, addFornecedor, deleteFornecedor, updateFornecedor } = useFornecedoresCrud();

  const handleAddFornecedor = async () => {
    const result = await addFornecedor(fornecedorForm);
    if (result) {
      await fetchFornecedores();
      setShowDialog(false);
      setFornecedorForm(emptyFornecedor);
    }
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setEditingId(fornecedor.id);
    setFornecedorForm({
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      email: fornecedor.email || "",
      telefone: fornecedor.telefone || "",
      endereco: fornecedor.endereco || ""
    });
    setShowDialog(true);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    
    const success = await updateFornecedor(editingId, fornecedorForm);
    if (success) {
      await fetchFornecedores();
      setShowDialog(false);
      setFornecedorForm(emptyFornecedor);
      setEditingId(null);
    }
  };

  const handleDelete = async (fornecedor: Fornecedor) => {
    const success = await deleteFornecedor(fornecedor);
    if (success) {
      await fetchFornecedores();
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFornecedorForm(emptyFornecedor);
    setShowDialog(true);
  };

  const handleFornecedorChange = (field: keyof NewFornecedor, value: string) => {
    setFornecedorForm({ ...fornecedorForm, [field]: value });
  };

  const filteredFornecedores = fornecedores.filter((fornecedor) => {
    return (
      fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    showDialog,
    setShowDialog,
    loading,
    fornecedorForm,
    filteredFornecedores,
    handleAddFornecedor,
    handleEdit,
    handleUpdate,
    handleDelete,
    handleOpenAdd,
    handleFornecedorChange,
    isEditing: Boolean(editingId),
    fetchFornecedores
  };
};
