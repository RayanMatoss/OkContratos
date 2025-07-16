import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Contrato, Item, FundoMunicipal } from "@/types";

interface ContratoFormValues {
  numero: string;
  fornecedorId: string | undefined;
  objeto: string;
  valor: number;
  dataInicio: Date | null;
  dataTermino: Date | null;
  fundoMunicipal: FundoMunicipal[];
  itens: Item[];
}

export const useContratoForm = (
  initialValues?: Contrato,
  onSuccess?: () => void
) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<ContratoFormValues>({
    numero: initialValues?.numero || "",
    fornecedorId: initialValues?.fornecedorId || undefined,
    objeto: initialValues?.objeto || "",
    valor: initialValues?.valor || 0,
    dataInicio: initialValues?.dataInicio || null,
    dataTermino: initialValues?.dataTermino || null,
    fundoMunicipal: initialValues?.fundoMunicipal || [],
    itens: initialValues?.itens || [],
  });

  const handleChange = (
    key: keyof ContratoFormValues,
    value: ContratoFormValues[keyof ContratoFormValues]
  ) => {
    setFormValues({ ...formValues, [key]: value });
  };

  const handleSubmit = useCallback(
    async (id?: string) => {
      setLoading(true);
      try {
        const {
          numero,
          fornecedorId,
          objeto,
          valor,
          dataInicio,
          dataTermino,
          fundoMunicipal,
          itens,
        } = formValues;

        if (
          !numero ||
          !fornecedorId ||
          !objeto ||
          !valor ||
          !dataInicio ||
          !dataTermino
        ) {
          toast({
            title: "Erro",
            description: "Preencha todos os campos obrigatórios.",
            variant: "destructive",
          });
          return;
        }

        const contratoData = {
          numero,
          fornecedor_id: fornecedorId,
          objeto,
          valor,
          data_inicio: dataInicio.toISOString(),
          data_termino: dataTermino.toISOString(),
          fundo_municipal: fundoMunicipal,
        };

        const itensData = itens.map((item) => ({
          descricao: item.descricao,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valor_unitario: item.valor_unitario,
          fundos: item.fundos,
        }));

        if (id) {
          // Update existing contrato
          const { error: contratoError } = await supabase
            .from("contratos")
            .update(contratoData)
            .eq("id", id);

          if (contratoError) throw contratoError;

          // Delete existing itens and insert new ones
          const { error: deleteItensError } = await supabase
            .from("itens")
            .delete()
            .eq("contrato_id", id);

          if (deleteItensError) throw deleteItensError;

          const { error: itensError } = await supabase
            .from("itens")
            .insert(
              itensData.map((item) => ({ ...item, contrato_id: id }))
            );

          if (itensError) throw itensError;

          toast({
            title: "Sucesso",
            description: "Contrato atualizado com sucesso.",
          });
        } else {
          // Create new contrato
          const { data, error: contratoError } = await supabase
            .from("contratos")
            .insert([contratoData])
            .select()

          if (contratoError) throw contratoError;

          const newContrato = data?.[0];

          if (newContrato) {
            const { error: itensError } = await supabase
              .from("itens")
              .insert(
                itensData.map((item) => ({ ...item, contrato_id: newContrato.id }))
              );

            if (itensError) throw itensError;

            toast({
              title: "Sucesso",
              description: "Contrato criado com sucesso.",
            });
          } else {
            throw new Error("Failed to create contrato");
          }
        }

        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [formValues, toast, supabase, onSuccess]
  );

  const setContrato = useCallback((contrato: Contrato) => {
    setFormValues({
      numero: contrato.numero,
      fornecedorId: contrato.fornecedorId,
      objeto: contrato.objeto,
      valor: contrato.valor,
      dataInicio: contrato.dataInicio,
      dataTermino: contrato.dataTermino,
      fundoMunicipal: contrato.fundoMunicipal,
      itens: contrato.itens,
    });

    const itensFormatados = contrato.itens.map((item: any) => ({
      descricao: item.descricao,
      quantidade: item.quantidade,
      unidade: item.unidade || 'un',
      valor_unitario: item.valor_unitario || item.valorUnitario || 0,
      fundos: Array.isArray(item.fundos) ? item.fundos : 
             Array.isArray(item.fundoMunicipal) ? item.fundoMunicipal :
             typeof item.fundos === 'string' ? [item.fundos] : []
    }));

  }, []);

  return {
    formValues,
    loading,
    handleChange,
    handleSubmit,
    setContrato,
  };
};
