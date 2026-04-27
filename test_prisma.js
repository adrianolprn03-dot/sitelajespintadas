const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const cpf = "12345678902";
        const mes = 4;
        const ano = 2026;
        
        const payload = {
            cpf,
            avaliacaoGestao: 5,
            avaliacaoOuvidoria: 5,
            satisfacaoTransparencia: 5,
            avaliacaoLixo: 5,
            avaliacaoLimpezaRuas: 5,
            avaliacaoPatrimonio: 5,
            avaliacaoPracas: 5,
            avaliacaoCultura: 5,
            avaliacaoIluminacao: 5,
            avaliacaoSeguranca: 5,
            avaliacaoEsporte: 5,
            avaliacaoSaude: 5,
            avaliacaoEducacao: 5,
            avaliacaoAssistenciaSocial: 5,
            mes,
            ano,
        };

        const pesquisa = await prisma.pesquisaSatisfacao.create({
            data: payload,
        });

        console.log("Pesquisa criada:", pesquisa);
    } catch(e) {
        console.error("Erro:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
