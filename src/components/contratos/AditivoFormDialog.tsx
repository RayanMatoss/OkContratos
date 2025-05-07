import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAditivos } from "@/hooks/useAditivos";
import { TipoAditivo } from "@/types";

interface AditivoFormDialogProps {
  contratoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AditivoFormDialog = ({ contratoId, open, onOpenChange, onSuccess }: AditivoFormDialogProps) => {
  const { criarAditivo, loading } = useAditivos(contratoId);
  const [tipo, setTipo] = useState<TipoAditivo>("periodo");
  const [novaDataTermino, setNovaDataTermino] = useState("");
  const [percentual, setPercentual] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tipo === "periodo" && !novaDataTermino) return;
    if (tipo === "valor" && !percentual) return;
    const aditivo: any = {
      contrato_id: contratoId,
      tipo,
    };
    if (tipo === "periodo") aditivo.nova_data_termino = novaDataTermino;
    if (tipo === "valor") aditivo.percentual_itens = parseFloat(percentual);
    const ok = await criarAditivo(aditivo);
    if (ok) {
      setNovaDataTermino("");
      setPercentual("");
      setTipo("periodo");
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Aditivo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tipo de Aditivo</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={tipo}
              onChange={e => setTipo(e.target.value as TipoAditivo)}
            >
              <option value="periodo">Aditivo de Período</option>
              <option value="valor">Aditivo de Valor</option>
            </select>
          </div>
          {tipo === "periodo" && (
            <div>
              <label className="block mb-1 font-medium">Nova Data de Vigência</label>
              <Input
                type="date"
                value={novaDataTermino}
                onChange={e => setNovaDataTermino(e.target.value)}
                required
              />
            </div>
          )}
          {tipo === "valor" && (
            <div>
              <label className="block mb-1 font-medium">Percentual de Acréscimo (%)</label>
              <Input
                type="number"
                min={0.01}
                step={0.01}
                value={percentual}
                onChange={e => setPercentual(e.target.value)}
                required
              />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AditivoFormDialog; 