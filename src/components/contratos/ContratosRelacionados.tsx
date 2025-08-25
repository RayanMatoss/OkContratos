import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContratoRelacionado {
  id: string;
  numero: string;
  sufixo: string;
  numero_completo: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  valor: number;
  status: string;
}

interface ContratosRelacionadosProps {
  contratoId: string;
  onViewContrato?: (contratoId: string) => void;
}

const ContratosRelacionados: React.FC<ContratosRelacionadosProps> = ({ 
  contratoId, 
  onViewContrato 
}) => {
  const [contratosRelacionados, setContratosRelacionados] = useState<ContratoRelacionado[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContratosRelacionados = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .rpc('obter_contratos_relacionados', {
            p_contrato_id: contratoId
          });

        if (error) {
          console.error('Erro na função RPC:', error);
          // Se a função RPC falhar, tentar buscar contratos básicos
          const { data: contratosBasicos, error: errorBasico } = await supabase
            .from('contratos')
            .select('id, numero, valor, status, fornecedor_id')
            .eq('numero', contratoId.split('/')[0]) // Tentar buscar por número base
            .neq('id', contratoId); // Excluir o contrato atual

          if (errorBasico) {
            console.error('Erro ao buscar contratos básicos:', errorBasico);
            setContratosRelacionados([]);
          } else {
            // Mapear para o formato esperado
            const contratosMapeados = contratosBasicos?.map(c => ({
              id: c.id,
              numero: c.numero,
              sufixo: '1',
              numero_completo: c.numero,
              fornecedor_id: c.fornecedor_id,
              fornecedor_nome: 'Fornecedor',
              valor: c.valor,
              status: c.status
            })) || [];
            setContratosRelacionados(contratosMapeados);
          }
        } else {
          setContratosRelacionados(data || []);
        }
      } catch (error) {
        console.error('Erro ao buscar contratos relacionados:', error);
        setContratosRelacionados([]);
      } finally {
        setLoading(false);
      }
    };

    if (contratoId) {
      fetchContratosRelacionados();
    }
  }, [contratoId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contratos Relacionados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  if (contratosRelacionados.length <= 1) {
    return null; // Não mostrar se não há contratos relacionados
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ExternalLink size={20} />
          Contratos Relacionados
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Contratos com a mesma numeração base mas fornecedores diferentes
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contratosRelacionados.map((contrato) => (
            <div
              key={contrato.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="font-mono">
                    {contrato.numero_completo}
                  </Badge>
                  <Badge variant={contrato.status === 'ativo' ? 'default' : 'secondary'}>
                    {contrato.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Fornecedor:</span> {contrato.fornecedor_nome}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Valor:</span> {contrato.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewContrato?.(contrato.id)}
                className="ml-4"
              >
                <Eye size={16} className="mr-2" />
                Ver
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContratosRelacionados; 