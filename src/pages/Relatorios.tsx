
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartContainer from "@/components/ChartContainer";
import BarChartComponent from "@/components/BarChartComponent";
import StatisticsDonut from "@/components/StatisticsDonut";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { relatorios } from "@/data/mockData";

const Relatorios = () => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("6");
  
  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                 "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Filtra relatórios baseado no período selecionado
  const relatoriosFiltrados = relatorios
    .slice(0, parseInt(periodoSelecionado))
    .sort((a, b) => {
      if (a.ano !== b.ano) return a.ano - b.ano;
      return a.mes - b.mes;
    });

  // Dados para gráficos
  const contratosData = relatoriosFiltrados.map(r => ({
    name: `${meses[r.mes-1].substring(0, 3)}/${r.ano.toString().substring(2)}`,
    value: r.totalContratos,
    ativos: r.contratosAtivos,
    vencidos: r.contratosVencidos,
  }));

  const ordensData = relatoriosFiltrados.map(r => ({
    name: `${meses[r.mes-1].substring(0, 3)}/${r.ano.toString().substring(2)}`,
    total: r.ordensRealizadas,
    pendentes: r.ordensPendentes,
    concluidas: r.ordensConcluidas,
  }));

  const financeiroData = relatoriosFiltrados.map(r => ({
    name: `${meses[r.mes-1].substring(0, 3)}/${r.ano.toString().substring(2)}`,
    contratos: r.valorTotalContratos / 1000, // em milhares
    ordens: r.valorTotalOrdens / 1000, // em milhares
  }));

  // Dados de resumo
  const ultimoRelatorio = relatoriosFiltrados[0] || {
    totalContratos: 0,
    contratosVencidos: 0,
    contratosAtivos: 0,
    ordensRealizadas: 0,
    ordensPendentes: 0,
    ordensConcluidas: 0,
    valorTotalContratos: 0,
    valorTotalOrdens: 0,
  };

  const statusContratosData = [
    { 
      name: "Ativos", 
      value: ultimoRelatorio.contratosAtivos, 
      color: "#10B981" 
    },
    { 
      name: "Vencidos", 
      value: ultimoRelatorio.contratosVencidos, 
      color: "#EF4444"
    }
  ];

  const statusOrdensData = [
    { 
      name: "Concluídas", 
      value: ultimoRelatorio.ordensConcluidas, 
      color: "#10B981" 
    },
    { 
      name: "Pendentes", 
      value: ultimoRelatorio.ordensPendentes, 
      color: "#F59E0B"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise e visualização dos dados do sistema
          </p>
        </div>
        <div className="w-48">
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Últimos 3 meses</SelectItem>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
              <SelectItem value="12">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total de Contratos</CardTitle>
            <CardDescription>No período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ultimoRelatorio.totalContratos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {ultimoRelatorio.contratosAtivos} ativos | {ultimoRelatorio.contratosVencidos} vencidos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Ordens Realizadas</CardTitle>
            <CardDescription>No período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{ultimoRelatorio.ordensRealizadas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {ultimoRelatorio.ordensConcluidas} concluídas | {ultimoRelatorio.ordensPendentes} pendentes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Valor Total</CardTitle>
            <CardDescription>Contratos no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(ultimoRelatorio.valorTotalContratos)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ordens: {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(ultimoRelatorio.valorTotalOrdens)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contratos">
        <TabsList>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="ordens">Ordens</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contratos" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Evolução de Contratos">
              <BarChartComponent
                data={contratosData}
                xAxisKey="name"
                barKey="value"
                barName="Contratos"
                barColor="#3B82F6"
              />
            </ChartContainer>
            
            <ChartContainer title="Status dos Contratos">
              <StatisticsDonut data={statusContratosData} />
            </ChartContainer>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Total Contratos</TableHead>
                  <TableHead>Ativos</TableHead>
                  <TableHead>Vencidos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatoriosFiltrados.map((relatorio, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {format(new Date(relatorio.ano, relatorio.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>{relatorio.totalContratos}</TableCell>
                    <TableCell>{relatorio.contratosAtivos}</TableCell>
                    <TableCell>{relatorio.contratosVencidos}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="ordens" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Ordens de Fornecimento">
              <BarChartComponent
                data={ordensData}
                xAxisKey="name"
                barKey="total"
                barName="Ordens"
                barColor="#F59E0B"
              />
            </ChartContainer>
            
            <ChartContainer title="Status das Ordens">
              <StatisticsDonut data={statusOrdensData} />
            </ChartContainer>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Total Ordens</TableHead>
                  <TableHead>Concluídas</TableHead>
                  <TableHead>Pendentes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatoriosFiltrados.map((relatorio, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {format(new Date(relatorio.ano, relatorio.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>{relatorio.ordensRealizadas}</TableCell>
                    <TableCell>{relatorio.ordensConcluidas}</TableCell>
                    <TableCell>{relatorio.ordensPendentes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="financeiro" className="space-y-6">
          <ChartContainer title="Valores (em milhares de R$)">
            <BarChartComponent
              data={financeiroData}
              xAxisKey="name"
              barKey="contratos"
              barName="Contratos"
              barColor="#3B82F6"
            />
          </ChartContainer>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Valor Total Contratos</TableHead>
                  <TableHead>Valor Total Ordens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatoriosFiltrados.map((relatorio, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {format(new Date(relatorio.ano, relatorio.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(relatorio.valorTotalContratos)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(relatorio.valorTotalOrdens)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
