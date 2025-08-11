import { useState } from "react";
import { useAditivos } from "@/hooks/useAditivos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TipoAditivo } from "@/types";
import { Calendar, DollarSign, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AditivoFormDialogProps {
  contratoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AditivoFormDialog = ({ contratoId, open, onOpenChange, onSuccess }: AditivoFormDialogProps) => {
  const { criarAditivo, loading } = useAditivos(contratoId);
  const { toast } = useToast();
  const [tipo, setTipo] = useState<TipoAditivo>("periodo");
  const [novaDataTermino, setNovaDataTermino] = useState("");
  const [percentual, setPercentual] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (tipo === "periodo") {
      if (!novaDataTermino) {
        newErrors.novaDataTermino = "Data de término é obrigatória";
      } else {
        const selectedDate = new Date(novaDataTermino);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate <= today) {
          newErrors.novaDataTermino = "A nova data deve ser posterior a hoje";
        }
      }
    }

    if (tipo === "valor") {
      if (!percentual) {
        newErrors.percentual = "Percentual é obrigatório";
      } else {
        const percentualNum = parseFloat(percentual);
        if (isNaN(percentualNum) || percentualNum <= 0 || percentualNum > 100) {
          newErrors.percentual = "Percentual deve estar entre 0.01 e 100";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const aditivo: any = {
      contrato_id: contratoId,
      tipo,
    };

    if (tipo === "periodo") {
      aditivo.nova_data_termino = novaDataTermino;
    }
    if (tipo === "valor") {
      aditivo.percentual_itens = parseFloat(percentual);
    }

    const ok = await criarAditivo(aditivo);
    if (ok) {
      // Reset form
      setNovaDataTermino("");
      setPercentual("");
      setTipo("periodo");
      setErrors({});
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }
  };

  const handleCancel = () => {
    setNovaDataTermino("");
    setPercentual("");
    setTipo("periodo");
    setErrors({});
    onOpenChange(false);
  };

  const getTipoIcon = (tipo: TipoAditivo) => {
    switch (tipo) {
      case "periodo":
        return <Calendar className="w-5 h-5" />;
      case "valor":
        return <DollarSign className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTipoDescription = (tipo: TipoAditivo) => {
    switch (tipo) {
      case "periodo":
        return "Estende o prazo de vigência do contrato";
      case "valor":
        return "Aumenta o valor dos itens do contrato por percentual";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTipoIcon(tipo)}
            Novo Aditivo
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Aditivo */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Aditivo</Label>
            <Select value={tipo} onValueChange={(value) => setTipo(value as TipoAditivo)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="periodo">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Aditivo de Período
                  </div>
                </SelectItem>
                <SelectItem value="valor">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Aditivo de Valor
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {getTipoDescription(tipo)}
            </p>
          </div>

          {/* Campo específico baseado no tipo */}
          {tipo === "periodo" && (
            <div className="space-y-2">
              <Label htmlFor="novaDataTermino">Nova Data de Vigência</Label>
              <Input
                id="novaDataTermino"
                type="date"
                value={novaDataTermino}
                onChange={(e) => setNovaDataTermino(e.target.value)}
                className={errors.novaDataTermino ? "border-red-500" : ""}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.novaDataTermino && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.novaDataTermino}
                </div>
              )}
            </div>
          )}

          {tipo === "valor" && (
            <div className="space-y-2">
              <Label htmlFor="percentual">Percentual de Acréscimo (%)</Label>
              <Input
                id="percentual"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                value={percentual}
                onChange={(e) => setPercentual(e.target.value)}
                placeholder="Ex: 15.50"
                className={errors.percentual ? "border-red-500" : ""}
              />
              {errors.percentual && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.percentual}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Exemplo: 15.50 = aumento de 15,5% no valor dos itens
              </p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Aditivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AditivoFormDialog; 