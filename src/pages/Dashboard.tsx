import { Loader } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTestView } from "@/hooks/useTestView"; // Hook temporário para teste
import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardCards from "@/components/dashboard/DashboardCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentContracts from "@/components/dashboard/RecentContracts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { data, loading } = useDashboardData();
  const { viewData, loading: loadingView } = useTestView(); // Hook temporário para teste
  const { user, fundosSelecionados } = useAuth();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openContratosModal, setOpenContratosModal] = useState(false);
  const [openContratosVencerModal, setOpenContratosVencerModal] = useState(false);
  const [openFornecedoresModal, setOpenFornecedoresModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Definir a variável local contratosAVencer corretamente
  const contratosAVencer = (data.contratosRecentes || []).filter((contrato: any) => {
    if (!contrato.data_termino) return false;
    const dataTermino = new Date(contrato.data_termino);
    const now = new Date();
    const diffDays = Math.ceil((dataTermino.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 30 && diffDays > 0;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader />
      
      <DashboardCards
        totalContratos={data.totalContratos}
        contratosAVencer={data.contratosAVencer}
        totalFornecedores={data.totalFornecedores}
        itensAlerta={data.itensAlerta.length}
        onAlertClick={() => { console.log('Alerta'); setOpenAlertModal(true); }}
        onContratosClick={() => { console.log('Contratos'); setOpenContratosModal(true); }}
        onContratosVencerClick={() => { console.log('Contratos a Vencer'); setOpenContratosVencerModal(true); }}
        onFornecedoresClick={() => { console.log('Fornecedores'); setOpenFornecedoresModal(true); }}
      />

      <DashboardCharts
        statusContratosData={data.statusContratosData}
        ordensData={data.ordensData}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentContracts contratos={data.contratosRecentes} />
      </div>

      {/* Modal de Itens em Alerta */}
      <Dialog open={openAlertModal} onOpenChange={setOpenAlertModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Itens em Alerta</DialogTitle>
            <DialogDescription>
              Itens com consumo acima de 90% da quantidade total.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Descrição</th>
                  <th className="px-2 py-1 text-left">Contrato</th>
                  <th className="px-2 py-1 text-left">Fornecedor</th>
                  <th className="px-2 py-1 text-right">Qtd. Total</th>
                  <th className="px-2 py-1 text-right">Consumido</th>
                  <th className="px-2 py-1 text-right">% Consumido</th>
                </tr>
              </thead>
              <tbody>
                {data.itensAlerta.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted-foreground">
                      Nenhum item em alerta.
                    </td>
                  </tr>
                ) : (
                  data.itensAlerta.map((item: any) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="px-2 py-1 font-medium">{item.descricao}</td>
                      <td className="px-2 py-1">{item.contrato?.numero || '-'}</td>
                      <td className="px-2 py-1">{item.contrato?.fornecedores?.[0]?.nome || '-'}</td>
                      <td className="px-2 py-1 text-right">{item.quantidade.toLocaleString('pt-BR')}</td>
                      <td className="px-2 py-1 text-right">{item.quantidade_consumida.toLocaleString('pt-BR')}</td>
                      <td className="px-2 py-1 text-right font-medium text-red-600">
                        {item.percentual_consumido.toFixed(1)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Total de Contratos */}
      <Dialog open={openContratosModal} onOpenChange={setOpenContratosModal}>
        <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Todos os Contratos</DialogTitle>
            <DialogDescription>Lista de todos os contratos registrados.</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left w-32">Número</th>
                  <th className="px-3 py-2 text-left w-48">Fornecedor</th>
                  <th className="px-3 py-2 text-left w-20">Status</th>
                  <th className="px-3 py-2 text-left w-28">Data Início</th>
                  <th className="px-3 py-2 text-left w-28">Data Término</th>
                  <th className="px-3 py-2 text-left flex-1">Objeto</th>
                  <th className="px-3 py-2 text-right w-24">Valor</th>
                </tr>
              </thead>
              <tbody>
                {data.contratosRecentes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted-foreground">
                      Nenhum contrato encontrado.
                    </td>
                  </tr>
                ) : (
                  data.contratosRecentes.map((contrato: any) => (
                    <tr key={contrato.id} className="border-b last:border-0">
                      <td className="px-3 py-2 font-medium">{contrato.numero}</td>
                      <td className="px-3 py-2 max-w-44 truncate" title={contrato.fornecedor?.nome || '-'}>
                        {contrato.fornecedor?.nome || '-'}
                      </td>
                      <td className="px-3 py-2">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          contrato.status === 'Ativo' ? "bg-green-100 text-green-800" :
                          contrato.status === 'Expirado' ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        )}>
                          {contrato.status || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-2">{contrato.data_inicio ? new Date(contrato.data_inicio).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="px-3 py-2">{contrato.data_termino ? new Date(contrato.data_termino).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="px-3 py-2 max-w-80 truncate" title={contrato.objeto}>{contrato.objeto}</td>
                      <td className="px-3 py-2 text-right font-medium">{contrato.valor ? formatCurrency(contrato.valor) : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Contratos a Vencer */}
      <Dialog open={openContratosVencerModal} onOpenChange={setOpenContratosVencerModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contratos a Vencer</DialogTitle>
            <DialogDescription>Contratos que vencem nos próximos 30 dias.</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Número</th>
                  <th className="px-2 py-1 text-left">Fornecedor</th>
                  <th className="px-2 py-1 text-left">Data de Término</th>
                </tr>
              </thead>
              <tbody>
                {contratosAVencer.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-muted-foreground">
                      Nenhum contrato a vencer.
                    </td>
                  </tr>
                ) : (
                  contratosAVencer.map((contrato: any) => (
                    <tr key={contrato.id} className="border-b last:border-0">
                      <td className="px-2 py-1 font-medium">{contrato.numero}</td>
                      <td className="px-2 py-1">{contrato.fornecedor?.nome || '-'}</td>
                      <td className="px-2 py-1">{contrato.data_termino ? new Date(contrato.data_termino).toLocaleDateString('pt-BR') : '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Fornecedores */}
      <Dialog open={openFornecedoresModal} onOpenChange={setOpenFornecedoresModal}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fornecedores</DialogTitle>
            <DialogDescription>Lista de fornecedores registrados.</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left w-64">Nome</th>
                  <th className="px-3 py-2 text-left w-40">CNPJ/CPF</th>
                  <th className="px-3 py-2 text-left w-64">E-mail</th>
                  <th className="px-3 py-2 text-left w-32">Telefone</th>
                </tr>
              </thead>
              <tbody>
                {data.fornecedores.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted-foreground">
                      Nenhum fornecedor encontrado.
                    </td>
                  </tr>
                ) : (
                  data.fornecedores.map((fornecedor: any, idx: number) => (
                    <tr key={fornecedor.id || `fornecedor-${idx}-${fornecedor.nome}`} className="border-b last:border-0">
                      <td className="px-3 py-2 font-medium max-w-60 truncate" title={fornecedor.nome || '-'}>
                        {fornecedor.nome || '-'}
                      </td>
                      <td className="px-3 py-2 font-mono text-sm">{fornecedor.cnpj || '-'}</td>
                      <td className="px-3 py-2 max-w-60 truncate" title={fornecedor.email || '-'}>
                        {fornecedor.email || '-'}
                      </td>
                      <td className="px-3 py-2">{fornecedor.telefone || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
