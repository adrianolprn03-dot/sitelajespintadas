import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function run() {
    const unidades = await p.unidadeAtendimento.findMany();
    console.log("TOTAL UNIDADES:", unidades.length);
    console.log(JSON.stringify(unidades, null, 2));
}
run().finally(() => p.$disconnect());
