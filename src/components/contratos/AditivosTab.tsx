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
    console.log('AditivosTab: Carregando aditivos para contrato:', contratoId);
    fetchAditivos();
    // eslint-disable-next-line
  }, [contratoId]);

  const handleAditivoCriado = () => {
    console.log('AditivosTab: Aditivo criado, recarregando lista...');
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

  // Debug: logar estado atual
  useEffect(() => {
    console.log('AditivosTab: Estado atual:', {
      contratoId,
      aditivosCount: aditivos.length,
      aditivos,
      loading,
      openForm
    });
  }, [contratoId, aditivos, loading, openForm]);

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
      
      {/* Debug: Mostrar informações de debug */}
      <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
        <p>Contrato ID: {contratoId}</p>
        <p>Aditivos encontrados: {aditivos.length}</p>
        <p>Status: {loading ? 'Carregando...' : 'Pronto'}</p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p>Carregando aditivos...</p>
        </div>
      ) : aditivos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum aditivo encontrado para este contrato.</p>
          <p className="text-sm">Clique em "Novo Aditivo" para criar o primeiro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {aditivos.map((aditivo) => (
            <div key={aditivo.id} className="p-4 border rounded-lg bg-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTipoIcon(aditivo.tipo)}
                    {getTipoBadge(aditivo.tipo)}
                    <span className="text-sm text-muted-foreground">
                      {new Date(aditivo.criado_em).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {getAditivoDescription(aditivo)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {aditivo.id}
                  </p>
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
  );
};

export default AditivosTab; 