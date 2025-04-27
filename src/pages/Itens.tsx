import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { contratos, itens } from "@/data/mockData";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button, Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, Label } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/toast";

const Itens = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [contratoFilter, setContratoFilter] = useState<string>("todos");
  const [newItem, setNewItem] = useState({
    contratoId: "",
    descricao: "",
    quantidade: "",
    valorUnitario: "",
    unidade: ""
  });

  const filteredItens = itens.filter((item) => {
    const matchesSearch = item.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContrato = contratoFilter === "todos" || item.contratoId === contratoFilter;
    return matchesSearch && matchesContrato;
  });

  const handleAddItem = async () => {
    try {
      const { error } = await supabase.from('itens').insert([{
        contrato_id: newItem.contratoId,
        descricao: newItem.descricao,
        quantidade: parseFloat(newItem.quantidade),
        valor_unitario: parseFloat(newItem.valorUnitario.replace(/[^\d.,]/g, '').replace(',', '.')),
        unidade: newItem.unidade
      }]);

      if (error) throw error;

      setShowAddDialog(false);
      window.location.reload(); // Temporary solution to refresh data
      toast({
        title: "Sucesso",
        description: "Item cadastrado com sucesso.",
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
          <h1 className="text-2xl font-bold tracking-tight">Itens de Contrato</h1>
          <p className="text-muted-foreground">
            Acompanhamento do consumo dos itens de contratos
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
        <div className="w-64">
          <Select
            value={contratoFilter}
            onValueChange={setContratoFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por contrato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os contratos</SelectItem>
              {contratos.map((contrato) => (
                <SelectItem key={contrato.id} value={contrato.id}>
                  {contrato.numero}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Valor Unit.</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Consumido</TableHead>
              <TableHead>Progresso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItens.length > 0 ? (
              filteredItens.map((item) => {
                const contrato = contratos.find(c => c.id === item.contratoId);
                const percentConsumo = (item.quantidadeConsumida / item.quantidade) * 100;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.descricao}</TableCell>
                    <TableCell>{contrato?.numero}</TableCell>
                    <TableCell>{item.unidade}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.valorUnitario)}
                    </TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.quantidadeConsumida}</TableCell>
                    <TableCell>
                      <div className="w-full flex items-center gap-2">
                        <Progress value={percentConsumo} className="flex-1" />
                        <span className="text-xs w-12 text-right">
                          {percentConsumo.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contrato">Contrato</Label>
              <Select
                value={newItem.contratoId}
                onValueChange={(value) =>
                  setNewItem({ ...newItem, contratoId: value })
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

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={newItem.descricao}
                onChange={(e) =>
                  setNewItem({ ...newItem, descricao: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={newItem.quantidade}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantidade: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  value={newItem.unidade}
                  onChange={(e) =>
                    setNewItem({ ...newItem, unidade: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorUnitario">Valor Unitário</Label>
              <Input
                id="valorUnitario"
                value={newItem.valorUnitario}
                onChange={(e) =>
                  setNewItem({ ...newItem, valorUnitario: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddItem}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Itens;
