
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DatePickerField from "./DatePickerField";
import ContratoBasicInfo from "./ContratoBasicInfo";
import { FormSheet } from "@/components/ui/form-sheet";
import { Fornecedor } from "@/types";

type AddContratoFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export const AddContratoForm = ({
  open,
  onOpenChange,
  onSuccess
}: AddContratoFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState<"basic" | "dates" | "items">("basic");
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [formData, setFormData] = useState({
    numero: "",
    objeto: "",
    fornecedor_id: "",
    valor: "",
    fundo_municipal: "",
    data_inicio: new Date(),
    data_termino: new Date()
  });

  useEffect(() => {
    if (open) {
      fetchFornecedores();
    }
  }, [open]);

  const formatFornecedor = (fornecedor: any): Fornecedor => {
    return {
      id: fornecedor.id,
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      email: fornecedor.email || "",
      telefone: fornecedor.telefone || "",
      endereco: fornecedor.endereco || "",
      createdAt: new Date(fornecedor.created_at),
    };
  };

  const fetchFornecedores = async () => {
    try {
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .order("nome");

      if (error) throw error;

      const formattedFornecedores = data.map(formatFornecedor);
      setFornecedores(formattedFornecedores);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar fornecedores",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleNextStep = () => {
    if (formStep === "basic") {
      setFormStep("dates");
    } else if (formStep === "dates") {
      setFormStep("items");
    }
  };

  const handlePreviousStep = () => {
    if (formStep === "dates") {
      setFormStep("basic");
    } else if (formStep === "items") {
      setFormStep("dates");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.from("contratos").insert({
        numero: formData.numero,
        objeto: formData.objeto,
        fornecedor_id: formData.fornecedor_id,
        valor: parseFloat(formData.valor),
        fundo_municipal: formData.fundo_municipal,
        data_inicio: formData.data_inicio.toISOString(),
        data_termino: formData.data_termino.toISOString()
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Contrato criado com sucesso."
      });
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      title="Novo Contrato"
      description="Preencha os dados do novo contrato"
      loading={loading}
    >
      {formStep === "basic" && (
        <ContratoBasicInfo 
          numero={formData.numero}
          fornecedorId={formData.fornecedor_id}
          fundoMunicipal={formData.fundo_municipal as any}
          objeto={formData.objeto}
          valor={formData.valor}
          fornecedores={fornecedores}
          onFieldChange={(field, value) => setFormData({
            ...formData,
            [field]: value
          })}
        />
      )}

      {formStep === "dates" && (
        <div className="space-y-4">
          <DatePickerField 
            label="Data de Início" 
            date={formData.data_inicio} 
            onDateChange={date => setFormData({
              ...formData,
              data_inicio: date || new Date()
            })} 
          />
          <DatePickerField 
            label="Data de Término" 
            date={formData.data_termino} 
            onDateChange={date => setFormData({
              ...formData,
              data_termino: date || new Date()
            })} 
          />
        </div>
      )}

      {formStep === "items" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Itens do Contrato</h3>
          <p className="text-sm text-muted-foreground">
            Os itens podem ser adicionados após a criação do contrato.
          </p>
        </div>
      )}
    </FormSheet>
  );
};

export default AddContratoForm;
