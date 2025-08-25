
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Fornecedor } from "@/types";
import type { NewFornecedor } from "@/hooks/fornecedores/types";
import { useCpfCnpjMask } from "@/hooks/useCpfCnpjMask";
import { useEffect } from "react";

interface FornecedorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
  fornecedor: NewFornecedor;
  onFornecedorChange: (field: keyof NewFornecedor, value: string) => void;
  mode: 'create' | 'edit';
}

export const FornecedorFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  loading,
  fornecedor,
  onFornecedorChange,
  mode
}: FornecedorFormDialogProps) => {
  const isEditing = mode === 'edit';
  const { value: cnpjValue, handleChange: handleCnpjChange, getPlaceholder } = useCpfCnpjMask(fornecedor.cnpj);

  // Sincronizar o valor da máscara com o estado do formulário
  useEffect(() => {
    if (cnpjValue !== fornecedor.cnpj) {
      onFornecedorChange("cnpj", cnpjValue);
    }
  }, [cnpjValue, fornecedor.cnpj, onFornecedorChange]);

  // Sincronizar mudanças externas (como reset do formulário) com a máscara
  useEffect(() => {
    if (fornecedor.cnpj !== cnpjValue) {
      handleCnpjChange(fornecedor.cnpj);
    }
  }, [fornecedor.cnpj]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Fornecedor" : "Adicionar Novo Fornecedor"}
          </DialogTitle>
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
            <Input
              id="cnpj"
              placeholder={getPlaceholder()}
              value={cnpjValue}
              onChange={(e) => handleCnpjChange(e.target.value)}
            />
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
            {loading ? "Salvando..." : isEditing ? "Atualizar" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
