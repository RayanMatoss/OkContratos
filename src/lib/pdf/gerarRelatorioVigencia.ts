import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Contrato } from '@/types';

interface RelatorioVigenciaData {
  contratos: Contrato[];
  diasParaVencimento: number;
}

export const gerarRelatorioVigencia = (data: RelatorioVigenciaData) => {
  const doc = new jsPDF();
  
  // Configurações do documento
  doc.setFontSize(20);
  doc.text('RELATÓRIO DE VIGÊNCIA', 105, 20, { align: 'center' });
  
  // Descrição do relatório
  doc.setFontSize(12);
  doc.text(`Contratos com vencimento em até ${data.diasParaVencimento} dias`, 105, 35, { align: 'center' });
  
  // Data de geração
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 50);
  
  // Resumo
  doc.setFontSize(14);
  doc.text('RESUMO:', 20, 70);
  doc.setFontSize(12);
  doc.text(`Total de Contratos: ${data.contratos.length}`, 20, 80);
  
  // Tabela de contratos
  if (data.contratos.length > 0) {
    doc.setFontSize(14);
    doc.text('CONTRATOS PRÓXIMOS DO VENCIMENTO:', 20, 100);
    
    const contratosData = data.contratos.map(contrato => {
      const dataFim = new Date(contrato.data_fim);
      const hoje = new Date();
      const diasRestantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      return [
        contrato.numero,
        contrato.fornecedores?.[0]?.nome || 'N/A',
        contrato.objeto?.substring(0, 40) + '...',
        contrato.data_fim,
        `${diasRestantes} dias`,
        `R$ ${contrato.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ];
    });
    
    autoTable(doc, {
      startY: 110,
      head: [['Número', 'Fornecedor', 'Objeto', 'Data Fim', 'Dias Restantes', 'Valor Total']],
      body: contratosData,
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 45 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 }
      }
    });
  } else {
    doc.setFontSize(14);
    doc.text('NENHUM CONTRATO PRÓXIMO DO VENCIMENTO:', 20, 100);
    doc.setFontSize(12);
    doc.text('Todos os contratos estão com prazo adequado.', 20, 110);
  }
  
  // Legenda de cores (se implementarmos)
  const lastY = (doc as any).lastAutoTable?.finalY || 120;
  doc.setFontSize(10);
  doc.text('Legenda:', 20, lastY + 20);
  doc.text('• Contratos vencendo em até 30 dias: ATENÇÃO', 20, lastY + 30);
  doc.text('• Contratos vencendo em até 60 dias: MONITORAMENTO', 20, lastY + 35);
  doc.text('• Contratos vencendo em até 90 dias: PREVENTIVO', 20, lastY + 40);
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Página ${i} de ${pageCount}`, 105, 280, { align: 'center' });
  }
  
  return doc;
}; 