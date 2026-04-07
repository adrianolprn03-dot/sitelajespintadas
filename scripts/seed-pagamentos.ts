import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FORNECEDORES = [
    { nome: 'Distribuidora de Alimentos Santa Luzia', cnpj: '01.234.567/0001-89' },
    { nome: 'Construtora Vale do Rio SA', cnpj: '11.222.333/0001-44' },
    { nome: 'Farmácia Central de Lajes LTDA', cnpj: '22.333.444/0001-55' },
    { nome: 'Auto Posto Lajes Pintadas', cnpj: '33.444.555/0001-66' },
    { nome: 'Papelaria e Livraria Estudante', cnpj: '44.555.666/0001-77' },
    { nome: 'Cooperativa de Transporte Potiguar', cnpj: '55.666.777/0001-88' },
    { nome: 'Serviços de Manutenção Predial EIRELI', cnpj: '66.777.888/0001-99' },
    { nome: 'Tecnologia da Informação e Sistemas SA', cnpj: '77.888.999/0001-00' },
];

const SECRETARIAS = [
    'Administração e Planejamento',
    'Educação e Cultura',
    'Saúde',
    'Obras e Infraestrutura',
    'Agricultura e Meio Ambiente',
    'Assistência Social',
];

const DESCRICOES = [
    'Aquisição de materiais de limpeza e higiene',
    'Execução de serviços de pavimentação asfáltica',
    'Fornecimento de merenda escolar para rede municipal',
    'Aquisição de medicamentos para farmácia básica',
    'Serviços de consultoria técnica especializada',
    'Locação de veículos para transporte escolar',
    'Fornecimento de combustíveis e lubrificantes',
    'Serviços de manutenção em poços artesianos',
];

async function main() {
    console.log('Limpando tabela Pagamento...');
    await prisma.pagamento.deleteMany({});
    console.log('Limpeza concluída.');

    const pagamentos = [];
    let ordemCounter = 1;

    // Gerar registros para Jan, Fev, Mar e Abr de 2026
    for (let mes = 1; mes <= 4; mes++) {
        const numRegistros = 5 + Math.floor(Math.random() * 8);
        for (let i = 0; i < numRegistros; i++) {
            const fornecedor = FORNECEDORES[Math.floor(Math.random() * FORNECEDORES.length)];
            const secretaria = SECRETARIAS[Math.floor(Math.random() * SECRETARIAS.length)];
            const descricao = DESCRICOES[Math.floor(Math.random() * DESCRICOES.length)];
            
            const diaEmpenho = 1 + Math.floor(Math.random() * 5);
            const diaLiquidacao = diaEmpenho + 5 + Math.floor(Math.random() * 10);
            const dataEmpenho = new Date(2026, mes - 1, diaEmpenho);
            const dataLiquidacao = new Date(2026, mes - 1, diaLiquidacao);
            
            // Decidir status
            let status = 'pago';
            let dataPagamento = new Date(2026, mes - 1, diaLiquidacao + 3);
            
            if (mes === 4 || (mes === 3 && Math.random() > 0.7)) {
                status = Math.random() > 0.8 ? 'suspenso' : 'pendente';
                dataPagamento = null as any;
            }

            pagamentos.push({
                ordem: ordemCounter++,
                fornecedor: fornecedor.nome,
                cnpj: fornecedor.cnpj,
                descricao,
                valor: 500 + Math.random() * 25000,
                dataEmpenho,
                dataLiquidacao,
                dataPagamento,
                secretaria,
                status
            });
        }
    }

    console.log('Inserindo pagamentos...');
    await prisma.pagamento.createMany({ data: pagamentos });
    console.log(`✅ Inseridos ${pagamentos.length} registros de pagamentos.`);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
