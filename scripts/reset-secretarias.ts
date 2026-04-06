import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("🧹 Removendo secretarias atuais...");
    const count = await prisma.secretaria.deleteMany();
    console.log(`✅ ${count.count} secretarias removidas.`);
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
