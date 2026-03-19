import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

    if (title) {
        doc.text(title, 14, 15);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, 22);
    }

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows as any,
        startY: title ? 25 : 15,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [1, 176, 239] } // Cor azul do site
    });

    doc.save(`${filename}.pdf`);
}
