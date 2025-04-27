
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Fornecedor } from "@/types";

export const useFornecedoresState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFornecedor, setNewFornecedor] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
  });
  const { toast } = useToast();

  const formatFornecedor = (fornecedor: any): Fornecedor => {
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

  const fetchFornecedores = async () => {
    try {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .order('nome');

      if (error) throw error;

      const formattedFornecedores = data.map(formatFornecedor);
      setFornecedores(formattedFornecedores);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar fornecedores",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddFornecedor = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fornecedores')
        .insert([{
          nome: newFornecedor.nome,
          cnpj: newFornecedor.cnpj,
          email: newFornecedor.email,
          telefone: newFornecedor.telefone,
          endereco: newFornecedor.endereco
        }])
        .select()
        .single();

      if (error) throw error;

      const formattedFornecedor = formatFornecedor(data);
      setFornecedores([...fornecedores, formattedFornecedor]);
      setShowAddDialog(false);
      setNewFornecedor({
        nome: "",
        cnpj: "",
        email: "",
        telefone: "",
        endereco: "",
      });
      
      toast({
        title: "Sucesso",
        description: "Fornecedor cadastrado com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    toast({
      title: "Em breve",
      description: "A edição de fornecedores será implementada em breve",
    });
  };

  const handleDelete = async (fornecedor: Fornecedor) => {
    try {
      const { error } = await supabase
        .from('fornecedores')
        .delete()
        .eq('id', fornecedor.id);

      if (error) throw error;

      setFornecedores(fornecedores.filter(f => f.id !== fornecedor.id));
      
      toast({
        title: "Fornecedor excluído",
        description: "O fornecedor foi excluído com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir fornecedor",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredFornecedores = fornecedores.filter((fornecedor) => {
    return (
      fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleFornecedorChange = (field: keyof typeof newFornecedor, value: string) => {
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

export const useFornecedores = (shouldFetch: boolean = false) => {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);

  const formatFornecedor = (fornecedor: any): Fornecedor => {
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

  const fetchFornecedores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("nome");

      if (error) throw error;

      const formattedFornecedores = data.map(formatFornecedor);
      setFornecedores(formattedFornecedores);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar fornecedores",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchFornecedores();
    }
  }, [shouldFetch]);

  return { fornecedores, loading, fetchFornecedores };
};

