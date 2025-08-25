import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, DollarSign, Percent, Info, AlertCircle } from "lucide-react";
import { useAditivos } from "@/hooks/useAditivos";
import { useToast } from "@/hooks/use-toast";
import { TipoAditivo, Aditivo } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface AditivoFormDialogProps {
  contratoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ItemContrato {
  id: string;
  descricao: string;
  valor_unitario: number;
  quantidade: number;
}

const AditivoFormDialog = ({
  contratoId,
  open,
  onOpenChange,
  onSuccess,
}: AditivoFormDialogProps) => {
  const { criarAditivo, loading } = useAditivos(contratoId);
  const { toast } = useToast();

  const [tipo, setTipo] = useState<TipoAditivo>("periodo");
  const [novaDataTermino, setNovaDataTermino] = useState("");
  const [percentual, setPercentual] = useState("");
  const [aplicarTodosItens, setAplicarTodosItens] = useState(false);
  const [percentuaisIndividuais, setPercentuaisIndividuais] = useState<
    Record<string, string>
  >({});
  const [itensContrato, setItensContrato] = useState<ItemContrato[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && tipo === "valor") {
      fetchItensContrato();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tipo]);

  const fetchItensContrato = async () => {
    try {
      const { data, error } = await supabase
        .from("itens")
        .select("id, descricao, valor_unitario, quantidade")
        .eq("contrato_id", contratoId);

      if (error) throw error;

      setItensContrato(data || []);

      const iniciais: Record<string, string> = {};
      (data || []).forEach((i) => (iniciais[i.id] = ""));
      setPercentuaisIndividuais(iniciais);
    } catch (error: any) {
      toast({
        title: "Erro ao buscar itens",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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
      if (aplicarTodosItens) {
        if (!percentual) {
          newErrors.percentual = "Percentual é obrigatório";
        } else {
          const n = parseFloat(percentual);
          if (isNaN(n) || n <= 0 || n > 25) {
            newErrors.percentual = "Percentual deve estar entre 0,01% e 25%";
          }
        }
      } else {
        const validos = Object.values(percentuaisIndividuais).filter(
          (p) => p && parseFloat(p) > 0 && parseFloat(p) <= 25
        );
        if (validos.length === 0) {
          newErrors.percentuaisIndividuais =
            "Informe pelo menos um percentual individual (máx. 25%)";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    if (tipo === "periodo") return !!novaDataTermino;
    if (tipo === "valor") {
      if (aplicarTodosItens) {
        const n = parseFloat(percentual);
        return !!percentual && !isNaN(n) && n > 0 && n <= 25;
      }
      const validos = Object.values(percentuaisIndividuais).filter(
        (p) => p && parseFloat(p) > 0 && parseFloat(p) <= 25
      );
      return validos.length > 0;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const aditivo: Partial<Aditivo> = {
        contrato_id: contratoId,
        tipo,
        aplicar_todos_itens: tipo === "valor" ? aplicarTodosItens : undefined,
      };

      if (tipo === "periodo") {
        aditivo.nova_data_termino = novaDataTermino;
      } else if (tipo === "valor") {
        if (aplicarTodosItens) {
          aditivo.percentual_itens = parseFloat(percentual);
        } else {
          const porItem: Record<string, number> = {};
          Object.entries(percentuaisIndividuais).forEach(([id, p]) => {
            if (p && parseFloat(p) > 0) porItem[id] = parseFloat(p);
          });
          aditivo.percentuais_por_item = porItem;
        }
      }

      const payload: Omit<Aditivo, "id" | "criado_em"> = {
        contrato_id: contratoId,
        tipo,
        ...aditivo,
      };

      await criarAditivo(payload);

      toast({
        title: "Sucesso!",
        description: "Aditivo criado com sucesso",
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao criar aditivo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setTipo("periodo");
    setNovaDataTermino("");
    setPercentual("");
    setAplicarTodosItens(false);
    setPercentuaisIndividuais({});
    setErrors({});
    onOpenChange(false);
  };

  const getTipoIcon = (t: TipoAditivo) =>
    t === "periodo" ? (
      <Calendar className="w-5 h-5" />
    ) : t === "valor" ? (
      <DollarSign className="w-5 h-5" />
    ) : null;

  const getTipoDescription = (t: TipoAditivo) =>
    t === "periodo"
      ? "Estende o prazo de vigência do contrato"
      : t === "valor"
      ? "Aumenta o valor dos itens do contrato (máximo 25%)"
      : "";

  const handlePercentualIndividualChange = (itemId: string, value: string) => {
    setPercentuaisIndividuais((prev) => ({ ...prev, [itemId]: value }));
    if (errors.percentuaisIndividuais) {
      setErrors((prev) => {
        const e = { ...prev };
        delete e.percentuaisIndividuais;
        return e;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTipoIcon(tipo)}
            Novo Aditivo
          </DialogTitle>
          <DialogDescription>{getTipoDescription(tipo)}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de aditivo */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Aditivo</Label>
            <Select
              value={tipo}
              onValueChange={(v) => setTipo(v as TipoAditivo)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um tipo de aditivo" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem value="periodo">📅 Aditivo de Período</SelectItem>
                <SelectItem value="valor">💰 Aditivo de Valor</SelectItem>
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
                min={new Date().toISOString().split("T")[0]}
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
            <div className="space-y-4">
              {/* Alternativa: todos os itens x individuais */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="aplicarTodosItens"
                  checked={aplicarTodosItens}
                  onCheckedChange={setAplicarTodosItens}
                />
                <Label htmlFor="aplicarTodosItens">
                  Aplicar percentual a todos os itens
                </Label>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded-md border">
                <p>
                  ⚠️ <strong>Escolha uma opção:</strong>
                </p>
                <p>• <strong>Ativado:</strong> aplica o mesmo percentual a todos</p>
                <p>• <strong>Desativado:</strong> define percentuais por item</p>
              </div>

              {aplicarTodosItens ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="percentual" className="text-base">
                      Percentual de Aumento
                    </Label>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      Máximo 25%
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="percentual"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="25"
                      placeholder="Ex: 15.50"
                      value={percentual}
                      onChange={(e) => setPercentual(e.target.value)}
                      className={errors.percentual ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  {errors.percentual && (
                    <p className="text-sm text-red-500">{errors.percentual}</p>
                  )}
                  <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-md border">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1 text-foreground">
                        Aplicação automática:
                      </p>
                      <p>
                        O percentual será aplicado a todos os itens do contrato,
                        ajustando valores unitários e totais.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Label>Percentuais Individuais por Item</Label>
                  <div className="space-y-3 max-h-60 overflow-y-auto border rounded-md p-4 bg-muted/20">
                    {itensContrato.map((item) => (
                      <div key={item.id} className="p-3 bg-background rounded-md border">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground mb-1">
                              {item.descricao}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Valor atual: R$ {item.valor_unitario.toFixed(2)} × {item.quantidade}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max="25"
                              placeholder="0.00"
                              value={percentuaisIndividuais[item.id] || ""}
                              onChange={(e) =>
                                handlePercentualIndividualChange(item.id, e.target.value)
                              }
                              className="w-20 text-center"
                            />
                            <span className="text-sm text-muted-foreground font-medium">%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.percentuaisIndividuais && (
                    <p className="text-sm text-red-500">
                      {errors.percentuaisIndividuais}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !isFormValid()}
              className={!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
            >
              {loading ? "Salvando..." : "Salvar Aditivo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AditivoFormDialog;
