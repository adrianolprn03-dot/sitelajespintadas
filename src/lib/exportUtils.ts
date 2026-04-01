import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';

export function exportToCSV(data: any[], filename: string) {
    if (typeof window === "undefined" || !data || !data.length) return;

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => {
        return Object.values(obj)
            .map(val => {
                const str = String(val).replace(/"/g, '""');
                return `"${str}"`;
            })
            .join(",");
    }).join("\n");

    const csvContent = "\uFEFF" + headers + "\n" + rows; // UTF-8 BOM
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportToJSON(data: any[], filename: string) {
    if (typeof window === "undefined" || !data || !data.length) return;

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportToPDF(data: any[], filename: string, title?: string) {
    if (typeof window === "undefined" || !data || !data.length) return;

    const doc = new jsPDF();
    const tableColumn = Object.keys(data[0]);
    const tableRows = data.map(obj => Object.values(obj));

    // Logo Mockup/Text (PNTP Requisito: Identificação da Entidade)
    doc.setFontSize(18);
    doc.setTextColor(1, 136, 185); // Azul Lajes Pintadas
    doc.text("Prefeitura Municipal de Lajes Pintadas", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Estado do Rio Grande do Norte | Portal da Transparência", 14, 26);

    if (title) {
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text(title, 14, 38);
    }

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, 44);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows as any,
        startY: 50,
        styles: { fontSize: 8, font: "helvetica", cellPadding: 3 },
        headStyles: { fillColor: [1, 136, 185], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { top: 50 },
        didDrawPage: (data) => {
            // Rodapé
            doc.setFontSize(7);
            doc.text(
                "Documento extraído do Portal da Transparência – Lajes Pintadas/RN. Em conformidade com a Lei de Acesso à Informação (LAI).",
                14,
                doc.internal.pageSize.height - 10
            );
        }
    });

    doc.save(`${filename}.pdf`);
}

export function exportToXLSX(data: any[], filename: string) {
    if (typeof window === "undefined" || !data || !data.length) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    
    // Gerar arquivo e disparar download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}
