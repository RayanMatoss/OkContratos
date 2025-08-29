import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/lib/utils';
import { getTimbreConfig } from '@/lib/timbreConfig';

interface ContratoParaPdf {
  id: string;
  numero: string;
  objeto: string;
  valor_total: number;
  fundo_municipal: string;
  fornecedor: {
    nome: string;
    cnpj: string;
  };
  itens: any[]; // Usando any para evitar conflitos de tipo
  timbreConfig?: any;
}

export async function gerarPdfContrato(contrato: ContratoParaPdf) {
  const doc = new jsPDF();
  
  // Configurações do documento
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  
  let yPosition = 15; // Reduzido de 30 para 15 para subir mais

  // Título principal (centralizado como nas ordens)
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('EXTRATO DO CONTRATO', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15; // Reduzido de 20 para 15

  // Tabela de informações do cabeçalho (igual às ordens)
  const headerData = [
    ["NÚMERO:", contrato.numero],
    ["FORNECEDOR:", contrato.fornecedor.nome],
    ["CNPJ:", contrato.fornecedor.cnpj !== 'Não informado' ? contrato.fornecedor.cnpj : 'CNPJ não cadastrado'],
    ["FUNDO MUNICIPAL:", contrato.fundo_municipal],
    ["VALOR TOTAL:", formatCurrency(contrato.valor_total)],
    ["OBJETO:", contrato.objeto]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: headerData,
    theme: "plain" as const,
    styles: { 
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.1
    },
    columnStyles: {
      0: { 
        cellWidth: 35,
        fontStyle: 'bold',
        textColor: [0, 0, 0],
        halign: 'left'
      },
      1: { 
        cellWidth: 150,
        textColor: [0, 0, 0],
        halign: 'justify',
        valign: 'top'
      }
    },
    margin: { left: margin, right: margin },
    didParseCell: function(data) {
      // Aplicar justificação específica para a célula do OBJETO
      if (data.row.index === 5 && data.column.index === 1) { // Linha 6, coluna 2 (OBJETO)
        data.cell.styles.halign = 'justify';
        data.cell.styles.valign = 'top';
      }
    }
  });

  // Obter posição final da tabela de cabeçalho
  const headerEndY = (doc as any).lastAutoTable?.finalY || yPosition + 50;
  
  // Tabela de itens (igual às ordens)
  if (contrato.itens && contrato.itens.length > 0) {
    const tableData = contrato.itens.map((item, idx) => [
      idx + 1,
      item.descricao,
      item.quantidadeOriginal?.toString() || '0',
      item.unidade || '-',
      `R$ ${Number(item.valorUnitario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      `R$ ${Number(item.valorTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);

    autoTable(doc, {
      startY: headerEndY + 10,
      head: [["ITEM", "DESCRIÇÃO", "QUANT.", "UND.", "V. UNIT", "V. TOTAL"]],
      body: tableData,
      theme: "grid" as const,
      headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 2 },
      alternateRowStyles: { fillColor: [230, 230, 230] },
      columnStyles: {
        0: { cellWidth: 15 }, // ITEM
        1: { cellWidth: 70 }, // DESCRIÇÃO
        2: { cellWidth: 25 }, // QUANT.
        3: { cellWidth: 20 }, // UND.
        4: { cellWidth: 25 }, // V. UNIT
        5: { cellWidth: 30 }  // V. TOTAL
      },
      margin: { left: margin, right: margin }
    });

    // Get the final Y position from the table
    const finalY = (doc as any).lastAutoTable?.finalY || headerEndY + 50;

    // Total geral (igual às ordens)
    doc.setFontSize(12);
    doc.text(
      `TOTAL GERAL: ${formatCurrency(contrato.valor_total)}`,
      120,
      finalY + 10
    );

    // Data de geração (igual às ordens)
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.setFontSize(11);
    doc.text(
      `Data de geração: ${dataAtual}`,
      margin,
      finalY + 25
    );
  }
  
  // Nome do arquivo
  const fileName = `extrato_contrato_${contrato.numero.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  
  // Salvar o PDF
  doc.save(fileName);
  
  return doc;
}
