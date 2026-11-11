import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { MUNICIPIO } from "@/config/municipio";

function getFallbackData() {
    return [
        {
            "Status": "Nenhum registro localizado para o período ou filtro selecionado."
        }
    ];
}

export function exportToCSV(data: any[], filename: string) {
    if (typeof window === "undefined") return;

    try {
        const exportData = (!data || !Array.isArray(data) || data.length === 0) 
            ? getFallbackData() 
            : data;

        const headers = Object.keys(exportData[0]).join(",");
        const rows = exportData.map(obj => {
            return Object.values(obj)
                .map(val => {
                    const str = val !== null && val !== undefined ? String(val).replace(/"/g, '""') : "";
                    return `"${str}"`;
                })
                .join(",");
        }).join("\n");

        const csvContent = "\uFEFF" + headers + "\n" + rows; // UTF-8 BOM
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename || "relatorio"}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 200);
    } catch (err) {
        console.error("Erro ao exportar CSV:", err);
    }
}

export function exportToJSON(data: any[], filename: string) {
    if (typeof window === "undefined") return;

    try {
        const exportData = (!data || !Array.isArray(data) || data.length === 0) 
            ? getFallbackData() 
            : data;

        const jsonContent = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename || "relatorio"}.json`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 200);
    } catch (err) {
        console.error("Erro ao exportar JSON:", err);
    }
}

export function exportToPDF(data: any[], filename: string, title?: string) {
    if (typeof window === "undefined") return;

    try {
        const exportData = (!data || !Array.isArray(data) || data.length === 0) 
            ? getFallbackData() 
            : data;

        const doc = new jsPDF();
        const tableColumn = Object.keys(exportData[0]);
        const tableRows = exportData.map(obj => 
            Object.values(obj).map(val => (val !== null && val !== undefined ? String(val) : ""))
        );

        // Cabeçalho institucional (PNTP & LAI)
        doc.setFontSize(16);
        doc.setTextColor(1, 136, 185); // Azul Lajes Pintadas
        doc.text(MUNICIPIO.nomeCompleto, 14, 18);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text("Estado do Rio Grande do Norte | Portal da Transparência", 14, 24);

        if (title) {
            doc.setFontSize(11);
            doc.setTextColor(30, 41, 59);
            doc.text(title, 14, 34);
        }

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, 40);

        const tableOptions: any = {
            head: [tableColumn],
            body: tableRows,
            startY: 46,
            styles: { fontSize: 8, font: "helvetica", cellPadding: 3 },
            headStyles: { fillColor: [1, 136, 185], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { top: 46, bottom: 20 },
            didDrawPage: () => {
                doc.setFontSize(7);
                doc.setTextColor(100, 116, 139);
                doc.text(
                    `Documento extraído do Portal da Transparência – ${MUNICIPIO.nome}/${MUNICIPIO.uf}. Em conformidade com a Lei de Acesso à Informação (LAI).`,
                    14,
                    doc.internal.pageSize.height - 10
                );
            }
        };

        // Execução segura de autoTable
        if (typeof autoTable === "function") {
            autoTable(doc, tableOptions);
        } else if (typeof (autoTable as any)?.default === "function") {
            (autoTable as any).default(doc, tableOptions);
        } else if (typeof (doc as any)?.autoTable === "function") {
            (doc as any).autoTable(tableOptions);
        }

        doc.save(`${filename || "relatorio"}.pdf`);
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
    }
}

export function exportToXLSX(data: any[], filename: string) {
    if (typeof window === "undefined") return;

    try {
        const exportData = (!data || !Array.isArray(data) || data.length === 0) 
            ? getFallbackData() 
            : data;

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
        XLSX.writeFile(workbook, `${filename || "relatorio"}.xlsx`);
    } catch (err) {
        console.error("Erro ao exportar XLSX:", err);
    }
}
