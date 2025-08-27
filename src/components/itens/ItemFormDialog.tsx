
import { FormSheet } from "@/components/ui/form-sheet";
import { useState } from "react";
import { ItemForm } from "./ItemForm";
import { Item } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ItemFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  item?: Item;
  mode: 'create' | 'edit';
  contratos: { id: string; numero: string; objeto: string }[];
};

export const ItemFormDialog = ({ 
  open, 
  onOpenChange,
  onSuccess, 
  item,
  mode = 'create',
  contratos
}: ItemFormDialogProps) => {
  const title = mode === 'create' ? "Novo Item" : "Editar Item";
  const description = mode === 'create' 
    ? "Preencha os dados para criar um novo item"
    : "Edite os dados deste item";

  const { toast } = useToast();
  const [itemsList, setItemsList] = useState<any[]>([]);

  const handleAddItem = (newItem: any) => {
    setItemsList([...itemsList, newItem]);
  };

  const handleSubmitItems = async () => {
    if (itemsList.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item à lista antes de salvar.",
        variant: "destructive"
      });
      return;
    }
    try {
      const itemsToAdd = itemsList.map(item => ({
        contrato_id: item.contrato_id,
        descricao: item.descricao,
        quantidade: parseFloat(item.quantidade),
        unidade: item.unidade,
        valor_unitario: parseFloat(item.valor_unitario),
        quantidade_consumida: 0
      }));
      const { error } = await supabase.from('itens').insert(itemsToAdd);
      if (error) throw error;
      toast({
        title: "Sucesso",
        description: "Itens adicionados com sucesso."
      });
      onOpenChange(false);
      setItemsList([]);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar itens",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmitItems();
      }}
      title={title}
      description={description}
    >
      <ItemForm 
        contratos={contratos}
        onAdd={handleAddItem}
      />
      {/* Lista de itens adicionados localmente */}
      <div style={{marginTop: 16}}>
        <strong>Itens adicionados:</strong>
        <ul>
          {itemsList.map((item, idx) => (
            <li key={`item-${idx}-${item.descricao}-${item.contrato_id}`}>{item.descricao} - {item.quantidade} {item.unidade} - R$ {item.valor_unitario}</li>
          ))}
        </ul>
      </div>
    </FormSheet>
  );
};
