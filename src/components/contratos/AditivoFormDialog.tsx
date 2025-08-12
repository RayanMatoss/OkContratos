import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, DollarSign, Percent, Info } from "lucide-react";
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

const AditivoFormDialog = ({ contratoId, open, onOpenChange, onSuccess }: AditivoFormDialogProps) => {
  const { criarAditivo, loading } = useAditivos(contratoId);
  const { toast } = useToast();
  const [tipo, setTipo] = useState<TipoAditivo>("periodo");
  const [novaDataTermino, setNovaDataTermino] = useState("");
  const [percentual, setPercentual] = useState("");
  const [aplicarTodosItens, setAplicarTodosItens] = useState(false); // CORREÇÃO: Desabilitado por padrão
  const [percentuaisIndividuais, setPercentuaisIndividuais] = useState<{ [key: string]: string }>({});
  const [itensContrato, setItensContrato] = useState<ItemContrato[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Debug: logar mudanças no tipo
  useEffect(() => {
    console.log('Tipo de aditivo mudou para:', tipo);
  }, [tipo]);

  // Buscar itens do contrato quando o modal abrir
  useEffect(() => {
    if (open && tipo === "valor") {
      fetchItensContrato();
    }
  }, [open, tipo]);

  const fetchItensContrato = async () => {
    try {
      const { data, error } = await supabase
        .from("itens")
        .select("id, descricao, valor_unitario, quantidade")
        .eq("contrato_id", contratoId);

      if (error) throw error;
      
      setItensContrato(data || []);
      
      // Inicializar percentuais individuais
      const percentuaisIniciais: { [key: string]: string } = {};
      data?.forEach(item => {
        percentuaisIniciais[item.id] = "";
      });
      setPercentuaisIndividuais(percentuaisIniciais);
    } catch (error: any) {
      toast({
        title: "Erro ao buscar itens",
        description: error.message,
        variant: "destructive"
      });
    }
  };

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
      // CORREÇÃO: Forçar escolha explícita entre aplicar a todos ou percentuais individuais
      if (aplicarTodosItens) {
        if (!percentual) {
          newErrors.percentual = "Percentual é obrigatório";
        } else {
          const percentualNum = parseFloat(percentual);
          if (isNaN(percentualNum) || percentualNum <= 0 || percentualNum > 25) {
            newErrors.percentual = "Percentual deve estar entre 0.01% e 25%";
          }
        }
      } else {
        // Validar percentuais individuais
        const percentuaisValidos = Object.values(percentuaisIndividuais).filter(p => p && parseFloat(p) > 0);
        if (percentuaisValidos.length === 0) {
          newErrors.percentuaisIndividuais = "Pelo menos um percentual individual deve ser informado";
        } else {
          // Verificar se todos estão dentro do limite
          for (const [itemId, percentual] of Object.entries(percentuaisIndividuais)) {
            if (percentual) {
              const percentualNum = parseFloat(percentual);
              if (percentualNum > 25) {
                newErrors.percentuaisIndividuais = `Percentual do item não pode exceder 25%`;
                break;
              }
            }
          }
        }
      }
      
      // CORREÇÃO: Adicionar validação para garantir que uma opção foi escolhida
      if (!aplicarTodosItens && Object.values(percentuaisIndividuais).filter(p => p && parseFloat(p) > 0).length === 0) {
        newErrors.percentuaisIndividuais = "Escolha entre aplicar percentual a todos os itens ou definir percentuais individuais";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // CORREÇÃO: Função para verificar se o formulário é válido (sem executar validação completa)
  const isFormValid = () => {
    if (tipo === "periodo") {
      return !!novaDataTermino;
    }
    
    if (tipo === "valor") {
      if (aplicarTodosItens) {
        return !!percentual && parseFloat(percentual) > 0 && parseFloat(percentual) <= 25;
      } else {
        const percentuaisValidos = Object.values(percentuaisIndividuais).filter(p => p && parseFloat(p) > 0 && parseFloat(p) <= 25);
        return percentuaisValidos.length > 0;
      }
    }
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

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
          // Converter percentuais para números
          const percentuaisNumericos: { [itemId: string]: number } = {};
          Object.entries(percentuaisIndividuais).forEach(([itemId, perc]) => {
            if (perc && parseFloat(perc) > 0) {
              percentuaisNumericos[itemId] = parseFloat(perc);
            }
          });
          aditivo.percentuais_por_item = percentuaisNumericos;
        }
      }

      // Garantir que contrato_id seja obrigatório
      const aditivoCompleto: Omit<Aditivo, "id" | "criado_em"> = {
        contrato_id: contratoId,
        tipo,
        ...aditivo
      };

      await criarAditivo(aditivoCompleto);
      
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
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setTipo("periodo");
    setNovaDataTermino("");
    setPercentual("");
    setAplicarTodosItens(true);
    setPercentuaisIndividuais({});
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
        return "Aumenta o valor dos itens do contrato (máximo 25%)";
      default:
        return "";
    }
  };

  const handlePercentualIndividualChange = (itemId: string, value: string) => {
    setPercentuaisIndividuais(prev => ({
      ...prev,
      [itemId]: value
    }));
    
    // Limpar erro se existir
    if (errors.percentuaisIndividuais) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.percentuaisIndividuais;
        return newErrors;
      });
    }
  };

  // Debug: verificar se o componente está renderizando
  console.log('AditivoFormDialog renderizando com tipo:', tipo, 'open:', open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTipoIcon(tipo)}
            Novo Aditivo
          </DialogTitle>
          <DialogDescription>
            {getTipoDescription(tipo)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Aditivo */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Aditivo</Label>
            <div className="relative">
              <Select 
                value={tipo} 
                onValueChange={(value) => {
                  const tipoAditivo = value as TipoAditivo;
                  console.log('Tipo selecionado (Shadcn Select):', tipoAditivo);
                  setTipo(tipoAditivo);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tipo de aditivo" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  <SelectItem value="periodo">📅 Aditivo de Período</SelectItem>
                  <SelectItem value="valor">💰 Aditivo de Valor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campos específicos por tipo */}
          {tipo === "periodo" && (
            <div className="space-y-2">
              <Label htmlFor="novaDataTermino">Nova Data de Vigência</Label>
              <Input
                id="novaDataTermino"
                type="date"
                value={novaDataTermino}
                onChange={(e) => setNovaDataTermino(e.target.value)}
                className={errors.novaDataTermino ? "border-red-500" : ""}
              />
              {errors.novaDataTermino && (
                <p className="text-sm text-red-500">{errors.novaDataTermino}</p>
              )}
            </div>
          )}

          {tipo === "valor" && (
            <div className="space-y-4">
              {/* Opção de aplicar a todos ou individualmente */}
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
              
              {/* CORREÇÃO: Texto explicativo para orientar o usuário */}
              <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded-md border">
                <p>⚠️ <strong>Escolha uma opção:</strong></p>
                <p>• <strong>Ativado:</strong> Aplica o mesmo percentual a todos os itens</p>
                <p>• <strong>Desativado:</strong> Define percentuais diferentes para cada item</p>
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
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  {errors.percentual && (
                    <p className="text-sm text-red-500">{errors.percentual}</p>
                  )}
                  <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-md border">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1 text-foreground">Aplicação automática:</p>
                      <p>O percentual será aplicado automaticamente a todos os itens do contrato, atualizando os valores unitários e o valor total.</p>
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
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max="25"
                              placeholder="0.00"
                              value={percentuaisIndividuais[item.id] || ""}
                              onChange={(e) => handlePercentualIndividualChange(item.id, e.target.value)}
                              className="w-20 text-center"
                            />
                            <span className="text-sm text-muted-foreground font-medium">%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.percentuaisIndividuais && (
                    <p className="text-sm text-red-500">{errors.percentuaisIndividuais}</p>
                  )}
                  <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-md border">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1 text-foreground">Como funciona:</p>
                      <ul className="space-y-1">
                        <li>• Defina percentuais individuais para cada item</li>
                        <li>• Máximo de 25% por item individual</li>
                        <li>• O sistema calculará automaticamente os novos valores</li>
                      </ul>
                    </div>
                  </div>
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