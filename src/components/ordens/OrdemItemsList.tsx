
import { Item } from "@/types";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo } from "react";

interface OrdemItemsListProps {
  contratoItens: Item[];
  selectedItems: { itemId: string; quantidade: number }[];
  mode: 'create' | 'edit';
  onQuantityChange: (itemId: string, quantidade: number) => void;
}

const OrdemItemsList = ({
  contratoItens,
  selectedItems,
  mode,
  onQuantityChange,
}: OrdemItemsListProps) => {
  const getSelectedQuantity = (itemId: string) => {
    const item = selectedItems.find(i => i.itemId === itemId);
    return item ? item.quantidade : 0;
  };

  // Calcular total geral dos itens selecionados
  const { totalGeral, itensComQuantidade } = useMemo(() => {
    let total = 0;
    let count = 0;
    
    selectedItems.forEach(selectedItem => {
      const item = contratoItens.find(i => i.id === selectedItem.itemId);
      if (item && selectedItem.quantidade > 0) {
        total += selectedItem.quantidade * item.valorUnitario;
        count++;
      }
    });
    
    return { totalGeral: total, itensComQuantidade: count };
  }, [selectedItems, contratoItens]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <div className="bg-muted/50 px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Itens do Contrato</h3>
          <p className="text-sm text-muted-foreground mt-1">Selecione os itens e quantidades para esta ordem de fornecimento</p>
        </div>
        
        {contratoItens.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <div className="text-lg font-medium">Nenhum item disponível</div>
            <div className="text-sm mt-1">Selecione um contrato para visualizar os itens disponíveis</div>
          </div>
        ) : (
          <div 
            style={{
              height: '400px',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            <table className="w-full">
              <thead className="sticky top-0 bg-background z-10 border-b shadow-sm">
                <tr className="bg-muted/30 border-b">
                  <th className="font-semibold text-left py-3 px-4 bg-background" style={{ width: '35%' }}>
                    Descrição
                  </th>
                  <th className="font-semibold text-center py-3 bg-background" style={{ width: '10%' }}>
                    Qtd. Original
                  </th>
                  <th className="font-semibold text-center py-3 bg-background" style={{ width: '10%' }}>
                    Qtd. Consumida
                  </th>
                  <th className="font-semibold text-center py-3 bg-background" style={{ width: '10%' }}>
                    Saldo Disponível
                  </th>
                  <th className="font-semibold text-center py-3 bg-background" style={{ width: '8%' }}>
                    Unidade
                  </th>
                  <th className="font-semibold text-center py-3 bg-background" style={{ width: '12%' }}>
                    Valor Unitário
                  </th>
                  <th className="font-semibold text-center py-3 bg-background" style={{ width: '15%' }}>
                    Quantidade / Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {contratoItens.map((item) => {
                  const selectedQuantity = getSelectedQuantity(item.id);
                  const adjustedAvailable = mode === 'edit'
                    ? item.quantidade - item.quantidadeConsumida + selectedQuantity
                    : item.quantidade - item.quantidadeConsumida;
                  
                  const totalItem = selectedQuantity * item.valorUnitario;

                  return (
                    <tr key={item.id} className="hover:bg-muted/50 border-b transition-colors">
                      <td className="font-medium py-4 px-4">
                        <div className="leading-tight">
                          {item.descricao}
                        </div>
                      </td>
                      <td className="text-center py-4">
                        <span className="text-sm">
                          {item.quantidade.toLocaleString('pt-BR')}
                        </span>
                      </td>
                      <td className="text-center py-4">
                        <span className="text-sm">
                          {item.quantidadeConsumida.toLocaleString('pt-BR')}
                        </span>
                      </td>
                      <td className="text-center py-4">
                        <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                          {adjustedAvailable.toLocaleString('pt-BR')}
                        </span>
                      </td>
                      <td className="text-center py-4">
                        <span className="text-sm">
                          {item.unidade}
                        </span>
                      </td>
                      <td className="text-center py-4">
                        <span className="text-sm font-medium">
                          R$ {item.valorUnitario.toLocaleString('pt-BR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                          })}
                        </span>
                      </td>
                      <td className="text-center py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min={0}
                            max={adjustedAvailable}
                            value={selectedQuantity || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                              if (value <= adjustedAvailable) {
                                onQuantityChange(item.id, value);
                              }
                            }}
                            className="w-16 text-center text-sm h-8"
                            placeholder="0"
                            disabled={adjustedAvailable === 0}
                          />
                          <div className="text-right min-w-[70px]">
                            <span className={`text-sm font-semibold ${selectedQuantity > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`}>
                              R$ {totalItem.toLocaleString('pt-BR', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {/* Linha extra para garantir espaçamento */}
                <tr>
                  <td colSpan={7} style={{ height: '20px' }}></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Total Geral - Sempre visível quando há itens selecionados ou contratos carregados */}
      {contratoItens.length > 0 && (
        <div className="bg-muted/30 border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-sm text-muted-foreground">
                {itensComQuantidade > 0 ? `${itensComQuantidade} item(ns) selecionado(s)` : 'Nenhum item selecionado'}
              </div>
              {itensComQuantidade > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Digite as quantidades nos campos acima para calcular o total
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Geral da Ordem:</div>
              <div className={`text-2xl font-bold transition-colors ${totalGeral > 0 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                R$ {totalGeral.toLocaleString('pt-BR', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdemItemsList;
