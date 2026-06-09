export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { 
    FileText, Building2, Shield, Award, Landmark, ChevronRight, Info, Mail, Phone, Clock, MapPin
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getSecretariaIcon } from "@/lib/icons";

export const metadata: Metadata = {
    title: "Competências e Atribuições | Portal da Transparência",
    description: "Atribuições e funções legais da Prefeitura Municipal de Lajes Pintadas – RN e de suas respectivas secretarias.",
};

const competenciasGerais = [
    "Administrar os serviços públicos municipais com eficiência, transparência e responsabilidade social.",
    "Elaborar e executar as leis orçamentárias: Plano Plurianual (PPA), Lei de Diretrizes Orçamentárias (LDO) e Lei Orçamentária Anual (LOA).",
    "Garantir o acesso universal à saúde, educação básica de qualidade, assistência social, habitação e infraestrutura urbana.",
    "Arrecadar tributos de competência municipal e aplicar os recursos em conformidade com as diretrizes legais e fiscais.",
    "Promover o ordenamento territorial, o desenvolvimento urbano sustentável e a preservação do meio ambiente municipal.",
    "Assegurar a transparência ativa e passiva e a garantia do direito de acesso à informação nos termos da Lei Federal nº 12.527/2011.",
    "Celebrar convênios, contratos e parcerias com esferas estadual, federal e com a sociedade civil para o progresso do município."
];

async function getSecretarias() {
    try {
        return await prisma.secretaria.findMany({
            where: { ativa: true },
            orderBy: { ordem: "asc" },
            select: {
                id: true,
                nome: true,
                slug: true,
                descricao: true,
                secretario: true,
                email: true,
                telefone: true,
                endereco: true,
                horarioFuncionamento: true
            }
        });
    } catch (error) {
        console.error("Erro ao carregar secretarias:", error);
        return [];
    }
}

export default async function CompetenciasPage() {
    const secretarias = await getSecretarias();

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Competências e Atribuições"
                subtitle="Atribuições legais, competências institucionais do município e funções atribuídas a cada secretaria e órgão municipal."
                variant="premium"
                icon={<FileText className="text-white" size={32} />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Competências" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12 space-y-12">

                {/* Banner de Conformidade Legal */}
                <div className="bg-blue-950 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                        <Shield size={26} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Lei de Acesso à Informação — Art. 8º, I</p>
                        <p className="text-white font-bold text-sm leading-relaxed">
                            Esta seção atende ao <strong>Art. 8º, §1º, Inciso I da Lei nº 12.527/2011 (LAI)</strong> e aos critérios de transparência pública, 
                            exibindo as competências legais oficiais da prefeitura e de todas as pastas governamentais cadastradas.
                        </p>
                    </div>
                </div>

                {/* Grid Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Lado Esquerdo - Competências Gerais */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-gray-200/40 border border-white sticky top-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                    <Landmark size={20} />
                                </span>
                                <h3 className="text-base font-black text-gray-800 uppercase tracking-tighter">O Município</h3>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-6">
                                Competências <br/><span className="text-indigo-600 italic">Institucionais Gerais</span>
                            </h4>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8 leading-relaxed">
                                Funções constitucionais do Poder Executivo estabelecidas pela Lei Orgânica Municipal.
                            </p>
                            
                            <ul className="space-y-6">
                                {competenciasGerais.map((c, i) => (
                                    <li key={i} className="flex items-start gap-4 group">
                                        <span className="shrink-0 w-6 h-6 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {i + 1}
                                        </span>
                                        <p className="text-gray-600 text-xs font-semibold leading-relaxed">{c}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Lado Direito - Competências por Secretaria */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/40 border border-white">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <span className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                                        <Building2 size={22} />
                                    </span>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Secretarias Municipais</h2>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Órgãos Administrativos</p>
                                    </div>
                                </div>
                                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {secretarias.length} Ativas
                                </span>
                            </div>

                            {secretarias.length > 0 ? (
                                <div className="space-y-8">
                                    {secretarias.map((s, idx) => {
                                        const Icon = getSecretariaIcon(s.nome);
                                        return (
                                            <div 
                                                key={s.id} 
                                                className="group border border-gray-100 hover:border-blue-100 bg-gray-50/50 hover:bg-white rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500"
                                            >
                                                {/* Header da Secretaria */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100/80 pb-6 mb-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                                            <Icon size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-gray-800 text-base leading-snug group-hover:text-blue-600 transition-colors uppercase">
                                                                {s.nome}
                                                            </h3>
                                                            {s.secretario && (
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                                                    Secretário(a): <span className="text-gray-600 font-black">{s.secretario}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Competências / Descrição da Pasta */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-2">Competências e Atribuições</span>
                                                        <div className="text-gray-600 text-xs font-semibold leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-blue-500/20 group-hover:border-blue-500 transition-colors duration-500">
                                                            {s.descricao || "Nenhuma competência ou atribuição específica cadastrada para este órgão no momento."}
                                                        </div>
                                                    </div>

                                                    {/* Informações Auxiliares (Endereço, Contato se houver) */}
                                                    {(s.endereco || s.email || s.telefone || s.horarioFuncionamento) && (
                                                        <div className="pt-6 mt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-gray-500 font-semibold">
                                                            {s.endereco && (
                                                                <div className="flex items-start gap-2">
                                                                    <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
                                                                    <span className="line-clamp-2">Endereço: {s.endereco}</span>
                                                                </div>
                                                            )}
                                                            {s.horarioFuncionamento && (
                                                                <div className="flex items-center gap-2">
                                                                    <Clock size={12} className="text-gray-400 shrink-0" />
                                                                    <span>Atendimento: {s.horarioFuncionamento}</span>
                                                                </div>
                                                            )}
                                                            {s.email && (
                                                                <div className="flex items-center gap-2">
                                                                    <Mail size={12} className="text-gray-400 shrink-0" />
                                                                    <span className="break-all">{s.email}</span>
                                                                </div>
                                                            )}
                                                            {s.telefone && (
                                                                <div className="flex items-center gap-2">
                                                                    <Phone size={12} className="text-gray-400 shrink-0" />
                                                                    <span>{s.telefone}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Botão de Ação */}
                                                <div className="mt-8 flex justify-end">
                                                    <Link 
                                                        href={`/secretarias/${s.slug}`}
                                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md border border-blue-100 hover:border-blue-600 transition-all active:scale-95"
                                                    >
                                                        Ver Serviços e Estrutura <ChevronRight size={12} />
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-3xl p-10 text-center border border-gray-100">
                                    <Info size={32} className="text-gray-300 mx-auto mb-4" />
                                    <p className="text-sm text-gray-500 font-bold">Nenhuma secretaria municipal cadastrada ou ativa no sistema.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
