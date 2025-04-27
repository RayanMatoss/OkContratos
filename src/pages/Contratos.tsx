import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { contratos, fornecedores } from "@/data/mockData";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FundoMunicipal } from "@/types";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/toast";

const Contratos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newContrato, setNewContrato] = useState({
    numero: "",
    fornecedorId: "",
    fundoMunicipal: "Prefeitura" as FundoMunicipal,
    objeto: "",
    valor: "",
    dataInicio: new Date(),
    dataTermino: new Date(),
  });

  const filteredContratos = contratos.filter((contrato) => {
    return (
      contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.fornecedor?.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddContrato = async () => {
    try {
      const { error } = await supabase.from('contratos').insert([{
        numero: newContrato.numero,
        fornecedor_id: newContrato.fornecedorId,
        fundo_municipal: newContrato.fundoMunicipal,
        objeto: newContrato.objeto,
        valor: parseFloat(newContrato.valor.replace(/[^\d.,]/g, '').replace(',', '.')),
        data_inicio: newContrato.dataInicio.toISOString(),
        data_termino: newContrato.dataTermino.toISOString()
      }]);

      if (error) throw error;

      setShowAddDialog(false);
      window.location.reload(); // Temporary solution to refresh data
      toast({
        title: "Sucesso",
        description: "Contrato cadastrado com sucesso.",
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
          <h1 className="text-2xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">
            Gerenciamento dos contratos registrados no sistema
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Novo Contrato</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar contratos..."
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
              <TableHead>Fornecedor</TableHead>
              <TableHead>Fundo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vigência</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContratos.length > 0 ? (
              filteredContratos.map((contrato) => (
                <TableRow key={contrato.id}>
                  <TableCell className="font-medium">{contrato.numero}</TableCell>
                  <TableCell>{contrato.fornecedor?.nome}</TableCell>
                  <TableCell>{contrato.fundoMunicipal}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(contrato.valor)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(contrato.dataInicio), 'dd/MM/yyyy')} a{' '}
                    {format(new Date(contrato.dataTermino), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={contrato.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum contrato encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Contrato</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numero">Número do Contrato</Label>
                <Input
                  id="numero"
                  placeholder="2023/001"
                  value={newContrato.numero}
                  onChange={(e) =>
                    setNewContrato({ ...newContrato, numero: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Select
                  value={newContrato.fornecedorId}
                  onValueChange={(value) =>
                    setNewContrato({ ...newContrato, fornecedorId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores.map((fornecedor) => (
                      <SelectItem key={fornecedor.id} value={fornecedor.id}>
                        {fornecedor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fundo">Fundo Municipal</Label>
                <Select
                  value={newContrato.fundoMunicipal}
                  onValueChange={(value) =>
                    setNewContrato({
                      ...newContrato,
                      fundoMunicipal: value as FundoMunicipal,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um fundo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prefeitura">Prefeitura</SelectItem>
                    <SelectItem value="Educação">Educação</SelectItem>
                    <SelectItem value="Saúde">Saúde</SelectItem>
                    <SelectItem value="Assistência">Assistência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor do Contrato</Label>
                <Input
                  id="valor"
                  placeholder="0,00"
                  value={newContrato.valor}
                  onChange={(e) =>
                    setNewContrato({ ...newContrato, valor: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objeto">Objeto do Contrato</Label>
              <Input
                id="objeto"
                placeholder="Descreva o objeto do contrato"
                value={newContrato.objeto}
                onChange={(e) =>
                  setNewContrato({ ...newContrato, objeto: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newContrato.dataInicio && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newContrato.dataInicio ? (
                        format(newContrato.dataInicio, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newContrato.dataInicio}
                      onSelect={(date) =>
                        date && setNewContrato({ ...newContrato, dataInicio: date })
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data de Término</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newContrato.dataTermino && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newContrato.dataTermino ? (
                        format(newContrato.dataTermino, "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newContrato.dataTermino}
                      onSelect={(date) =>
                        date && setNewContrato({ ...newContrato, dataTermino: date })
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddContrato}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contratos;
