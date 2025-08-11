import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRelatoriosData } from "@/hooks/relatorios/useRelatoriosData";
import { RelatoriosHeader } from "@/components/relatorios/RelatoriosHeader";
import { PeriodoSelector } from "@/components/relatorios/PeriodoSelector";
import { RelatoriosCards } from "@/components/relatorios/RelatoriosCards";
import { RelatoriosCharts } from "@/components/relatorios/RelatoriosCharts";
import { RelatoriosTables } from "@/components/relatorios/RelatoriosTables";
import { Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Relatorios = () => {
  const {
    periodoSelecionado,
    setPeriodoSelecionado,
    relatoriosFiltrados,
    contratosData,
    ordensData,
    financeiroData,
    statusContratosData,
    statusOrdensData,
    ultimoRelatorio,
    loading,
    error
  } = useRelatoriosData();

  const [activeTab, setActiveTab] = useState("contratos");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertDescription>
          Erro ao carregar os relatórios: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <RelatoriosHeader>
        <PeriodoSelector 
          value={periodoSelecionado} 
          onValueChange={setPeriodoSelecionado}
        />
      </RelatoriosHeader>

      <RelatoriosCards ultimoRelatorio={ultimoRelatorio} relatoriosFiltrados={relatoriosFiltrados} />

      {relatoriosFiltrados.length === 0 ? (
        <Alert className="my-6">
          <AlertDescription>
            Nenhum dado encontrado para o período selecionado.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="contratos" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="contratos">Contratos</TabsTrigger>
            <TabsTrigger value="ordens">Ordens</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contratos" className="space-y-6">
            <RelatoriosCharts
              activeTab={activeTab}
              contratosData={contratosData}
              ordensData={ordensData}
              financeiroData={financeiroData}
              statusContratosData={statusContratosData}
              statusOrdensData={statusOrdensData}
            />
            <RelatoriosTables
              relatoriosFiltrados={relatoriosFiltrados}
              activeTab={activeTab}
            />
          </TabsContent>
          
          <TabsContent value="ordens" className="space-y-6">
            <RelatoriosCharts
              activeTab={activeTab}
              contratosData={contratosData}
              ordensData={ordensData}
              financeiroData={financeiroData}
              statusContratosData={statusContratosData}
              statusOrdensData={statusOrdensData}
            />
            <RelatoriosTables
              relatoriosFiltrados={relatoriosFiltrados}
              activeTab={activeTab}
            />
          </TabsContent>
          
          <TabsContent value="financeiro" className="space-y-6">
            <RelatoriosCharts
              activeTab={activeTab}
              contratosData={contratosData}
              ordensData={ordensData}
              financeiroData={financeiroData}
              statusContratosData={statusContratosData}
              statusOrdensData={statusOrdensData}
            />
            <RelatoriosTables
              relatoriosFiltrados={relatoriosFiltrados}
              activeTab={activeTab}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Relatorios;
