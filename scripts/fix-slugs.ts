import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function sanitizeSlug(text: string): string {
    return text
        .toString()
        .normalize('NFD')                   // Decompõe acentos
        .replace(/[\u0300-\u036f]/g, '')    // Remove acentos
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')        // Remove tudo que não for letra, número, espaço ou hífen (incluindo emojis)
        .replace(/\s+/g, '-')               // Troca espaços por hífens
        .replace(/-+/g, '-');               // Remove hífens múltiplos
}

async function main() {
    console.log('Iniciando saneamento de slugs das notícias...');
    
    // Buscar todas as notícias
    const noticias = await prisma.noticia.findMany({
        select: { id: true, slug: true, titulo: true }
    });
    
    console.log(`Encontradas ${noticias.length} notícias. Processando...`);
    
    let atualizadas = 0;
    
    for (const n of noticias) {
        const _idMatch = n.slug.match(/wp(\d+)$/);
        const wpId = _idMatch ? _idMatch[1] : n.id.substring(0,6);
        
        // Remove ' wpXXXX' e limpa. Se tiver muito lixo usa o titulo.
        let baseText = n.slug.replace(/-?wp\d+$/, '');
        if (!baseText || baseText.length < 3 || /[^a-zA-Z]/.test(baseText.substring(0,3))) {
            baseText = n.titulo;
        }

        const safeSlug = `${sanitizeSlug(baseText)}-wp${wpId}`;
        
        // Só atualiza se for diferente
        if (n.slug !== safeSlug) {
            try {
                await prisma.noticia.update({
                    where: { id: n.id },
                    data: { slug: safeSlug }
                });
                atualizadas++;
            } catch (e) {
                console.error(`Erro ao atualizar slug da notícia: ${n.titulo}`);
            }
        }
    }
    
    console.log(`Concluído! ${atualizadas} slugs corrigidos (sem espaços ou emojis).`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
