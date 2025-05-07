import { useState, useEffect } from "react";
import { useAditivos } from "@/hooks/useAditivos";
import { Button } from "@/components/ui/button";
import { Aditivo } from "@/types";
import AditivoFormDialog from "./AditivoFormDialog";

interface AditivosTabProps {
  contratoId: string;
  onAditivoCriado?: () => void;
}

const AditivosTab = ({ contratoId, onAditivoCriado }: AditivosTabProps) => {
  const { aditivos, loading, fetchAditivos } = useAditivos(contratoId);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    fetchAditivos();
    // eslint-disable-next-line
  }, [contratoId]);

  const handleAditivoCriado = () => {
    fetchAditivos();
    setOpenForm(false);
    if (onAditivoCriado) onAditivoCriado();
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
        <table className="min-w-full text-sm border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Tipo</th>
              <th className="border px-2 py-1">Nova Vigência</th>
              <th className="border px-2 py-1">% Itens</th>
              <th className="border px-2 py-1">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center">Carregando...</td></tr>
            ) : aditivos.length === 0 ? (
              <tr><td colSpan={4} className="text-center">Nenhum aditivo cadastrado.</td></tr>
            ) : (
              aditivos.map((aditivo: Aditivo) => (
                <tr key={aditivo.id}>
                  <td className="border px-2 py-1">{aditivo.tipo === "periodo" ? "Período" : "Valor"}</td>
                  <td className="border px-2 py-1">{aditivo.nova_data_termino || "-"}</td>
                  <td className="border px-2 py-1">{aditivo.percentual_itens ? `${aditivo.percentual_itens}%` : "-"}</td>
                  <td className="border px-2 py-1">{new Date(aditivo.criado_em).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AditivosTab; 