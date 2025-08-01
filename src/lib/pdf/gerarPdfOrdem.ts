
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export function gerarPdfOrdem(ordem, contrato, fornecedor, itens) {
  const doc = new jsPDF();

  // Centralizar título
  doc.setFontSize(16);
  doc.text(
    `ORDEM DE FORNECIMENTO Nº ${ordem.numero}`,
    105,
    20,
    { align: "center" }
  );

  doc.setFontSize(12);
  doc.text(`FORNECEDOR: ${fornecedor?.nome || ""}`, 15, 38);
  doc.text(`CNPJ: ${fornecedor?.cnpj || ""}`, 15, 46);
  doc.text(`PROCESSO: ${contrato?.numero || ""}`, 15, 54);
  doc.text(`OBJETO: ${contrato?.objeto || ""}`, 15, 62);

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
    startY: 73,
    head: [["ITEM", "DESCRIÇÃO", "QUANT.", "UND.", "V. UNIT", "V. TOTAL"]],
    body: tableData,
    theme: "grid" as const,
    headStyles: { fillColor: [60, 60, 60], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 2 },
    alternateRowStyles: { fillColor: [230, 230, 230] }
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
