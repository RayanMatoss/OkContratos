
import { useState, useMemo } from "react";
import { ItemResponse } from "./useItensCrud";

export const useItensFilter = (itens: ItemResponse[]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItens = useMemo(() => {
    return itens.filter((item) => {
      return (
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.quantidade).includes(searchTerm) ||
        String(item.valor_unitario).includes(searchTerm) ||
        item.contratos?.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contratos?.fornecedores?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [itens, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItens
  };
};
