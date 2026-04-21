import { prisma } from "@/lib/prisma";
import DesoneracoesClientPage from "./DesoneracoesClientPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Desonerações Fiscais | Transparência Lajes Pintadas",
  description: "Detalhamento de incentivos, isenções e anistias fiscais concedidas pelo município.",
};

export default async function DesoneracoesPage() {
  const renuncias = await prisma.renunciaFiscal.findMany({
    where: {
      ativo: true,
    },
    orderBy: {
      valorEstimado: "desc",
    },
  });

  const initialData = renuncias.map((r) => ({
    id: r.id,
    tipo: r.descricao,
    beneficiario: r.beneficiarios,
    fundamentoLegal: r.baseLegal,
    valorRenunciado: Number(r.valorEstimado),
    vigencia: r.vigencia,
    beneficiadosCount: r.beneficiarios, // Reaproveitando beneficiarios como string descritiva
  }));

  return <DesoneracoesClientPage initialData={initialData} />;
}
