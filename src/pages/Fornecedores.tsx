
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableActions } from "@/components/ui/table-actions";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Fornecedor } from "@/types";

const Fornecedores = () => {
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

  useEffect(() => {
    fetchFornecedores();
  }, []);

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

  const filteredFornecedores = fornecedores.filter((fornecedor) => {
    return (
      fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerenciamento dos fornecedores cadastrados
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Novo Fornecedor</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar fornecedores..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFornecedores.length > 0 ? (
              filteredFornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                  <TableCell>{fornecedor.cnpj}</TableCell>
                  <TableCell>{fornecedor.email}</TableCell>
                  <TableCell>{fornecedor.telefone}</TableCell>
                  <TableCell>{fornecedor.endereco}</TableCell>
                  <TableCell className="text-right">
                    <TableActions
                      onEdit={() => handleEdit(fornecedor)}
                      onDelete={() => handleDelete(fornecedor)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum fornecedor encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Fornecedor</Label>
              <Input
                id="nome"
                placeholder="Nome da empresa"
                value={newFornecedor.nome}
                onChange={(e) =>
                  setNewFornecedor({ ...newFornecedor, nome: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={newFornecedor.cnpj}
                onChange={(e) =>
                  setNewFornecedor({ ...newFornecedor, cnpj: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com"
                value={newFornecedor.email}
                onChange={(e) =>
                  setNewFornecedor({ ...newFornecedor, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                value={newFornecedor.telefone}
                onChange={(e) =>
                  setNewFornecedor({ ...newFornecedor, telefone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Endereço completo"
                value={newFornecedor.endereco}
                onChange={(e) =>
                  setNewFornecedor({ ...newFornecedor, endereco: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddFornecedor} disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fornecedores;
