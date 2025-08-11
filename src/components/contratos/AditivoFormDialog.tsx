<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
=======
import { useState } from "react";
import { useAditivos } from "@/hooks/useAditivos";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
<<<<<<< HEAD
import { Switch } from "@/components/ui/switch";
import { Calendar, DollarSign, Percent, Info } from "lucide-react";
import { useAditivos } from "@/hooks/useAditivos";
import { useToast } from "@/hooks/use-toast";
import { TipoAditivo, Aditivo } from "@/types";
import { supabase } from "@/integrations/supabase/client";
=======
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TipoAditivo } from "@/types";
import { Calendar, DollarSign, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

interface AditivoFormDialogProps {
  contratoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

<<<<<<< HEAD
interface ItemContrato {
  id: string;
  descricao: string;
  valor_unitario: number;
  quantidade: number;
}

=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
const AditivoFormDialog = ({ contratoId, open, onOpenChange, onSuccess }: AditivoFormDialogProps) => {
  const { criarAditivo, loading } = useAditivos(contratoId);
  const { toast } = useToast();
  const [tipo, setTipo] = useState<TipoAditivo>("periodo");
  const [novaDataTermino, setNovaDataTermino] = useState("");
  const [percentual, setPercentual] = useState("");
<<<<<<< HEAD
  const [aplicarTodosItens, setAplicarTodosItens] = useState(true);
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

=======
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
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
=======
      if (!percentual) {
        newErrors.percentual = "Percentual é obrigatório";
      } else {
        const percentualNum = parseFloat(percentual);
        if (isNaN(percentualNum) || percentualNum <= 0 || percentualNum > 100) {
          newErrors.percentual = "Percentual deve estar entre 0.01 e 100";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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

<<<<<<< HEAD
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
=======
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
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
    }
  };

  const handleCancel = () => {
<<<<<<< HEAD
    setTipo("periodo");
    setNovaDataTermino("");
    setPercentual("");
    setAplicarTodosItens(true);
    setPercentuaisIndividuais({});
=======
    setNovaDataTermino("");
    setPercentual("");
    setTipo("periodo");
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
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
<<<<<<< HEAD
        return "Aumenta o valor dos itens do contrato (máximo 25%)";
=======
        return "Aumenta o valor dos itens do contrato por percentual";
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
      default:
        return "";
    }
  };

<<<<<<< HEAD
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
=======
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTipoIcon(tipo)}
            Novo Aditivo
          </DialogTitle>
<<<<<<< HEAD
          <DialogDescription>
            {getTipoDescription(tipo)}
          </DialogDescription>
        </DialogHeader>

=======
        </DialogHeader>
        
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Aditivo */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Aditivo</Label>
<<<<<<< HEAD
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
=======
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
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
          {tipo === "periodo" && (
            <div className="space-y-2">
              <Label htmlFor="novaDataTermino">Nova Data de Vigência</Label>
              <Input
                id="novaDataTermino"
                type="date"
                value={novaDataTermino}
                onChange={(e) => setNovaDataTermino(e.target.value)}
                className={errors.novaDataTermino ? "border-red-500" : ""}
<<<<<<< HEAD
              />
              {errors.novaDataTermino && (
                <p className="text-sm text-red-500">{errors.novaDataTermino}</p>
=======
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.novaDataTermino && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.novaDataTermino}
                </div>
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
              )}
            </div>
          )}

          {tipo === "valor" && (
<<<<<<< HEAD
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
=======
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
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Aditivo"}
            </Button>
<<<<<<< HEAD
          </div>
=======
          </DialogFooter>
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AditivoFormDialog; 