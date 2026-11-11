import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { MUNICIPIO } from "@/config/municipio";

export interface ExportMetadata {
    titulo?: string;
    periodo?: string;
    filtros?: string;
    fonte?: string;
    orgao?: string;
}

function getFallbackData() {
    return [
        {
            Status: "Nenhum registro localizado para o período ou filtro selecionado.",
        },
    ];
}

/**
 * Previne CSV / Spreadsheet Formula Injection (DDE / CSV Injection).
 * Se um texto iniciar com =, +, -, @, Tab ou CR (e não for apenas um número negativo válido),
 * prefixa com apóstrofo (') para neutralizar interpretação de fórmulas em planilhas.
 */
export function sanitizeSpreadsheetCell(val: unknown): string {
    if (val === null || val === undefined) return "";
    if (typeof val === "number" || typeof val === "boolean") return String(val);

    const str = String(val);
    const trimmed = str.trimStart();
    if (!trimmed) return str;

    const firstChar = trimmed[0];
    if (["=", "+", "-", "@", "\t", "\r"].includes(firstChar)) {
        // Permite números negativos legítimos (ex: "-123,45" ou "-500.00")
        if (firstChar === "-" && /^-\d+([.,]\d+)?$/.test(trimmed)) {
            return str;
        }
        return `'${str}`;
    }
    return str;
}

function buildContextSummary(meta?: ExportMetadata): Record<string, string> {
    const urlParams =
        typeof window !== "undefined" && window.location.search
            ? decodeURIComponent(window.location.search.replace(/^\?/, ""))
            : "Sem filtros específicos na URL";

    return {
        Ente: `${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}) - CNPJ ${MUNICIPIO.cnpj}`,
        CodigoIBGE: MUNICIPIO.ibge,
        Orgao: meta?.orgao || "Poder Executivo Municipal",
        Fonte: meta?.fonte || "Portal da Transparência Municipal",
        PeriodoReferencia: meta?.periodo || "Conforme registros filtrados",
        FiltrosAplicados: meta?.filtros || urlParams,
        ExtraidoEm: new Date().toLocaleString("pt-BR"),
    };
}

export function exportToCSV(data: any[], filename: string, meta?: ExportMetadata) {
    if (typeof window === "undefined") return;

    try {
        const exportData =
            !data || !Array.isArray(data) || data.length === 0 ? getFallbackData() : data;

        const ctx = buildContextSummary(meta);
        const metaHeaderLines = [
            `"# ${ctx.Ente}"`,
            `"# Fonte: ${ctx.Fonte} | Extraído em: ${ctx.ExtraidoEm} | Filtros: ${ctx.FiltrosAplicados.replace(/"/g, '""')}"`,
        ];

        const headers = Object.keys(exportData[0])
            .map((h) => `"${sanitizeSpreadsheetCell(h).replace(/"/g, '""')}"`)
            .join(";");

        const rows = exportData
            .map((obj) =>
                Object.values(obj)
                    .map((val) => {
                        const safe = sanitizeSpreadsheetCell(val).replace(/"/g, '""');
                        return `"${safe}"`;
                    })
                    .join(";")
            )
            .join("\n");

        const csvContent = "\uFEFF" + metaHeaderLines.join("\n") + "\n" + headers + "\n" + rows; // UTF-8 BOM + separador ';' padrão BR
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

export function exportToJSON(data: any[], filename: string, meta?: ExportMetadata) {
    if (typeof window === "undefined") return;

    try {
        const exportData =
            !data || !Array.isArray(data) || data.length === 0 ? getFallbackData() : data;

        const payload = {
            metadados: buildContextSummary(meta),
            totalRegistros: Array.isArray(data) ? data.length : 0,
            dados: exportData,
        };

        const jsonContent = JSON.stringify(payload, null, 2);
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

export function exportToPDF(data: any[], filename: string, title?: string, meta?: ExportMetadata) {
    if (typeof window === "undefined") return;

    try {
        const exportData =
            !data || !Array.isArray(data) || data.length === 0 ? getFallbackData() : data;

        const ctx = buildContextSummary(meta);
        const doc = new jsPDF();
        const tableColumn = Object.keys(exportData[0]);
        const tableRows = exportData.map((obj) =>
            Object.values(obj).map((val) => (val !== null && val !== undefined ? String(val) : ""))
        );

        // Cabeçalho institucional (PNTP & LAI)
        doc.setFontSize(15);
        doc.setTextColor(1, 136, 185);
        doc.text(MUNICIPIO.nomeCompleto, 14, 16);

        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(
            `Estado do Rio Grande do Norte | CNPJ: ${MUNICIPIO.cnpj} | IBGE: ${MUNICIPIO.ibge}`,
            14,
            22
        );

        if (title || meta?.titulo) {
            doc.setFontSize(11);
            doc.setTextColor(30, 41, 59);
            doc.text(title || meta?.titulo || "Relatório de Transparência", 14, 30);
        }

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(
            `Extraído em: ${ctx.ExtraidoEm} | Registros: ${Array.isArray(data) ? data.length : 0} | Filtros: ${ctx.FiltrosAplicados.slice(0, 75)}`,
            14,
            36
        );

        const tableOptions: any = {
            head: [tableColumn],
            body: tableRows,
            startY: 42,
            styles: { fontSize: 7.5, font: "helvetica", cellPadding: 2.5 },
            headStyles: { fillColor: [1, 136, 185], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { top: 42, bottom: 20 },
            didDrawPage: () => {
                doc.setFontSize(7);
                doc.setTextColor(100, 116, 139);
                doc.text(
                    `Portal da Transparência – ${MUNICIPIO.nome}/${MUNICIPIO.uf}. Lei de Acesso à Informação (Lei nº 12.527/2011) e Diretrizes PNTP 2026.`,
                    14,
                    doc.internal.pageSize.height - 10
                );
            },
        };

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

export function exportToXLSX(data: any[], filename: string, meta?: ExportMetadata) {
    if (typeof window === "undefined") return;

    try {
        const rawData =
            !data || !Array.isArray(data) || data.length === 0 ? getFallbackData() : data;

        const sanitizedData = rawData.map((row) => {
            const cleanRow: Record<string, any> = {};
            for (const [k, v] of Object.entries(row)) {
                cleanRow[sanitizeSpreadsheetCell(k)] =
                    typeof v === "number" ? v : sanitizeSpreadsheetCell(v);
            }
            return cleanRow;
        });

        const ctx = buildContextSummary(meta);
        const metaSheetData = Object.entries(ctx).map(([Campo, Valor]) => ({ Campo, Valor }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sanitizedData);
        const metaSheet = XLSX.utils.json_to_sheet(metaSheetData);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
        XLSX.utils.book_append_sheet(workbook, metaSheet, "Metadados_Extracao");
        XLSX.writeFile(workbook, `${filename || "relatorio"}.xlsx`);
    } catch (err) {
        console.error("Erro ao exportar XLSX:", err);
    }
}
