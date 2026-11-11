import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import {
    FaUserTie,
    FaPhone,
    FaEnvelope,
    FaLocationDot,
    FaClock,
    FaNewspaper,
    FaArrowLeft,
    FaCircleCheck,
} from "react-icons/fa6";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSecretariaIcon } from "@/lib/icons";
import DataAtualizacao from "@/components/transparencia/DataAtualizacao";
import { findSecretariaBySlugOrAlias, SECRETARIAS_OFICIAIS } from "@/lib/secretarias-data";
import { MUNICIPIO } from "@/config/municipio";

export const dynamic = "force-dynamic";

export default async function SecretariaDetalhesPage({
    params,
}: {
    params: { slug: string };
}) {
    const rawSlug = (params?.slug || "").toLowerCase().trim();
    const fallbackOficial = findSecretariaBySlugOrAlias(rawSlug);
    const canonicalSlug = fallbackOficial?.slug || rawSlug;

    let dbSecretaria: any = null;
    try {
        dbSecretaria = await prisma.secretaria.findFirst({
            where: {
                OR: [
                    { slug: rawSlug },
                    { slug: canonicalSlug },
                    { slug: { contains: rawSlug } },
                ],
            },
            include: {
                noticias: {
                    where: { publicada: true },
                    orderBy: { publicadoEm: "desc" },
                    take: 3,
                },
            },
        });
    } catch {
        // Fallback silencioso para o catálogo oficial de Lajes Pintadas
    }

    const secretaria = dbSecretaria
        ? {
              ...fallbackOficial,
              ...dbSecretaria,
              secretario: dbSecretaria.secretario || fallbackOficial?.secretario,
              email: dbSecretaria.email || fallbackOficial?.email || MUNICIPIO.email,
              telefone: dbSecretaria.telefone || fallbackOficial?.telefone || MUNICIPIO.telefone,
              endereco: dbSecretaria.endereco || fallbackOficial?.endereco || MUNICIPIO.endereco,
              horarioFuncionamento:
                  dbSecretaria.horarioFuncionamento ||
                  fallbackOficial?.horarioFuncionamento ||
                  `Segunda a Sexta-feira, das ${MUNICIPIO.horario}`,
          }
        : fallbackOficial;

    if (!secretaria) {
        notFound();
    }

    let servicos: string[] = [];
    if (typeof (secretaria as any).servicos === "string") {
        try {
            const parsed = JSON.parse((secretaria as any).servicos || "[]");
            if (Array.isArray(parsed) && parsed.length > 0) {
                servicos = parsed;
            }
        } catch {
            // Usa lista oficial caso não haja JSON válido
        }
    } else if (Array.isArray((secretaria as any).servicos)) {
        servicos = (secretaria as any).servicos;
    }

    if (servicos.length === 0 && fallbackOficial?.servicos) {
        servicos = fallbackOficial.servicos;
    }

    const IconHeader = getSecretariaIcon(secretaria.nome);
    const outrasSecretarias = SECRETARIAS_OFICIAIS.filter(
        (s) => s.slug !== secretaria.slug
    ).slice(0, 6);

    const dataRef = (secretaria as any).atualizadoEm || (secretaria as any).criadoEm;
    const dataFormatada = dataRef
        ? new Date(dataRef).toLocaleDateString("pt-BR")
        : new Date().toLocaleDateString("pt-BR");

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            <PageHeader
                title={secretaria.nome}
                subtitle="Atribuições institucionais, titular da pasta, serviços prestados e canais oficiais de atendimento."
                variant="premium"
                icon={<IconHeader className="w-7 h-7" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Secretarias", href: "/secretarias" },
                    { label: secretaria.nome },
                ]}
            />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 pb-20">
                <div className="mb-6">
                    <Link
                        href="/secretarias"
                        className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0072CE] hover:text-[#003B73] bg-white px-4 py-2 rounded-full border border-[#DCE4EE] shadow-sm transition-all"
                    >
                        <FaArrowLeft size={11} />
                        <span>Voltar para todas as Secretarias</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Coluna da Esquerda (8 colunas): Competências, Gestor e Serviços */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Sobre e Competências */}
                        <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#DCE4EE] shadow-gov">
                            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#0072CE] mb-1">
                                ATRIBUIÇÕES LEGAIS DA PASTA
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black text-[#0F2942] font-heading tracking-tight mb-4">
                                Sobre a Secretaria e Competências
                            </h2>
                            <p className="text-[#526B84] text-sm sm:text-base leading-relaxed">
                                {secretaria.descricao}
                            </p>
                        </section>

                        {/* Titular da Pasta / Estrutura de Gestão */}
                        <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#DCE4EE] border-l-4 border-l-[#0072CE] shadow-gov">
                            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#0072CE] mb-1">
                                GESTÃO MUNICIPAL
                            </span>
                            <h2 className="text-xl font-black text-[#0F2942] font-heading tracking-tight mb-5">
                                Titular da Pasta
                            </h2>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-[#F4F7FB] p-5 rounded-2xl border border-[#DCE4EE]">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#0072CE] to-[#003B73] rounded-2xl shadow-md flex items-center justify-center text-[#FACC15] shrink-0 ring-2 ring-[#FACC15]">
                                    <FaUserTie size={28} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-extrabold text-[#0072CE] uppercase tracking-widest block mb-0.5">
                                        {(secretaria as any).cargo || "Secretário(a) Municipal Responsável"}
                                    </span>
                                    <h3 className="text-lg sm:text-xl font-black text-[#0F2942] font-heading">
                                        {secretaria.secretario || "Gestão Municipal"}
                                    </h3>
                                    <p className="text-[#526B84] text-xs sm:text-sm mt-1 leading-relaxed">
                                        Responsável pela direção superior da pasta, coordenação técnica das equipes e execução das políticas públicas no município de {MUNICIPIO.nome}/{MUNICIPIO.uf}.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Serviços Oferecidos pela Secretaria */}
                        {servicos.length > 0 && (
                            <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#DCE4EE] shadow-gov">
                                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#0072CE] mb-1">
                                    ATENDIMENTO AO CIDADÃO
                                </span>
                                <h2 className="text-xl font-black text-[#0F2942] font-heading tracking-tight mb-5">
                                    Principais Serviços e Ações da Pasta
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {servicos.map((s: string, i: number) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3 p-4 bg-[#F8FAFC] border border-[#DCE4EE] rounded-2xl"
                                        >
                                            <FaCircleCheck
                                                className="text-[#0072CE] shrink-0 mt-0.5"
                                                size={15}
                                            />
                                            <span className="text-xs sm:text-sm font-bold text-[#0F2942] leading-snug">
                                                {s}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section>
                            <DataAtualizacao variant="card" dataAtualizacao={dataFormatada} />
                        </section>
                    </div>

                    {/* Coluna da Direita (4 colunas): Canais de Atendimento e Outras Secretarias */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-br from-[#002B5C] via-[#003B73] to-[#0072CE] rounded-[24px] p-6 sm:p-8 text-white shadow-xl border-t-4 border-t-[#FACC15]">
                            <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#FACC15] mb-1">
                                ATENDIMENTO PRESENCIAL E DIGITAL
                            </span>
                            <h3 className="text-xl font-black font-heading tracking-tight mb-6">
                                Canais de Contato
                            </h3>

                            <div className="space-y-5 text-sm">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center shrink-0 text-[#FACC15]">
                                        <FaPhone size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200">
                                            Telefone / Atendimento
                                        </p>
                                        <p className="font-bold text-white mt-0.5">
                                            {secretaria.telefone || MUNICIPIO.telefone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center shrink-0 text-[#FACC15]">
                                        <FaEnvelope size={14} />
                                    </div>
                                    <div className="break-all">
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200">
                                            E-mail Institucional
                                        </p>
                                        <p className="font-bold text-white text-xs sm:text-sm mt-0.5">
                                            {secretaria.email || MUNICIPIO.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center shrink-0 text-[#FACC15]">
                                        <FaClock size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200">
                                            Horário de Expediente
                                        </p>
                                        <p className="font-bold text-white text-xs sm:text-sm mt-0.5">
                                            {secretaria.horarioFuncionamento ||
                                                `Segunda a Sexta-feira, das ${MUNICIPIO.horario}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center shrink-0 text-[#FACC15]">
                                        <FaLocationDot size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-sky-200">
                                            Endereço de Atendimento
                                        </p>
                                        <p className="text-xs sm:text-sm font-bold text-white leading-relaxed mt-0.5">
                                            {secretaria.endereco ||
                                                `${MUNICIPIO.endereco}, ${MUNICIPIO.nome}/${MUNICIPIO.uf}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-7 pt-6 border-t border-white/15 space-y-2.5">
                                <Link
                                    href="/servicos/ouvidoria"
                                    className="block text-center bg-[#FACC15] hover:bg-amber-300 text-[#0F2942] py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-colors shadow"
                                >
                                    Falar com a Ouvidoria
                                </Link>
                                <Link
                                    href="/servicos/esic"
                                    className="block text-center bg-white/15 hover:bg-white/25 text-white py-2.5 px-4 rounded-xl font-bold text-xs border border-white/25 transition-colors"
                                >
                                    Solicitar Informação (e-SIC)
                                </Link>
                            </div>
                        </div>

                        {/* Notícias da Pasta (se houver) */}
                        {(secretaria as any).noticias && (secretaria as any).noticias.length > 0 && (
                            <div className="p-6 bg-white rounded-[24px] border border-[#DCE4EE] shadow-gov">
                                <h4 className="text-xs font-extrabold text-[#0F2942] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FaNewspaper className="text-[#0072CE]" /> Notícias da Pasta
                                </h4>
                                <div className="space-y-4">
                                    {(secretaria as any).noticias.map((n: any) => (
                                        <Link
                                            key={n.id}
                                            href={`/noticias/${n.slug}`}
                                            className="block group pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                                        >
                                            <p className="text-[10px] font-bold text-[#0072CE] uppercase mb-0.5">
                                                {n.publicadoEm
                                                    ? new Date(n.publicadoEm).toLocaleDateString("pt-BR")
                                                    : "Recente"}
                                            </p>
                                            <h5 className="font-bold text-xs sm:text-sm text-[#0F2942] group-hover:text-[#0072CE] leading-snug transition-colors line-clamp-2">
                                                {n.titulo}
                                            </h5>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navegação Rápida para Outras Secretarias */}
                        <div className="p-6 bg-white rounded-[24px] border border-[#DCE4EE] shadow-gov">
                            <h4 className="text-xs font-extrabold text-[#0F2942] uppercase tracking-wider mb-3.5">
                                Outras Secretarias Municipais
                            </h4>
                            <div className="space-y-1.5">
                                {outrasSecretarias.map((sec) => (
                                    <Link
                                        key={sec.slug}
                                        href={`/secretarias/${sec.slug}`}
                                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#526B84] hover:text-[#0072CE] hover:bg-[#F0F7FF] transition-colors"
                                    >
                                        <span className="truncate pr-2">{sec.nome.replace("Secretaria Municipal de ", "")}</span>
                                        <span className="text-[#0072CE] font-bold">→</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
