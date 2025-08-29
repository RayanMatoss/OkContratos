
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { getTimbreConfig, TimbreConfig } from "../timbreConfig";

export function gerarPdfOrdem(
  ordem, 
  contrato, 
  fornecedor, 
  itens, 
  timbreConfig?: TimbreConfig
) {
  const doc = new jsPDF();

  // Usar diretamente o timbreConfig passado como parâmetro
  const timbre = timbreConfig || getTimbreConfig();
  
  // Aplicar configurações personalizadas se fornecidas
  if (timbreConfig?.posicao) {
    timbre.posicao = timbreConfig.posicao;
  }
  if (timbreConfig?.tamanho) {
    timbre.tamanho = timbreConfig.tamanho;
  }

  // Adicionar timbre baseado na posição
  try {
    let x = 0, y = 0;
    
    switch (timbre.posicao) {
      case 'top-right':
        x = 140;
        y = 5; // Posicionado mais alto
        break;
      case 'top-left':
        x = 15;
        y = 5; // Posicionado mais alto
        break;
      case 'center-top':
        x = (doc.internal.pageSize.getWidth() - timbre.tamanho.width) / 2; // Centralizar horizontalmente
        y = 5; // Posicionado mais próximo do topo da página
        break;
      case 'header':
        x = 15;
        y = 5;
        break;
    }

    

    // Adicionar imagem do timbre com fallback para JPG
    try {

      doc.addImage(
        timbre.url, 
        'PNG', 
        x, 
        y, 
        timbre.tamanho.width, 
        timbre.tamanho.height
      );

      

      
    } catch (pngError) {
      
      try {
        doc.addImage(
          timbre.url.replace('.png', '.jpg'), 
          'JPEG', 
          x, 
          y, 
          timbre.tamanho.width, 
          timbre.tamanho.height
        );
        
              } catch (jpgError) {
          // Fallback silencioso para JPG
        }
    }
  } catch (error) {
    console.warn('Erro ao carregar timbre:', error);
  }

  // Centralizar título (posicionado abaixo do timbre)
  doc.setFontSize(16);
  doc.text(
    `ORDEM DE FORNECIMENTO Nº ${ordem.numero}`,
    105,
    65, // Posicionado abaixo do timbre (y=5 + height=50 + margin=10 = 65)
    { align: "center" }
  );

  // Tabela de informações do cabeçalho
  const headerData = [
    ["FORNECEDOR:", fornecedor?.nome || ""],
    ["CNPJ:", fornecedor?.cnpj || ""],
    ["CONTRATO:", contrato?.numero || ""],
    ["OBJETO:", contrato?.objeto || ""]
  ];

  autoTable(doc, {
    startY: 75, // Posicionado abaixo do título (y=65 + margin=10 = 75)
    head: [],
    body: headerData,
    theme: "plain" as const,
    styles: { 
      fontSize: 10, // Fonte menor para enquadrar melhor
      cellPadding: 3,
      lineWidth: 0.1
    },
    columnStyles: {
      0: { 
        cellWidth: 35, // Aumentar largura da coluna dos labels
        fontStyle: 'bold',
        textColor: [0, 0, 0],
        halign: 'left'
      },
      1: { 
        cellWidth: 150, // Ajustar para alinhar com a tabela de itens
        textColor: [0, 0, 0],
        halign: 'justify', // Justificar o texto
        valign: 'top'
      }
    },
    margin: { left: 15, right: 15 }, // Mesma margem da tabela de itens
    didParseCell: function(data) {
      // Aplicar justificação específica para a célula do OBJETO
      if (data.row.index === 3 && data.column.index === 1) { // Linha 4, coluna 2 (OBJETO)
        data.cell.styles.halign = 'justify';
        data.cell.styles.valign = 'top';
      }
    }
  });

  // Obter posição final da tabela de cabeçalho
  const headerEndY = (doc as any).lastAutoTable?.finalY || 80;
  
  // Tabela de itens
  const tableData = (itens || []).map((item, idx) => [
    idx + 1,
    item.descricao,
    item.quantidade,
    item.unidade,
    `R$ ${Number(item.valor_unitario || item.valorUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `R$ ${(item.quantidade * (item.valor_unitario || item.valorUnitario)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
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
    margin: { left: 15, right: 15 } // Mesma margem da tabela de cabeçalho
  });

  // Get the final Y position from the table using proper typing
  const finalY = (doc as any).lastAutoTable?.finalY || 100;

  // Total geral
  const totalGeral = (itens || []).reduce((acc, item) => acc + (item.quantidade * (item.valor_unitario || item.valorUnitario)), 0);
  doc.setFontSize(12);
  doc.text(
    `TOTAL GERAL: R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    120,
    finalY + 10
  );

  // Data de emissão
  const dataEmissao = ordem.data_emissao
    ? format(new Date(ordem.data_emissao), "dd/MM/yyyy")
    : "";
  doc.setFontSize(11);
  doc.text(
    `Data de Emissão: ${dataEmissao}`,
    15,
    finalY + 25
  );

  // Linha para responsável
  doc.setFontSize(11);
  doc.text(
    "Responsável: ____________________________________________",
    15,
    finalY + 35
  );

  doc.save(`Ordem_${ordem.numero}.pdf`);
}
