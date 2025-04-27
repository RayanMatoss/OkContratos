
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FundoMunicipal } from "@/types";
import DatePickerField from "./DatePickerField";
import ContratoBasicInfo from "./ContratoBasicInfo";

interface AddContratoFormProps {
  showDialog: boolean;
  onCloseDialog: () => void;
}

const AddContratoForm = ({ showDialog, onCloseDialog }: AddContratoFormProps) => {
  const [newContrato, setNewContrato] = useState({
    numero: "",
    fornecedorId: "",
    fundoMunicipal: "Prefeitura" as FundoMunicipal,
    objeto: "",
    valor: "",
    dataInicio: new Date(),
    dataTermino: new Date(),
  });

  const handleFieldChange = (field: string, value: string) => {
    setNewContrato((prev) => ({ ...prev, [field]: value }));
  };

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

      onCloseDialog();
      window.location.reload();
      toast({
        description: "Contrato cadastrado com sucesso.",
      });
    } catch (error: any) {
      toast({
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={onCloseDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Contrato</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ContratoBasicInfo
            numero={newContrato.numero}
            fornecedorId={newContrato.fornecedorId}
            fundoMunicipal={newContrato.fundoMunicipal}
            objeto={newContrato.objeto}
            valor={newContrato.valor}
            onFieldChange={handleFieldChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <DatePickerField
              date={newContrato.dataInicio}
              onDateChange={(date) =>
                setNewContrato((prev) => ({ ...prev, dataInicio: date }))
              }
              label="Data de Início"
            />

            <DatePickerField
              date={newContrato.dataTermino}
              onDateChange={(date) =>
                setNewContrato((prev) => ({ ...prev, dataTermino: date }))
              }
              label="Data de Término"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCloseDialog}>
            Cancelar
          </Button>
          <Button onClick={handleAddContrato}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddContratoForm;
