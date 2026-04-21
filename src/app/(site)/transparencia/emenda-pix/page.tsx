import { prisma } from "@/lib/prisma";
import EmendaPixClientPage from "./EmendaPixClientPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Emendas PIX | Transparência Lajes Pintadas",
  description: "Detalhamento das transferências especiais (Emendas PIX) recebidas pelo município.",
};

export default async function EmendaPixPage() {
  const emendas = await prisma.emendaParlamentar.findMany({
    where: {
      tipoEmenda: "Transferência Especial",
    },
    orderBy: {
      anoEmenda: "desc",
    },
  });

  // Mapear para o tipo esperado pelo Client Component
  const initialData = emendas.map((e) => ({
    id: e.id,
    codigoEmenda: e.codigoEmenda,
    anoEmenda: e.anoEmenda,
    autorNome: e.autorNome,
    tipoEmenda: e.tipoEmenda,
    objeto: e.objeto,
    funcaoGoverno: e.funcaoGoverno,
    valorPrevisto: Number(e.valorPrevisto),
    valorEmpenhado: Number(e.valorEmpenhado),
    valorLiquidado: Number(e.valorLiquidado),
    valorPago: Number(e.valorPago),
    situacaoExecucao: e.situacaoExecucao,
    urlFonteOficial: e.urlFonteOficial,
    favorecidoNome: e.favorecidoNome,
    orgaoConcedente: e.orgaoConcedente,
  }));

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-teal-500"></span>
            <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em]">PNTP Ouro 2025</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Emendas <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">PIX</span>
          </h1>
          <p className="text-gray-500 font-bold max-w-2xl leading-relaxed">
            Consulte o recebimento e a execução das transferências especiais (modalidade PIX) enviadas por parlamentares federais ao município através do sistema TransfereGov.
          </p>
        </header>

        <EmendaPixClientPage initialData={initialData} />
        
        {/* Nota Explicativa */}
        <div className="mt-12 p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex gap-6">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-xl">💡</span>
          </div>
          <div className="space-y-2">
            <h4 className="font-black text-blue-900 text-sm uppercase tracking-wider">O que são Emendas PIX?</h4>
            <p className="text-xs font-bold text-blue-700/70 leading-relaxed">
              São transferências especiais diretas do Governo Federal para o Município, sem finalidade pré-definida (objeto livre), exceto para pagamento de folha ou dívidas previdenciárias. A transparência destas verbas é um requisito essencial para a avaliação do PNTP (Programa Nacional de Transparência Pública).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
