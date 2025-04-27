import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { contratos, ordens } from "@/data/mockData";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/toast";

const Ordens = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newOrdem, setNewOrdem] = useState({
    numero: "",
    contratoId: "",
    dataEmissao: new Date(),
    itensConsumidos: [] as { itemId: string; quantidade: number }[]
  });

  const filteredOrdens = ordens.filter((ordem) => {
    return (
      ordem.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ordem.contrato?.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddOrdem = async () => {
    try {
      // First, create the order
      const { data: ordem, error: orderError } = await supabase.from('ordens').insert([{
        numero: newOrdem.numero,
        contrato_id: newOrdem.contratoId,
        data_emissao: newOrdem.dataEmissao.toISOString(),
      }]).select().single();

      if (orderError) throw orderError;

      // Then, add the consumed items
      const itemsToInsert = newOrdem.itensConsumidos.map(item => ({
        ordem_id: ordem.id,
        item_id: item.itemId,
        quantidade: item.quantidade
      }));

      const { error: itemsError } = await supabase
        .from('itens_consumidos')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // Update the consumed quantities in the items table
      for (const item of newOrdem.itensConsumidos) {
        const { error: updateError } = await supabase.rpc('update_item_quantity', {
          p_item_id: item.itemId,
          p_quantidade: item.quantidade
        });
        
        if (updateError) throw updateError;
      }

      setShowAddDialog(false);
      window.location.reload(); // Temporary solution to refresh data
      toast({
        title: "Sucesso",
        description: "Ordem de fornecimento cadastrada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ordens de Fornecimento</h1>
          <p className="text-muted-foreground">
            Gerenciamento das ordens de fornecimento e serviço
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nova Ordem</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ordens..."
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
              <TableHead>Número</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrdens.length > 0 ? (
              filteredOrdens.map((ordem) => (
                <TableRow key={ordem.id}>
                  <TableCell className="font-medium">{ordem.numero}</TableCell>
                  <TableCell>{ordem.contrato?.numero}</TableCell>
                  <TableCell>
                    {format(new Date(ordem.dataEmissao), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{ordem.contrato?.fornecedor?.nome}</TableCell>
                  <TableCell>
                    <StatusBadge status={ordem.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma ordem encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nova Ordem de Fornecimento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número da Ordem</Label>
                <Input
                  id="numero"
                  placeholder="OF-2023/001"
                  value={newOrdem.numero}
                  onChange={(e) =>
                    setNewOrdem({ ...newOrdem, numero: e.target.value })
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label>Data de Emissão</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newOrdem.dataEmissao && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newOrdem.dataEmissao ? (
                        format(newOrdem.dataEmissao, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newOrdem.dataEmissao}
                      onSelect={(date) =>
                        date && setNewOrdem({ ...newOrdem, dataEmissao: date })
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrato">Contrato</Label>
              <Select
                value={newOrdem.contratoId}
                onValueChange={(value) =>
                  setNewOrdem({ ...newOrdem, contratoId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um contrato" />
                </SelectTrigger>
                <SelectContent>
                  {contratos
                    .filter(c => c.status === "Ativo")
                    .map((contrato) => (
                    <SelectItem key={contrato.id} value={contrato.id}>
                      {contrato.numero} - {contrato.fornecedor?.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newOrdem.contratoId && (
              <div className="space-y-2">
                <Label>Itens do Contrato</Label>
                <div className="max-h-[200px] overflow-y-auto space-y-2 rounded-md border p-2">
                  {contratos
                    .find((c) => c.id === newOrdem.contratoId)
                    ?.itens.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.descricao}</p>
                          <p className="text-xs text-muted-foreground">
                            Disponível: {item.quantidade - item.quantidadeConsumida} {item.unidade}
                          </p>
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            min={0}
                            max={item.quantidade - item.quantidadeConsumida}
                            placeholder="Qtd"
                            onChange={(e) => {
                              const quantidade = parseInt(e.target.value) || 0;
                              const itemIdx = newOrdem.itensConsumidos.findIndex(
                                (i) => i.itemId === item.id
                              );
                              if (itemIdx >= 0) {
                                const newItens = [...newOrdem.itensConsumidos];
                                newItens[itemIdx].quantidade = quantidade;
                                setNewOrdem({
                                  ...newOrdem,
                                  itensConsumidos: newItens,
                                });
                              } else {
                                setNewOrdem({
                                  ...newOrdem,
                                  itensConsumidos: [
                                    ...newOrdem.itensConsumidos,
                                    { itemId: item.id, quantidade },
                                  ],
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddOrdem}>Criar Ordem</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ordens;
