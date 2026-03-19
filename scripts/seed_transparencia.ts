import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    console.log("--- Iniciando Seed de Configurações Institucionais ---");
    
    const configs = [
        { chave: "prefeito_nome", valor: "Luciano da Cunha", grupo: "gestores", descricao: "Nome do Prefeito Atual" },
        { chave: "prefeito_descricao", valor: "Gestor com longa trajetória no serviço público, focado em transparência, modernização da infraestrutura e humanização do atendimento em saúde.", grupo: "gestores" },
        { chave: "vice_nome", valor: "João Maria Silva", grupo: "gestores", descricao: "Nome do Vice-Prefeito Atual" },
        { chave: "vice_descricao", valor: "Líder comunitário com foco no desenvolvimento rural e preservação ambiental das serras de Lajes Pintadas.", grupo: "gestores" },
        { chave: "municipio_nome", valor: "Prefeitura Municipal de Lajes Pintadas", grupo: "institucional" },
        { chave: "cnpj", valor: "08.000.000/0001-00", grupo: "institucional" },
        { chave: "endereco_sede", valor: "Palácio Municipal Prefeito Alcebíades Bezerra, Praça Central, s/n - Centro, Lajes Pintadas - RN", grupo: "institucional" },
        { chave: "horario_funcionamento", valor: "Segunda a Sexta, das 08h às 13h", grupo: "institucional" },
        { chave: "contato_email", valor: "contato@lajespintadas.rn.gov.br", grupo: "institucional" },
        { chave: "contato_telefone", valor: "(84) 3000-0000", grupo: "institucional" }
    ];

    for (const c of configs) {
        await prisma.configuracao.upsert({
            where: { chave: c.chave },
            update: c,
            create: c
        });
    }
    console.log("✅ Configurações istitucionais ok.");

    const meds = [
        { nome: "Amoxicilina 500mg", categoria: "Básico", status: "disponivel", observacao: "Retirar nas UBS" },
        { nome: "Losartana Potássica 50mg", categoria: "Hiperdia", status: "disponivel", observacao: "Uso contínuo" },
        { nome: "Salbutamol (Aerossol)", categoria: "Respira Mais", status: "em-falta", observacao: "Previsão: 5 dias" }
    ];

    for (const m of meds) {
        const existing = await prisma.medicamento.findFirst({ where: { nome: m.nome } });
        if (!existing) await prisma.medicamento.create({ data: m });
    }
    console.log("✅ Medicamentos ok.");

    const frota = [
        { modelo: "Fiat Cronos", placa: "QGF-0000", ano: "2023", secretaria: "Gabinete do Prefeito", tipo: "Automóvel", status: "em-uso" },
        { modelo: "Ambulância Renault Master", placa: "MXH-0003", ano: "2024", secretaria: "Saúde", tipo: "Saúde / Emergência", status: "em-uso" }
    ];

    for (const v of frota) {
        await prisma.veiculo.upsert({ where: { placa: v.placa }, update: v, create: v });
    }
    console.log("✅ Frota ok.");

    const emendas = [
        { autor: "Deputado Estadual João Silva", valor: 150000, ano: 2024, tipo: "Estadual", objeto: "Aquisição de equipamentos hospitalares para o Centro de Saúde.", status: "Em Execução" },
        { autor: "Senador Marcos Pontes", valor: 300000, ano: 2023, tipo: "Federal", objeto: "Pavimentação asfáltica de ruas no bairro Centro.", status: "Concluído" },
    ];

    for (const e of emendas) {
        const existing = await prisma.emendaParlamentar.findFirst({ where: { autor: e.autor, objeto: e.objeto } });
        if (!existing) await prisma.emendaParlamentar.create({ data: e });
    }
    console.log("✅ Emendas ok.");

    const concursoData = {
        titulo: "Processo Seletivo Simplificado 001/2024",
        slug: "pss-001-2024",
        tipo: "pss",
        vagas: "15",
        dataPublicacao: new Date(),
        status: "aberto",
        ativo: true
    };
    const existingC = await prisma.concurso.findFirst({ where: { slug: concursoData.slug } });
    if (!existingC) await prisma.concurso.create({ data: concursoData });
    console.log("✅ Concursos ok.");

    const servicos = [
        { nome: "Emissão de IPTU", categoria: "Tributação", descricao: "Serviço de emissão da guia do Imposto Predial e Territorial Urbano.", local: "Sede da Prefeitura / Online", prazo: "Imediato", requisitos: "Número da Inscrição Imobiliária", ativo: true },
        { nome: "Solicitação de Iluminação Pública", categoria: "Obras", descricao: "Pedido de reparo ou instalação de lâmpadas em vias públicas.", local: "Secretaria de Obras / Aplicativo", prazo: "72 horas", requisitos: "Endereço e Referência", ativo: true },
    ];

    for (const s of servicos) {
        const existing = await prisma.servicoCarta.findFirst({ where: { nome: s.nome } });
        if (!existing) await prisma.servicoCarta.create({ data: s });
    }
    console.log("✅ Carta de Serviços ok.");

    console.log("\n--- Sucesso: Banco de Transparência Populado! ---");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
