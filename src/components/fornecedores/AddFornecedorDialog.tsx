import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Fornecedor } from "@/types";
import InputMask from 'react-input-mask';

interface AddFornecedorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  fornecedor: Omit<Fornecedor, 'id' | 'createdAt'>;
  onFornecedorChange: (field: keyof Omit<Fornecedor, 'id' | 'createdAt'>, value: string) => void;
}

export const AddFornecedorDialog = ({
  open,
  onOpenChange,
  onSubmit,
  loading,
  fornecedor,
  onFornecedorChange,
}: AddFornecedorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={fornecedor.nome}
              onChange={(e) => onFornecedorChange("nome", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CPF ou CNPJ</Label>
            <InputMask
              mask={fornecedor.cnpj.replace(/\D/g, '').length > 11 ? '99.999.999/9999-99' : '999.999.999-99'}
              value={fornecedor.cnpj}
              onChange={(e) => onFornecedorChange("cnpj", e.target.value)}
            >
              {(inputProps) => (
                <Input
                  {...inputProps}
                  id="cnpj"
                  placeholder="CPF ou CNPJ"
                />
              )}
            </InputMask>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contato@empresa.com"
              value={fornecedor.email}
              onChange={(e) => onFornecedorChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              placeholder="(00) 00000-0000"
              value={fornecedor.telefone}
              onChange={(e) => onFornecedorChange("telefone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              placeholder="Endereço completo"
              value={fornecedor.endereco}
              onChange={(e) => onFornecedorChange("endereco", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
