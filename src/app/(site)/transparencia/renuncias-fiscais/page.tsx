import { prisma } from "@/lib/prisma";
import RenunciasClientPage from "./RenunciasClientPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Renúncias de Receitas | Transparência Lajes Pintadas",
  description: "Demonstrativo de isenções, reduções de alíquotas, anistias e subsídios fiscais.",
};

export default async function RenunciasFiscaisPage() {
  const renuncias = await prisma.renunciaFiscal.findMany({
    where: {
      ativo: true,
    },
    orderBy: [
      { categoria: "asc" },
      { valorEstimado: "desc" }
    ],
  });

  const initialData = renuncias.map((r) => ({
    id: r.id,
    descricao: r.descricao,
    categoria: r.categoria,
    baseLegal: r.baseLegal,
    valorEstimado: Number(r.valorEstimado),
    beneficiarios: r.beneficiarios,
    vigencia: r.vigencia,
    ano: r.ano,
  }));

  return <RenunciasClientPage initialData={initialData} />;
}
