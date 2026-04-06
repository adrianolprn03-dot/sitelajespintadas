import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("📊 RELATÓRIO FINAL DE RESTAURAÇÃO - LAJES PINTADAS/RN\n");
    
    const summary = {
        "Configurações": await prisma.configuracao.count(),
        "Notícias": await prisma.noticia.count(),
        "Secretarias": await prisma.secretaria.count(),
        "Legislação (Total)": await prisma.legislacao.count(),
        "Diárias": await prisma.diaria.count(),
        "Instrumentos Orçamentários": await (prisma as any).instrumentoOrcamentario.count(),
        "Relatórios Fiscais": await (prisma as any).relatorioFiscal.count(),
        "Veículos (Frota)": await (prisma as any).veiculo.count(),
        "Medicamentos (REMUME)": await (prisma as any).medicamento.count(),
        "Obras Públicas": await prisma.obra.count(),
        "Licitações": await prisma.licitacao.count(),
        "Servidores/Folha": await prisma.servidor.count(),
        "FAQ": await prisma.fAQ.count(),
        "Glossário": await (prisma as any).glossario.count(),
        "Emendas Parlamentares": await prisma.emendaParlamentar.count(),
        "Unidades de Atendimento": await prisma.unidadeAtendimento.count(),
        "Conselhos": await prisma.conselho.count(),
    };

    console.table(summary);

    const config = await prisma.configuracao.findFirst({ where: { chave: 'municipio_nome' } });
    console.log(`\nIdentidade Atual: ${config?.valor || 'Não definida'}`);

    const saoTomeCheck = await prisma.configuracao.findFirst({ where: { valor: { contains: 'São Tomé' } } });
    if (saoTomeCheck) {
        console.warn("⚠️ ALERTA: Ainda existem vestígios de São Tomé no banco!");
    } else {
        console.log("✅ Limpeza confirmada: Nenhum registro de São Tomé encontrado.");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
