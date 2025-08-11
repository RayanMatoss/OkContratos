import { useState, useEffect } from "react";
import { useAditivos } from "@/hooks/useAditivos";
import { Button } from "@/components/ui/button";
import { Aditivo } from "@/types";
import AditivoFormDialog from "./AditivoFormDialog";
import { Trash2, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AditivosTabProps {
  contratoId: string;
  onAditivoCriado?: () => void;
}

const AditivosTab = ({ contratoId, onAditivoCriado }: AditivosTabProps) => {
  const { aditivos, loading, fetchAditivos, deletarAditivo } = useAditivos(contratoId);
  const [openForm, setOpenForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAditivos();
    // eslint-disable-next-line
  }, [contratoId]);

  const handleAditivoCriado = () => {
    fetchAditivos();
    setOpenForm(false);
    if (onAditivoCriado) onAditivoCriado();
  };

  const handleDeletarAditivo = async (aditivoId: string) => {
    if (confirm("Tem certeza que deseja remover este aditivo?")) {
      const success = await deletarAditivo(aditivoId);
      if (success && onAditivoCriado) {
        onAditivoCriado();
      }
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "periodo":
        return <Calendar className="w-4 h-4" />;
      case "valor":
        return <DollarSign className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "periodo":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Período</Badge>;
      case "valor":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Valor</Badge>;
      default:
        return <Badge variant="outline">{tipo}</Badge>;
    }
  };

  const getAditivoDescription = (aditivo: Aditivo) => {
    switch (aditivo.tipo) {
      case "periodo":
        return `Nova data de término: ${new Date(aditivo.nova_data_termino!).toLocaleDateString('pt-BR')}`;
      case "valor":
        if (aditivo.aplicar_todos_itens && aditivo.percentual_itens) {
          return `Aumento de ${aditivo.percentual_itens}% em todos os itens`;
        } else if (aditivo.percentuais_por_item) {
          const totalPercentual = Object.values(aditivo.percentuais_por_item).reduce((sum, perc) => sum + perc, 0);
          return `Aumento individual: ${totalPercentual.toFixed(2)}% total`;
        }
        return "Aumento de valor";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Aditivos</h2>
        <Button onClick={() => setOpenForm(true)}>Novo Aditivo</Button>
      </div>
      
      <AditivoFormDialog
        contratoId={contratoId}
        open={openForm}
        onOpenChange={setOpenForm}
        onSuccess={handleAditivoCriado}
      />
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando aditivos...</p>
          </div>
        ) : aditivos.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum aditivo cadastrado.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique em "Novo Aditivo" para criar o primeiro aditivo.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {aditivos.map((aditivo: Aditivo) => (
              <div key={aditivo.id} className="border rounded-lg p-4 bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTipoIcon(aditivo.tipo)}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getTipoBadge(aditivo.tipo)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(aditivo.criado_em).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {getAditivoDescription(aditivo)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletarAditivo(aditivo.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AditivosTab; 