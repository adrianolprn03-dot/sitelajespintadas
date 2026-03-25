import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const baseUrl = "https://pmlajespintadasrn.apitransparencia.topsolutionsrn.com.br/arquivo/downloadarquivoporidasync?idArquivo=";

const documentos = [
    // PPA
    { tipo: "PPA", ano: 2018, numero: "301/2017", ementa: "Plano Plurianual (PPA) - Quadriênio 2018-2021", arquivoId: "2210" },
    
    // LDO
    { tipo: "LDO", ano: 2024, numero: "---", ementa: "Lei de Diretrizes Orçamentárias (LDO) 2024", arquivoId: "2201" },
    { tipo: "LDO", ano: 2023, numero: "---", ementa: "Lei de Diretrizes Orçamentárias (LDO) 2023", arquivoId: "2200" },
    { tipo: "LDO", ano: 2022, numero: "---", ementa: "Lei de Diretrizes Orçamentárias (LDO) 2022", arquivoId: "2199" },
    { tipo: "LDO", ano: 2021, numero: "---", ementa: "Lei de Diretrizes Orçamentárias (LDO) 2021", arquivoId: "2198" },
    { tipo: "LDO", ano: 2020, numero: "---", ementa: "Lei de Diretrizes Orçamentárias (LDO) 2020", arquivoId: "2197" },
    { tipo: "LDO", ano: 2019, numero: "---", ementa: "Lei de Diretrizes Orçamentárias (LDO) 2019 - Documento 1", arquivoId: "2195" },
    { tipo: "LDO", ano: 2019, numero: "---", ementa: "Lei de Diretrizes Orçamentárias (LDO) 2019 - Documento 2", arquivoId: "2196" },
    { tipo: "LDO", ano: 2018, numero: "---", ementa: "Lei de Diretrizes Orçamentárias (LDO) 2018", arquivoId: "2194" },
    { tipo: "LDO", ano: 2017, numero: "---", ementa: "Lei de Diretrizes Orçamentárias (LDO) 2017", arquivoId: "2193" },

    // LOA
    { tipo: "LOA", ano: 2024, numero: "---", ementa: "Lei Orçamentária Anual (LOA) 2024", arquivoId: "2209" },
    { tipo: "LOA", ano: 2023, numero: "---", ementa: "Lei Orçamentária Anual (LOA) 2023", arquivoId: "2208" },
    { tipo: "LOA", ano: 2022, numero: "---", ementa: "Lei Orçamentária Anual (LOA) 2022", arquivoId: "2207" },
    { tipo: "LOA", ano: 2021, numero: "---", ementa: "Lei Orçamentária Anual (LOA) 2021", arquivoId: "2206" },
    { tipo: "LOA", ano: 2020, numero: "---", ementa: "Lei Orçamentária Anual (LOA) 2020", arquivoId: "2205" },
    { tipo: "LOA", ano: 2019, numero: "---", ementa: "Lei Orçamentária Anual (LOA) 2019", arquivoId: "2202" },
    { tipo: "LOA", ano: 2018, numero: "---", ementa: "Lei Orçamentária Anual (LOA) 2018", arquivoId: "2204" },
    { tipo: "LOA", ano: 2017, numero: "---", ementa: "Lei Orçamentária Anual (LOA) 2017", arquivoId: "2203" },
];

async function main() {
    console.log("Iniciando importação de legislação orçamentária (PPA, LDO, LOA)...");

    for (const doc of documentos) {
        const fullUrl = `${baseUrl}${doc.arquivoId}`;
        
        await prisma.legislacao.create({
            data: {
                tipo: doc.tipo,
                ano: doc.ano,
                numero: doc.numero,
                ementa: doc.ementa,
                arquivo: fullUrl,
                ativo: true,
            }
        });
        console.log(`✅ Importado: ${doc.tipo} ${doc.ano} - ${doc.ementa}`);
    }

    console.log("Importação concluída com sucesso!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
