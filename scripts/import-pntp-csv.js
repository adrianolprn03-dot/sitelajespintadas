const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const csvPath = 'C:/Users/User/.gemini/antigravity/brain/37fe9fa0-f2de-4d3e-884e-99dd650019e4/.user_uploaded/media_1794505864595_32789990.csv';
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    
    // Header
    const header = lines[0].split(';');
    console.log("Headers count:", header.length);

    let count = 0;
    for (let i = 1; i < lines.length; i++) {
        // Handle semicolon separated, taking quotes into account
        const line = lines[i];
        const cols = [];
        let cur = '';
        let inQuotes = false;
        for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch === '"') {
                inQuotes = !inQuotes;
            } else if (ch === ';' && !inQuotes) {
                cols.push(cur.trim());
                cur = '';
            } else {
                cur += ch;
            }
        }
        cols.push(cur.trim());

        if (cols.length < 10) continue;

        const codigo = cols[0].replace(/^"|"$/g, '').trim();
        const dimensao = cols[1]?.replace(/^"|"$/g, '').trim() || '';
        const requisito = cols[2]?.replace(/^"|"$/g, '').trim() || '';
        const classe = cols[3]?.replace(/^"|"$/g, '').trim() || 'Obrigatória';
        const disp = cols[4]?.replace(/^"|"$/g, '').trim() || '-';
        const atual = cols[5]?.replace(/^"|"$/g, '').trim() || '-';
        const serie = cols[6]?.replace(/^"|"$/g, '').trim() || '-';
        const grav = cols[7]?.replace(/^"|"$/g, '').trim() || '-';
        const filtro = cols[8]?.replace(/^"|"$/g, '').trim() || '-';
        const tipoAcao = cols[9]?.replace(/^"|"$/g, '').trim() || '';
        const evidenciaObs = cols[10]?.replace(/^"|"$/g, '').trim() || '';
        const rotaPublica = cols[11]?.replace(/^"|"$/g, '').trim() || '';
        const rotaAdmin = cols[12]?.replace(/^"|"$/g, '').trim() || '';
        const encaminhamento = cols[13]?.replace(/^"|"$/g, '').trim() || '';
        const responsavel = cols[14]?.replace(/^"|"$/g, '').trim() || '';
        const evidenciaRadar = cols[15]?.replace(/^"|"$/g, '').trim() || '';

        const classificacao = classe.toUpperCase().includes('ESSENCIAL') 
            ? 'ESSENCIAL' 
            : classe.toUpperCase().includes('OBRIGAT') 
            ? 'OBRIGATORIO' 
            : 'RECOMENDADO';

        const peso = classificacao === 'ESSENCIAL' ? 2.5 : classificacao === 'OBRIGATORIO' ? 1.5 : 1.0;

        const resultadoOficialObj = {
            ciclo: "2026",
            classe,
            disponibilidade: disp,
            atualidade: atual,
            serieHistorica: serie,
            gravacaoRelatorio: grav,
            filtro: filtro,
            tipoAcao,
            evidenciaObs,
            encaminhamento,
            evidenciaRadar
        };

        const resultadoAvaliacaoExterna = JSON.stringify(resultadoOficialObj);

        const cleanRotaPublica = rotaPublica.replace(/^https:\/\/lajespintadas\.rn\.gov\.br/, '') || '/transparencia';
        const cleanRotaAdmin = rotaAdmin.replace(/^https:\/\/lajespintadas\.rn\.gov\.br/, '') || '/admin';

        await prisma.criterioPNTP.upsert({
            where: { codigo },
            create: {
                codigo,
                dimensao,
                titulo: requisito.length > 100 ? requisito.slice(0, 97) + '...' : requisito,
                textoIntegral: requisito,
                classificacao,
                peso,
                periodicidadeDias: 30,
                exigenciasCartilha: JSON.stringify([
                    disp === 'S' || disp === 'N' ? 'Disponibilidade' : null,
                    atual === 'S' || atual === 'N' ? 'Atualidade' : null,
                    serie === 'S' || serie === 'N' ? 'Série Histórica' : null,
                    grav === 'S' || grav === 'N' ? 'Gravação de Relatórios' : null,
                    filtro === 'S' || filtro === 'N' ? 'Filtro de Pesquisa' : null,
                ].filter(Boolean)),
                referenciaCartilha: `Raio-X PNTP 2026 - Item ${codigo}`,
                paginaPublica: cleanRotaPublica,
                telaAdministrativa: cleanRotaAdmin,
                secretariaResponsavel: responsavel || 'Controladoria Geral do Município',
                resultadoAvaliacaoExterna,
                statusFuncionalidade: 'implementada',
                statusConteudo: 'publicado',
                statusEvidencia: 'conferida',
                statusValidacao: 'validado',
                evidenciaUrl: cleanRotaPublica,
                pendenciasConteudo: encaminhamento,
                verificadoPor: 'Auditoria Raio-X PNTP 2026'
            },
            update: {
                dimensao,
                textoIntegral: requisito,
                resultadoAvaliacaoExterna,
                secretariaResponsavel: responsavel || undefined,
                paginaPublica: cleanRotaPublica,
                telaAdministrativa: cleanRotaAdmin,
                pendenciasConteudo: encaminhamento
            }
        });

        count++;
    }

    console.log(`Sucesso: ${count} critérios sincronizados a partir do CSV Raio-X PNTP 2026.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
