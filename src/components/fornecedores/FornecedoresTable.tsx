
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableActions } from "@/components/ui/table-actions";
import type { Fornecedor } from "@/types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FornecedoresTableProps {
  fornecedores: Fornecedor[];
  onEdit: (fornecedor: Fornecedor) => void;
  onDelete: (fornecedor: Fornecedor) => void;
}

export const FornecedoresTable = ({ fornecedores, onEdit, onDelete }: FornecedoresTableProps) => {
  const [fornecedoresWithContracts, setFornecedoresWithContracts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkContracts = async () => {
      const promises = fornecedores.map(async (fornecedor) => {
        const { count } = await supabase
          .from('contratos')
          .select('*', { count: 'exact', head: true })
          .eq('fornecedor_id', fornecedor.id);
        
        return { id: fornecedor.id, hasContracts: (count || 0) > 0 };
      });

      const results = await Promise.all(promises);
      const idsWithContracts = new Set(
        results.filter(r => r.hasContracts).map(r => r.id)
      );
      
      setFornecedoresWithContracts(idsWithContracts);
    };

    checkContracts();
  }, [fornecedores]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fornecedores.length > 0 ? (
            fornecedores.map((fornecedor) => (
              <TableRow key={fornecedor.id}>
                <TableCell className="font-medium">{fornecedor.nome}</TableCell>
                <TableCell>{fornecedor.cnpj}</TableCell>
                <TableCell>{fornecedor.email}</TableCell>
                <TableCell>{fornecedor.telefone}</TableCell>
                <TableCell>{fornecedor.endereco}</TableCell>
                <TableCell className="text-right">
                  <TableActions
                    onEdit={() => onEdit(fornecedor)}
                    onDelete={() => onDelete(fornecedor)}
                    disableDelete={fornecedoresWithContracts.has(fornecedor.id)}
                    deleteTooltip={
                      fornecedoresWithContracts.has(fornecedor.id) 
                        ? "Este fornecedor possui contratos associados e não pode ser excluído"
                        : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum fornecedor encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
