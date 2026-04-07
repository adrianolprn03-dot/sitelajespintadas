import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    const jsonPath = path.join(process.cwd(), 'scripts', 'legislacao-completa.json');
    if (!fs.existsSync(jsonPath)) {
        console.error('Arquivo legislacao-completa.json não encontrado!');
        return;
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    console.log(`Carregados ${data.length} registros para importação.`);

    // 1. Limpeza PROPOSTA no plano
    console.log('Limpando tabela Legislacao...');
    await prisma.legislacao.deleteMany({});
    console.log('Limpeza concluída.');

    // 2. Importação em lote para performance
    let count = 0;
    const batchSize = 100;
    
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        await prisma.legislacao.createMany({
            data: batch.map((item: any) => ({
                tipo: item.tipo || 'outros',
                numero: item.numero || 'S/N',
                ano: item.ano || new Date().getFullYear(),
                ementa: item.ementa || item.titulo || 'Sem ementa',
                arquivo: item.linkArquivo || null,
                ativo: true,
                criadoEm: item.dataPublicacao ? new Date(item.dataPublicacao) : new Date(),
            })),
            skipDuplicates: true
        });
        
        count += batch.length;
        console.log(`Importados ${count}/${data.length}...`);
    }

    console.log('\n✅ Importação finalizada com sucesso!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
