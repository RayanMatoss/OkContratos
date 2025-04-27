
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRelatoriosData } from "@/hooks/useRelatoriosData";
import { RelatoriosHeader } from "@/components/relatorios/RelatoriosHeader";
import { PeriodoSelector } from "@/components/relatorios/PeriodoSelector";
import { RelatoriosCards } from "@/components/relatorios/RelatoriosCards";
import { RelatoriosCharts } from "@/components/relatorios/RelatoriosCharts";
import { RelatoriosTables } from "@/components/relatorios/RelatoriosTables";

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
    ultimoRelatorio
  } = useRelatoriosData();

  const [activeTab, setActiveTab] = useState("contratos");

  return (
    <div className="space-y-6 animate-fade-in">
      <RelatoriosHeader>
        <PeriodoSelector 
          value={periodoSelecionado} 
          onValueChange={setPeriodoSelecionado}
        />
      </RelatoriosHeader>

      <RelatoriosCards ultimoRelatorio={ultimoRelatorio} />

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
    </div>
  );
};

export default Relatorios;
