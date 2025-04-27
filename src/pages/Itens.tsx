
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Itens = () => {
  const { toast } = useToast();
  const [itens, setItens] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contratos, setContratos] = useState<any[]>([]);

  const [newItem, setNewItem] = useState({
    contrato_id: "",
    descricao: "",
    quantidade: "",
    unidade: "",
    valor_unitario: ""
  });

  useEffect(() => {
    fetchItens();
    fetchContratos();
  }, []);

  async function fetchItens() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itens')
        .select(`
          *,
          contratos (
            numero,
            objeto,
            fornecedores (
              nome
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItens(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchContratos() {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .select('id, numero, objeto')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContratos(data || []);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  }

  const handleAddItem = async () => {
    try {
      const itemToAdd = {
        contrato_id: newItem.contrato_id,
        descricao: newItem.descricao,
        quantidade: parseFloat(newItem.quantidade),
        unidade: newItem.unidade,
        valor_unitario: parseFloat(newItem.valor_unitario),
        quantidade_consumida: 0
      };

      const { error } = await supabase.from('itens').insert([itemToAdd]);

      if (error) throw error;

      setShowAddDialog(false);
      toast({
        title: "Sucesso",
        description: "Item adicionado com sucesso."
      });
      
      // Reset form and refresh data
      setNewItem({
        contrato_id: "",
        descricao: "",
        quantidade: "",
        unidade: "",
        valor_unitario: ""
      });
      fetchItens();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const filteredItens = itens.filter((item) => {
    return (
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.quantidade).includes(searchTerm) ||
      String(item.valor_unitario).includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Itens</h1>
          <p className="text-muted-foreground">
            Gerenciamento dos itens cadastrados em contratos
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Novo Item</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar itens..."
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
              <TableHead>Descrição</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">Consumido</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead className="text-right">Valor Unit.</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItens.length > 0 ? (
              filteredItens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell>{item.contratos?.numero}</TableCell>
                  <TableCell>{item.contratos?.fornecedores?.nome}</TableCell>
                  <TableCell className="text-right">{item.quantidade}</TableCell>
                  <TableCell className="text-right">{item.quantidade_consumida}</TableCell>
                  <TableCell>{item.unidade}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.valor_unitario)}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.quantidade * item.valor_unitario)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {loading ? "Carregando itens..." : "Nenhum item encontrado."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contrato">Contrato</Label>
              <select
                id="contrato"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newItem.contrato_id}
                onChange={(e) => setNewItem({ ...newItem, contrato_id: e.target.value })}
              >
                <option value="">Selecione um contrato</option>
                {contratos.map(contrato => (
                  <option key={contrato.id} value={contrato.id}>
                    {contrato.numero} - {contrato.objeto}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição do Item</Label>
              <Input
                id="descricao"
                placeholder="Ex: Combustível Gasolina Comum"
                value={newItem.descricao}
                onChange={(e) => setNewItem({ ...newItem, descricao: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="Ex: 1000"
                  value={newItem.quantidade}
                  onChange={(e) => setNewItem({ ...newItem, quantidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  placeholder="Ex: Litro"
                  value={newItem.unidade}
                  onChange={(e) => setNewItem({ ...newItem, unidade: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor Unitário</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 5.79"
                  value={newItem.valor_unitario}
                  onChange={(e) => setNewItem({ ...newItem, valor_unitario: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddItem}>Adicionar Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Itens;
