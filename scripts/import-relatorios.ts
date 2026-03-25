import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONFIG = [
    {
        name: "RGF - Relatório de Gestão Fiscal",
        slug: "relatorio-de-gestao-fiscal-rgf",
        tipo: "lrf"
    },
    {
        name: "RREO - Relatório Resumido da Execução Orçamentária",
        slug: "relatorio-resumido-da-execucao-orcamentaria-rreo",
        tipo: "lrf"
    },
    {
        name: "Balanço Geral",
        slug: "balanco-geral",
        tipo: "pcg"
    }
];

const BASE_API_URL = "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/listarporarquivoasync?arquivo=";
const DOWNLOAD_BASE_URL = "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=";

async function importRelatorios() {
    console.log("🚀 Iniciando importação de relatórios...");

    for (const item of CONFIG) {
        console.log(`\n📂 Processando: ${item.name} (${item.slug})...`);
        const url = `${BASE_API_URL}${item.slug}`;
        
        try {
            const res = await fetch(url);
            const json: any = await res.json();

            if (!json.ok || !json.data || json.data.length === 0) {
                console.warn(`⚠️ Nenhum dado encontrado para ${item.slug}`);
                continue;
            }

            const arquivos = json.data[0].lstArquivosPorAnos;
            console.log(`✅ Encontrados ${arquivos.length} arquivos.`);

            let count = 0;
            for (const arq of arquivos) {
                const titulo = `${arq.descArquivo} - ${arq.descCategoria}`;
                const arquivoUrl = `${DOWNLOAD_BASE_URL}${arq.idArquivo}`;
                const ano = arq.anoPub;
                const dataCriacao = new Date(arq.dtInclusao);

                // Upsert para evitar duplicatas baseadas no arquivoUrl e tipo
                await prisma.documento.upsert({
                    where: {
                        // Como não temos um campo único natural além do ID autoincrement, 
                        // vamos checar se já existe um documento com o mesmo título, ano e arquivo
                        // No schema.prisma, o modelo Documento não tem constraint de unicidade composta.
                        // Mas podemos buscar antes ou usar o ID original da TopSolutions se tivéssemos esse campo.
                        // Vou usar uma busca simples para evitar duplicatas.
                        id: `top-${arq.idArquivo}` // Usando o ID da TopSolutions prefixado como id único se o modelo permitir string
                    },
                    update: {
                        titulo,
                        ano,
                        arquivo: arquivoUrl,
                        tipo: item.tipo,
                        criadoEm: dataCriacao
                    },
                    create: {
                        id: `top-${arq.idArquivo}`,
                        titulo,
                        ano,
                        arquivo: arquivoUrl,
                        tipo: item.tipo,
                        criadoEm: dataCriacao
                    }
                }).catch(async (e) => {
                    // Se o ID for numérico no Prisma, o upsert acima vai falhar. 
                    // Vamos tentar buscar por arquivo e título.
                    const existing = await prisma.documento.findFirst({
                        where: {
                            titulo,
                            arquivo: arquivoUrl,
                            ano
                        }
                    });

                    if (!existing) {
                        await prisma.documento.create({
                            data: {
                                titulo,
                                ano,
                                arquivo: arquivoUrl,
                                tipo: item.tipo,
                                criadoEm: dataCriacao
                            }
                        });
                    }
                });
                count++;
            }
            console.log(`✨ Importados/Atualizados ${count} documentos de ${item.name}`);

        } catch (error: any) {
            console.error(`❌ Erro ao processar ${item.slug}:`, error.message);
        }
    }

    console.log("\n🏁 Importação concluída!");
}

importRelatorios()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
