const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalize(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

async function matchAndUpload() {
    try {
        const linksPath = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\6280fd92-e1bd-43c7-a634-a687bd48efd1\\scratch\\links.json';
        const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
        console.log(`Loaded ${links.length} links.`);

        const diarias = await prisma.diaria.findMany();
        console.log(`Loaded ${diarias.length} diarias from DB.`);

        let matchedCount = 0;

        for (const diaria of diarias) {
            const serverName = normalize(diaria.servidor);
            if (!serverName) continue;

            // Try to find a link that matches the server name and mentions "diaria"
            // If not found, try just server name
            let match = links.find(l => {
                const text = normalize(l.text);
                return text.includes(serverName) && (text.includes('diaria') || text.includes('diarias'));
            });

            if (!match) {
                match = links.find(l => {
                    const text = normalize(l.text);
                    // Split server name and check if at least 2 parts match (to avoid false positives with common names like 'maria')
                    const parts = serverName.split(' ');
                    if (parts.length > 1) {
                        return text.includes(parts[0]) && text.includes(parts[1]) && text.includes('diaria');
                    }
                    return text.includes(serverName) && text.includes('diaria');
                });
            }

            if (match) {
                console.log(`Matched: ${diaria.servidor} -> ${match.url}`);
                await prisma.diaria.update({
                    where: { id: diaria.id },
                    data: { portariaUrl: match.url }
                });
                matchedCount++;
            }
        }

        console.log(`Updated ${matchedCount} diarias with portaria URLs.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

matchAndUpload();
