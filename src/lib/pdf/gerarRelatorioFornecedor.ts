import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Fornecedor, Contrato, Ordem } from '@/types';

interface RelatorioFornecedorData {
  fornecedor: Fornecedor;
  contratos: Contrato[];
  ordens: Ordem[];
  periodo: string;
}

export const gerarRelatorioFornecedor = (data: RelatorioFornecedorData) => {
  const doc = new jsPDF();
  
  // Configurações do documento
  doc.setFontSize(20);
  doc.text('RELATÓRIO POR FORNECEDOR', 105, 20, { align: 'center' });
  
  // Informações do fornecedor
  doc.setFontSize(14);
  doc.text('FORNECEDOR:', 20, 40);
  doc.setFontSize(12);
  doc.text(data.fornecedor.nome, 20, 50);
  doc.text(`CNPJ: ${data.fornecedor.cnpj}`, 20, 60);
  
  // Período do relatório
  doc.setFontSize(12);
  doc.text(`Período: ${data.periodo}`, 20, 75);
  
  // Resumo
  doc.setFontSize(14);
  doc.text('RESUMO:', 20, 90);
  doc.setFontSize(12);
  doc.text(`Total de Contratos: ${data.contratos.length}`, 20, 100);
  doc.text(`Total de Ordens: ${data.ordens.length}`, 20, 110);
  
  // Tabela de contratos
  if (data.contratos.length > 0) {
    doc.setFontSize(14);
    doc.text('CONTRATOS:', 20, 130);
    
    const contratosData = data.contratos.map(contrato => [
      contrato.numero || 'N/A',
      (contrato.objeto || 'N/A').substring(0, 50) + '...',
      contrato.dataInicio ? contrato.dataInicio.toLocaleDateString('pt-BR') : 'N/A',
      contrato.dataTermino ? contrato.dataTermino.toLocaleDateString('pt-BR') : 'N/A',
      `R$ ${(contrato.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);
    
    autoTable(doc, {
      startY: 140,
      head: [['Número', 'Objeto', 'Início', 'Fim', 'Valor Total']],
      body: contratosData,
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 60 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 }
      }
    });
  }
  
  // Tabela de ordens
  if (data.ordens.length > 0) {
    const lastY = (doc as any).lastAutoTable?.finalY || 200;
    doc.setFontSize(14);
    doc.text('ORDENS DE FORNECIMENTO:', 20, lastY + 20);
    
    const ordensData = data.ordens.map(ordem => [
      ordem.numero || 'N/A',
      ordem.createdAt ? ordem.createdAt.toLocaleDateString('pt-BR') : 'N/A',
      ordem.status || 'N/A',
      `R$ ${(ordem.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);
    
    autoTable(doc, {
      startY: lastY + 30,
      head: [['Número', 'Data Emissão', 'Status', 'Valor Total']],
      body: ordensData,
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 }
      }
    });
  }
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Página ${i} de ${pageCount}`, 105, 280, { align: 'center' });
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, 280);
  }
  
  return doc;
}; 