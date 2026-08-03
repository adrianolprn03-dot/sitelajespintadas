import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PROGRAMAS_DEFAULT = [
    {
        id: "prog-1",
        titulo: "Fomento à Cultura",
        descricao: "Apoio financeiro e logístico a projetos culturais, festivais, grupos folclóricos e manifestações artísticas locais.",
        recursos: 42000,
        projetos: 8,
        status: "Vigente",
    },
    {
        id: "prog-2",
        titulo: "Fomento ao Esporte",
        descricao: "Apoio a competições esportivas, escolinhas de esporte, atletas e times representativos do município.",
        recursos: 28500,
        projetos: 12,
        status: "Vigente",
    },
    {
        id: "prog-3",
        titulo: "Festividades Municipais",
        descricao: "Organização e apoio de eventos festivos, datas comemorativas e festivais anuais do calendário oficial.",
        recursos: 55000,
        projetos: 5,
        status: "Vigente",
    },
    {
        id: "prog-4",
        titulo: "Incentivo à Leitura",
        descricao: "Projeto de fomento à leitura, doação de livros e apoio à biblioteca pública municipal.",
        recursos: 12000,
        projetos: 3,
        status: "Vigente",
    },
];

const EDITAIS_DEFAULT = [
    {
        id: "default-1",
        titulo: "Edital de Fomento Cultural nº 001/2026",
        tipo: "Cultura",
        publicacao: "2026-02-01",
        status: "Encerrado",
        linkEdital: "https://lajespintadas.rn.gov.br/transparencia/editais",
    },
    {
        id: "default-2",
        titulo: "Edital de Apoio Esportivo nº 002/2026",
        tipo: "Esporte",
        publicacao: "2026-02-15",
        status: "Aberto",
        linkEdital: "https://lajespintadas.rn.gov.br/transparencia/editais",
    },
];

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const format = (searchParams.get("format") || "csv").toLowerCase();

        // 1. Obter dados das configurações salvas
        let customData: any = {};
        try {
            const configRecord = await prisma.configuracao.findUnique({
                where: { chave: "incentivos_culturais_data" }
            });
            if (configRecord?.valor) {
                customData = JSON.parse(configRecord.valor);
            }
        } catch (e) {
            console.error("Erro ao carregar configuracao de incentivos culturais:", e);
        }

        const exercicioAno = customData.exercicioAno || new Date().getFullYear().toString();
        const programas = Array.isArray(customData.programas) && customData.programas.length > 0
            ? customData.programas
            : PROGRAMAS_DEFAULT;

        // 2. Obter editais
        let editaisDb: any[] = [];
        try {
            editaisDb = await prisma.concurso.findMany({
                where: { ativo: true },
                orderBy: { dataPublicacao: "desc" },
            });
        } catch (e) {
            console.error("Erro ao buscar editais:", e);
        }

        const editais = editaisDb.length > 0
            ? editaisDb.map(e => ({
                id: e.id,
                titulo: e.titulo,
                tipo: e.tipo || "Cultura/Esporte",
                publicacao: e.dataPublicacao ? new Date(e.dataPublicacao).toISOString().split('T')[0] : "",
                status: e.status === "aberto" || e.status === "Aberto" ? "Aberto" : "Encerrado",
                linkEdital: e.linkEdital || "",
            }))
            : EDITAIS_DEFAULT;

        // Formato JSON (Aberto e Editável)
        if (format === "json") {
            const payload = {
                municipio: "Prefeitura Municipal de Lajes Pintadas / RN",
                exercicio: exercicioAno,
                formatoDados: "Formato Aberto e Editável (PNTP 2026)",
                dataGeracao: new Date().toISOString(),
                programasIncentivo: programas.map((p: any) => ({
                    id: p.id,
                    titulo: p.titulo,
                    descricao: p.descricao,
                    recursosInvestidos: Number(p.recursos) || 0,
                    projetosApoiados: Number(p.projetos) || 0,
                    status: p.status || "Vigente"
                })),
                editaisPublicados: editais
            };

            return new NextResponse(JSON.stringify(payload, null, 2), {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Content-Disposition": `attachment; filename="incentivos_culturais_${exercicioAno}.json"`,
                },
            });
        }

        // Formato XML (Aberto e Editável)
        if (format === "xml") {
            const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<IncentivosCulturais>
    <Municipio>Prefeitura Municipal de Lajes Pintadas / RN</Municipio>
    <Exercicio>${exercicioAno}</Exercicio>
    <PadraoPNTP>PNTP 2026 - Dados Abertos Editaveis</PadraoPNTP>
    <Programas>
${programas.map((p: any) => `        <Programa>
            <ID>${p.id}</ID>
            <Titulo>${escapeXml(p.titulo)}</Titulo>
            <Descricao>${escapeXml(p.descricao)}</Descricao>
            <RecursosInvestidos>${Number(p.recursos) || 0}</RecursosInvestidos>
            <ProjetosApoiados>${Number(p.projetos) || 0}</ProjetosApoiados>
            <Status>${escapeXml(p.status || "Vigente")}</Status>
        </Programa>`).join("\n")}
    </Programas>
    <Editais>
${editais.map((e: any) => `        <Edital>
            <ID>${e.id}</ID>
            <Titulo>${escapeXml(e.titulo)}</Titulo>
            <AreaCategoria>${escapeXml(e.tipo)}</AreaCategoria>
            <DataPublicacao>${e.publicacao}</DataPublicacao>
            <Status>${escapeXml(e.status)}</Status>
            <LinkEdital>${escapeXml(e.linkEdital)}</LinkEdital>
        </Edital>`).join("\n")}
    </Editais>
</IncentivosCulturais>`;

            return new NextResponse(xmlContent, {
                headers: {
                    "Content-Type": "application/xml; charset=utf-8",
                    "Content-Disposition": `attachment; filename="incentivos_culturais_${exercicioAno}.xml"`,
                },
            });
        }

        // Formato CSV / Excel / ODS (Aberto e Editável - Padrão PNTP)
        const csvHeader = "\uFEFFsecao;id;titulo_programa_ou_edital;area_categoria_ou_descricao;recursos_investidos_brl;projetos_apoiados;status;data_publicacao;link_documento\n";
        
        const programaRows = programas.map((p: any) => {
            const titulo = cleanCsv(p.titulo);
            const desc = cleanCsv(p.descricao);
            const recursos = Number(p.recursos) || 0;
            const projetos = Number(p.projetos) || 0;
            const status = cleanCsv(p.status || "Vigente");
            return `Programa;"${p.id}";"${titulo}";"${desc}";${recursos};${projetos};"${status}";"";""`;
        }).join("\n");

        const editalRows = editais.map((e: any) => {
            const titulo = cleanCsv(e.titulo);
            const tipo = cleanCsv(e.tipo);
            const status = cleanCsv(e.status);
            const pub = e.publicacao || "";
            const link = cleanCsv(e.linkEdital || "");
            return `Edital;"${e.id}";"${titulo}";"${tipo}";0;0;"${status}";"${pub}";"${link}"`;
        }).join("\n");

        const csvContent = csvHeader + programaRows + "\n" + editalRows;

        const isXlsx = format === "xlsx" || format === "excel";
        const filename = isXlsx 
            ? `incentivos_culturais_${exercicioAno}.xlsx.csv` 
            : `incentivos_culturais_${exercicioAno}.csv`;

        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error("Erro ao exportar dados de incentivos culturais:", error);
        return NextResponse.json({ error: "Erro ao exportar dados" }, { status: 500 });
    }
}

function cleanCsv(val: any): string {
    if (!val) return "";
    return String(val).replace(/"/g, '""').replace(/\n/g, ' ');
}

function escapeXml(unsafe: any): string {
    if (!unsafe) return "";
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
