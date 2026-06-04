import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Atualizando configurações do brasão no banco de dados...");
    
    // Atualiza a configuração simbolo_brasao para usar a imagem de São Tomé
    await prisma.configuracao.upsert({
        where: { chave: 'simbolo_brasao' },
        update: { valor: '/brasao_saotome.png' },
        create: {
            chave: 'simbolo_brasao',
            valor: '/brasao_saotome.png',
            descricao: 'Brasão Oficial do Município',
            grupo: 'identidade'
        }
    });

    console.log("Brasão atualizado com sucesso no banco de dados para '/brasao_saotome.png'");
}

main()
    .catch((e) => {
        console.error("Erro ao atualizar brasão:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
