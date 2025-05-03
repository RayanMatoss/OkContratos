import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ItemsTable } from "@/components/itens/ItemsTable";
import { SearchInput } from "@/components/itens/SearchInput";
import { AddItemsDialog } from "@/components/itens/AddItemsDialog";
import { EditItemDialog } from "@/components/itens/EditItemDialog";
import { ItensHeader } from "@/components/itens/ItensHeader";
import { useItensCrud, ItemResponse } from "@/hooks/itens/useItensCrud";
import { useContratos } from "@/hooks/itens/useContratos";
import { useItensFilter } from "@/hooks/itens/useItensFilter";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { formatCurrency } from "@/lib/utils";

const Itens = () => {
  const { toast } = useToast();
  const { itens, loading, fetchItens, handleEdit, handleDelete } = useItensCrud();
  const { contratos } = useContratos();
  const { searchTerm, setSearchTerm, filteredItens } = useItensFilter(itens);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);

  useEffect(() => {
    fetchItens();
  }, []);

  // Agrupar itens por contrato
  const contratosComItens = contratos.map(contrato => ({
    ...contrato,
    itens: filteredItens.filter(item => item.contrato_id === contrato.id)
  })).filter(contrato => contrato.itens.length > 0);

  const onEdit = (item: ItemResponse) => {
    const editableItem = handleEdit(item);
    if (editableItem) {
      setEditingItem(editableItem);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ItensHeader onAddItem={() => setShowAddDialog(true)} />

      <div className="flex items-center gap-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>

      <Accordion type="multiple" className="mt-4">
        {contratosComItens.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">Nenhum item encontrado.</div>
        )}
        {contratosComItens.map(contrato => (
          <AccordionItem key={contrato.id} value={contrato.id}>
            <AccordionTrigger>
              <div className="flex flex-col md:flex-row md:items-center gap-2 w-full">
                <span className="font-semibold">{contrato.numero}</span>
                <span className="text-muted-foreground text-sm">{contrato.objeto}</span>
                <span className="text-muted-foreground text-sm">{contrato.fornecedor?.nome}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <table className="w-full text-sm mt-2">
                <thead>
                  <tr>
                    <th className="text-left">Descrição</th>
                    <th>Quantidade</th>
                    <th>Consumido</th>
                    <th>Unidade</th>
                    <th>Valor Unit.</th>
                    <th>Valor Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contrato.itens.map(item => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.descricao}</td>
                      <td className="text-center">{item.quantidade}</td>
                      <td className="text-center">{item.quantidade_consumida}</td>
                      <td className="text-center">{item.unidade}</td>
                      <td className="text-right">{formatCurrency(item.valor_unitario)}</td>
                      <td className="text-right">{formatCurrency(item.quantidade * item.valor_unitario)}</td>
                      <td className="text-center">
                        <button className="text-primary" onClick={() => onEdit(item)}>
                          <span className="sr-only">Editar</span>
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.474 5.34a2.25 2.25 0 1 1 3.182 3.182L8.94 19.238a4 4 0 0 1-1.687 1.01l-3.13.94.94-3.13a4 4 0 0 1 1.01-1.687L16.474 5.34Z"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <AddItemsDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          setShowAddDialog(false);
          fetchItens();
        }}
        contratos={contratos}
      />

      {editingItem && (
        <EditItemDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onSuccess={fetchItens}
          item={editingItem}
        />
      )}
    </div>
  );
};

export default Itens;
