import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function check() {
    console.log("--- Verificando Novas Tabelas ---");
    try {
        const configCount = await prisma.configuracao.count();
        console.log(`Configuracao: OK (${configCount} registros)`);
        
        const medCount = await prisma.medicamento.count();
        console.log(`Medicamento: OK (${medCount} registros)`);
        
        const veicCount = await prisma.veiculo.count();
        console.log(`Veiculo: OK (${veicCount} registros)`);
        
        const emendaCount = await prisma.emendaParlamentar.count();
        console.log(`EmendaParlamentar: OK (${emendaCount} registros)`);
        
        const concCount = await prisma.concurso.count();
        console.log(`Concurso: OK (${concCount} registros)`);
        
        const servCount = await prisma.servicoCarta.count();
        console.log(`ServicoCarta: OK (${servCount} registros)`);
        
        console.log("\n--- Sucesso: Todas as tabelas estão acessíveis! ---");
    } catch (e: any) {
        console.error("\n--- Erro ao acessar tabelas: ---");
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
