import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRelatoriosData } from "@/hooks/relatorios/useRelatoriosData";
import { RelatoriosHeader } from "@/components/relatorios/RelatoriosHeader";
import { PeriodoSelector } from "@/components/relatorios/PeriodoSelector";
import { RelatoriosCards } from "@/components/relatorios/RelatoriosCards";
import { RelatoriosCharts } from "@/components/relatorios/RelatoriosCharts";
import { RelatoriosTables } from "@/components/relatorios/RelatoriosTables";
import { FornecedorRelatorioSelector } from "@/components/relatorios/FornecedorRelatorioSelector";
import { PeriodoRelatorioSelector } from "@/components/relatorios/PeriodoRelatorioSelector";
import { gerarRelatorioFornecedor } from "@/lib/pdf/gerarRelatorioFornecedor";
import { gerarRelatorioVigencia } from "@/lib/pdf/gerarRelatorioVigencia";
import { useFornecedores } from "@/hooks/fornecedores";
import { useContratos } from "@/hooks/useContratos";
import { useOrdens } from "@/hooks/useOrdens";
import { FileText, Clock, Download } from "lucide-react";
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

        // Estados para os novos relatórios
      const [fornecedorSelecionado, setFornecedorSelecionado] = useState("");
  const [periodoRelatorio, setPeriodoRelatorio] = useState("30d");
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  
  // Hooks para dados dos relatórios
  const { fornecedores, loading: loadingFornecedores, fetchFornecedores } = useFornecedores(true);
  const { contratos } = useContratos();
  const { ordens } = useOrdens();

  const [activeTab, setActiveTab] = useState("contratos");

  // Carregar fornecedores quando a página carregar
  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  

  // Funções para gerar relatórios
  const handleGerarRelatorioFornecedor = async () => {
          if (!fornecedorSelecionado) {
        alert("Selecione um fornecedor para gerar o relatório");
        return;
      }

    setGerandoRelatorio(true);
    try {
      const fornecedor = fornecedores.find(f => f.id === fornecedorSelecionado);
      if (!fornecedor) return;

      // Filtrar contratos e ordens do fornecedor
      const contratosFornecedor = contratos.filter(c => 
        c.fornecedores?.some(f => f.id === fornecedorSelecionado)
      );
      
      const ordensFornecedor = ordens.filter(o => 
        o.contrato?.fornecedorId === fornecedorSelecionado
      );



      const data = {
        fornecedor,
        contratos: contratosFornecedor,
        ordens: ordensFornecedor,
        periodo: periodoRelatorio
      };

      const doc = gerarRelatorioFornecedor(data);
      doc.save(`relatorio-fornecedor-${fornecedor.nome}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar o relatório');
    } finally {
      setGerandoRelatorio(false);
    }
  };

  const handleGerarRelatorioVigencia = async () => {
    setGerandoRelatorio(true);
    try {
      // Filtrar contratos próximos do vencimento (90 dias)
      const hoje = new Date();
      const contratosVigencia = contratos.filter(contrato => {
        const dataFim = new Date(contrato.data_fim);
        const diasRestantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        return diasRestantes <= 90 && diasRestantes > 0;
      });

      const data = {
        contratos: contratosVigencia,
        diasParaVencimento: 90
      };

      const doc = gerarRelatorioVigencia(data);
      doc.save(`relatorio-vigencia-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar o relatório');
    } finally {
      setGerandoRelatorio(false);
    }
  };

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
            <TabsTrigger value="pdf">Relatórios PDF</TabsTrigger>
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

          {/* Nova aba para Relatórios PDF */}
          <TabsContent value="pdf" className="space-y-6">
            {/* Relatório por Fornecedor */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Relatório por Fornecedor</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fornecedor:</label>
                  <FornecedorRelatorioSelector
                    value={fornecedorSelecionado}
                    onValueChange={setFornecedorSelecionado}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Período:</label>
                  <PeriodoRelatorioSelector
                    value={periodoRelatorio}
                    onValueChange={setPeriodoRelatorio}
                    className="w-full"
                  />
                </div>

                <div className="pt-4">
                                         <Button
                         onClick={handleGerarRelatorioFornecedor}
                         disabled={gerandoRelatorio || !fornecedorSelecionado}
                         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                       >
                         <FileText className="w-4 h-4" />
                         Gerar Relatório por Fornecedor
                         <Download className="w-4 h-4" />
                       </Button>
                       
                       {!fornecedorSelecionado && (
                         <p className="text-sm text-orange-600 mt-2">
                           ⚠️ Selecione um fornecedor para gerar o relatório
                         </p>
                       )}
                </div>
              </div>
            </div>

            {/* Relatório de Vigência */}
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">Relatório de Vigência</h3>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Contratos com vencimento em até 90 dias
                </p>
                
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    <strong>Legenda:</strong><br/>
                    • Até 30 dias: <span className="text-red-600">ATENÇÃO</span><br/>
                    • Até 60 dias: <span className="text-orange-600">MONITORAMENTO</span><br/>
                    • Até 90 dias: <span className="text-yellow-600">PREVENTIVO</span>
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleGerarRelatorioVigencia}
                    disabled={gerandoRelatorio}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Gerar Relatório de Vigência
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Relatorios;
