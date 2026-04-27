import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import { FaChartBar, FaStar, FaUsers } from "react-icons/fa";

export const metadata = {
    title: "Relatório de Pesquisa de Satisfação - Admin",
};

// Helper para formatar rótulos
const getLabel = (key: string) => {
    const labels: Record<string, string> = {
        avaliacaoGestao: "Gestão Municipal",
        avaliacaoOuvidoria: "Ouvidoria",
        satisfacaoTransparencia: "Portal da Transparência",
        avaliacaoLixo: "Coleta de Lixo",
        avaliacaoLimpezaRuas: "Limpeza das Ruas",
        avaliacaoPatrimonio: "Conservação do Patrimônio",
        avaliacaoPracas: "Praças e Parques",
        avaliacaoCultura: "Eventos Culturais",
        avaliacaoIluminacao: "Iluminação Pública",
        avaliacaoSeguranca: "Segurança Pública",
        avaliacaoEsporte: "Esporte e Lazer",
        avaliacaoSaude: "Saúde Pública",
        avaliacaoEducacao: "Educação Pública",
        avaliacaoAssistenciaSocial: "Assistência Social",
    };
    return labels[key] || key;
};

export default async function PesquisaSatisfacaoAdmin() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/admin/login");
    }

    // Buscar as médias e a contagem total
    const aggregates = await prisma.pesquisaSatisfacao.aggregate({
        _count: {
            id: true,
        },
        _avg: {
            avaliacaoGestao: true,
            avaliacaoOuvidoria: true,
            satisfacaoTransparencia: true,
            avaliacaoLixo: true,
            avaliacaoLimpezaRuas: true,
            avaliacaoPatrimonio: true,
            avaliacaoPracas: true,
            avaliacaoCultura: true,
            avaliacaoIluminacao: true,
            avaliacaoSeguranca: true,
            avaliacaoEsporte: true,
            avaliacaoSaude: true,
            avaliacaoEducacao: true,
            avaliacaoAssistenciaSocial: true,
        },
    });

    const totalVotos = aggregates._count.id;
    const medias = aggregates._avg;

    // Converte o objeto de médias em um array ordenado pela maior média
    const metrics = Object.entries(medias)
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => ({
            key,
            label: getLabel(key),
            value: Number(value?.toFixed(1) || 0),
        }))
        .sort((a, b) => b.value - a.value);

    // Média geral de todas as categorias
    const mediaGeral = metrics.length > 0
        ? (metrics.reduce((acc, curr) => acc + curr.value, 0) / metrics.length).toFixed(1)
        : "0.0";

    return (
        <div className="space-y-6">
            <PageHeader
                title="Resultados da Pesquisa de Satisfação"
                subtitle="Dashboard analítico de satisfação dos cidadãos"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin" },
                    { label: "Pesquisa de Satisfação" },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Total Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                        <FaUsers />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total de Participantes</p>
                        <h3 className="text-3xl font-black text-gray-800">{totalVotos}</h3>
                    </div>
                </div>

                {/* Média Geral Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl">
                        <FaStar />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Média Geral (1 a 5)</p>
                        <h3 className="text-3xl font-black text-gray-800">{mediaGeral}</h3>
                    </div>
                </div>
            </div>

            {/* Barras de Média por Categoria */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                    <FaChartBar className="text-primary-600" />
                    <h2 className="text-lg font-bold text-gray-800">Médias por Categoria</h2>
                </div>
                <div className="p-6">
                    {totalVotos === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            Nenhuma pesquisa foi respondida ainda.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {metrics.map((metric) => {
                                const percentage = (metric.value / 5) * 100;
                                let colorClass = "bg-green-500";
                                if (metric.value < 3) colorClass = "bg-red-500";
                                else if (metric.value < 4) colorClass = "bg-amber-500";

                                return (
                                    <div key={metric.key} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-gray-700">{metric.label}</span>
                                            <span className="text-sm font-black text-gray-900">{metric.value} <span className="text-gray-400 font-medium text-xs">/ 5</span></span>
                                        </div>
                                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
