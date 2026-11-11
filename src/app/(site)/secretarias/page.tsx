import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    HiOutlineBuildingOffice2,
    HiOutlineUser,
    HiOutlinePhone,
    HiOutlineEnvelope,
    HiOutlineClock,
    HiOutlineMapPin,
    HiOutlineArrowRight,
} from "react-icons/hi2";
import { getSecretariaIcon } from "@/lib/icons";
import { SECRETARIAS_OFICIAIS } from "@/lib/secretarias-data";
import { MUNICIPIO } from "@/config/municipio";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: `Secretarias Municipais | ${MUNICIPIO.nomeCompleto}`,
    description: `Conheça as secretarias da ${MUNICIPIO.nomeCompleto} e os serviços que cada pasta oferece ao cidadão.`,
};

export default async function SecretariasPage() {
    let secretarias: any[] = [];

    try {
        const dbSecretarias = await prisma.secretaria.findMany({
            orderBy: { ordem: "asc" },
        });
        if (dbSecretarias && dbSecretarias.length > 0) {
            secretarias = dbSecretarias;
        }
    } catch {
        // Fallback silencioso para o catálogo oficial
    }

    if (secretarias.length === 0) {
        secretarias = SECRETARIAS_OFICIAIS;
    } else {
        // Assegurar que pastas institucionais fixas (ex: Gabinete) estejam visíveis mesmo se ausentes no banco
        const existingSlugs = new Set(secretarias.map((s) => s.slug));
        for (const oficial of SECRETARIAS_OFICIAIS) {
            if (!existingSlugs.has(oficial.slug) && !oficial.aliases.some((a) => existingSlugs.has(a))) {
                secretarias.push(oficial);
            }
        }
        secretarias.sort((a, b) => (a.ordem ?? 99) - (b.ordem ?? 99));
    }

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            <PageHeader
                title="Secretarias Municipais"
                subtitle={`Estrutura administrativa, gestores e canais de atendimento da ${MUNICIPIO.nomeCompleto}/${MUNICIPIO.uf}.`}
                variant="premium"
                icon={<HiOutlineBuildingOffice2 className="w-7 h-7" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Secretarias Municipais" },
                ]}
            />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 mb-16 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {secretarias.map((s: any) => {
                        const IconCard = getSecretariaIcon(s.nome);

                        return (
                            <Link
                                key={s.id || s.slug}
                                href={`/secretarias/${s.slug}`}
                                className="group bg-white rounded-[24px] overflow-hidden shadow-gov hover:shadow-gov-hover transition-all duration-300 border border-[#DCE4EE] border-b-4 border-b-[#0072CE] hover:border-b-[#FACC15] flex flex-col h-full hover:-translate-y-1"
                            >
                                {/* Cabeçalho Institucional em Azul (Principal) e Amarelo (Secundária) */}
                                <div className="bg-gradient-to-r from-[#002B5C] via-[#003B73] to-[#0072CE] p-6 sm:p-7 text-white relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                                        <IconCard size={100} />
                                    </div>

                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-13 h-13 sm:w-14 sm:h-14 bg-white/15 border border-[#FACC15]/60 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-[#FACC15]">
                                            <IconCard size={26} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FACC15] mb-1">
                                                Órgão da Administração Direta
                                            </span>
                                            <h2 className="text-lg sm:text-xl font-black font-heading tracking-tight leading-snug text-white">
                                                {s.nome}
                                            </h2>
                                            {s.secretario && (
                                                <div className="flex items-center gap-1.5 text-sky-100 text-xs font-semibold mt-2">
                                                    <HiOutlineUser size={14} className="text-[#FACC15] shrink-0" />
                                                    <span>Titular: <strong className="text-white">{s.secretario}</strong></span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Corpo do Card com Informações */}
                                <div className="p-6 sm:p-7 space-y-5 flex-grow bg-white">
                                    <p className="text-[#526B84] text-xs sm:text-sm leading-relaxed line-clamp-3">
                                        {s.descricao}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                                        {s.telefone && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-[#F0F7FF] text-[#0072CE] flex items-center justify-center shrink-0 border border-[#DCE4EE]">
                                                    <HiOutlinePhone size={16} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B84]">
                                                        Telefone
                                                    </span>
                                                    <span className="text-[#0F2942] font-bold text-xs truncate">
                                                        {s.telefone}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {s.email && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-[#F0F7FF] text-[#0072CE] flex items-center justify-center shrink-0 border border-[#DCE4EE]">
                                                    <HiOutlineEnvelope size={16} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B84]">
                                                        E-mail
                                                    </span>
                                                    <span className="text-[#0F2942] font-bold text-xs truncate">
                                                        {s.email}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {s.horarioFuncionamento && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-[#F0F7FF] text-[#0072CE] flex items-center justify-center shrink-0 border border-[#DCE4EE]">
                                                    <HiOutlineClock size={16} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B84]">
                                                        Expediente
                                                    </span>
                                                    <span className="text-[#0F2942] font-bold text-xs">
                                                        {s.horarioFuncionamento}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {s.endereco && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-[#F0F7FF] text-[#0072CE] flex items-center justify-center shrink-0 border border-[#DCE4EE]">
                                                    <HiOutlineMapPin size={16} />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#526B84]">
                                                        Endereço
                                                    </span>
                                                    <span className="text-[#0F2942] font-bold text-xs leading-snug line-clamp-2">
                                                        {s.endereco}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rodapé do Card */}
                                <div className="px-6 sm:px-7 py-4 bg-[#F8FAFC] border-t border-[#DCE4EE] flex items-center justify-between">
                                    <span className="text-xs font-extrabold text-[#0072CE] group-hover:text-[#003B73] transition-colors">
                                        Acessar informações completas da secretaria
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-white border border-[#DCE4EE] text-[#0072CE] flex items-center justify-center shadow-sm group-hover:bg-[#0072CE] group-hover:text-[#FACC15] transition-all group-hover:translate-x-1">
                                        <HiOutlineArrowRight size={15} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
