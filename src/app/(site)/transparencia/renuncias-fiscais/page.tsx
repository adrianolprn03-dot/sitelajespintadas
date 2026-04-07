"use client";
import { 
    FaChartLine, FaFileAlt, FaInfoCircle, FaDownload, 
    FaExternalLinkAlt, FaCoins, FaHandHoldingDollar,
    FaArrowRight, FaShieldHalved, FaClockRotateLeft 
} from "react-icons/fa6";
import { BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Link from "next/link";

const CATEGORIAS = [
    {
        categoria: "Isenções Tributárias",
        itens: [
            { descricao: "Isenção de IPTU – Imóveis de entidades beneficentes", valorEstimado: 48500, baseLegal: "Lei 312/2018" },
            { descricao: "Isenção de ISS – Profissionais autônomos de baixa renda", valorEstimado: 22800, baseLegal: "LC 28/2017" },
            { descricao: "Isenção de ITBI – Programas habitacionais populares", valorEstimado: 15000, baseLegal: "Lei 298/2016" },
        ],
    },
    {
        categoria: "Reduções de Alíquotas",
        itens: [
            { descricao: "Redução de ISS – Microempreendedores Individuais (MEI)", valorEstimado: 31200, baseLegal: "LC Municipal 28/2017" },
            { descricao: "Desconto de IPTU – Pagamento à vista (5%)", valorEstimado: 18700, baseLegal: "Lei 312/2018" },
        ],
    },
    {
        categoria: "Anistias e Parcelamentos",
        itens: [
            { descricao: "Anistia de multas e juros – REFIS Municipal 2023", valorEstimado: 76400, baseLegal: "Lei 389/2023" },
        ],
    },
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const allItens = CATEGORIAS.flatMap(c => c.itens);
const totalGeral = allItens.reduce((s, i) => s + i.valorEstimado, 0);

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function RenunciasFiscaisPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Renúncias de Receitas"
                subtitle="Demonstrativo de isenções, reduções de alíquotas, anistias e subsídios, promovendo a transparência fiscal e o controle social."
                variant="premium"
                icon={<FaHandHoldingDollar />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Renúncias Fiscais" }
                ]}
            />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1240px] mx-auto px-6 py-12 -mt-12 relative z-30"
            >
                {/* Intro & Info Banner */}
                <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-orange-100 rounded-[2.5rem] p-10 mb-12 shadow-2xl shadow-orange-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="p-4 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/30">
                            <FaInfoCircle size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-4 uppercase">
                                Obrigação Legal <span className="text-orange-600">– Art. 14 da LRF</span>
                            </h2>
                            <p className="text-gray-500 leading-relaxed font-medium text-lg max-w-3xl mb-6">
                                A concessão de incentivos ou benefícios tributários que gerem renúncia de receita deve ser acompanhada do impacto orçamentário-financeiro, garantindo o equilíbrio das contas públicas de Lajes Pintadas.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl text-orange-700 text-[10px] font-black uppercase tracking-widest border border-orange-100">
                                    <FaShieldHalved /> Fiscalização Ativa
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                    <FaClockRotateLeft /> Atualizado 2024
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid de Resumo Bento */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Card Principal - Total */}
                    <div className="md:col-span-1 relative group overflow-hidden bg-white rounded-3xl p-8 shadow-2xl shadow-orange-500/5 border border-orange-100/50">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Renúncia Total</div>
                                <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                                    <FaCoins size={20} />
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-900 tracking-tighter mb-2">{fmt(totalGeral)}</div>
                                <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Exercício Financeiro</div>
                            </div>
                        </div>
                    </div>

                    {/* Card Secundário - Categorias */}
                    <div className="relative group overflow-hidden bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/80">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-30 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tipos de Benefício</div>
                                <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                    <FaChartLine size={20} />
                                </div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-gray-900 tracking-tighter mb-2">{CATEGORIAS.length}</div>
                                <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Categorias Ativas</div>
                            </div>
                        </div>
                    </div>

                    {/* Card Secundário - Registros */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registros</div>
                                <FaFileAlt size={22} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="mt-8">
                                <div className="text-4xl font-black tracking-tighter">{allItens.length}</div>
                                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mt-1">Benefícios Cadastrados</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Listagem por Categoria */}
                <div className="space-y-12 mb-16">
                    {CATEGORIAS.map((cat, ci) => (
                        <motion.div 
                            key={ci}
                            variants={itemVariants}
                            className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
                        >
                            <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-3">
                                        <span className="w-2 h-6 bg-orange-500 rounded-full" />
                                        {cat.categoria}
                                    </h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1 ml-5">
                                        Impacto Estimado por Setor
                                    </p>
                                </div>
                                <div className="bg-orange-50 text-orange-700 px-6 py-3 rounded-2xl border border-orange-100 font-black text-sm tracking-tighter shadow-sm">
                                    {fmt(cat.itens.reduce((s, i) => s + i.valorEstimado, 0))}
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                            <th className="px-10 py-6">Benefício / Descrição</th>
                                            <th className="px-10 py-6">Base Legal</th>
                                            <th className="px-10 py-6 text-right">Valor de Renúncia</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {cat.itens.map((item, ii) => (
                                            <tr key={ii} className="hover:bg-orange-50/30 transition-all duration-300 group">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-2 h-2 bg-orange-400 rounded-full group-hover:scale-150 transition-transform" />
                                                        <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                                                            {item.descricao}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 bg-gray-100/80 px-3 py-1.5 rounded-xl border border-gray-100 w-fit">
                                                        <FaFileAlt size={10} className="text-gray-400" /> {item.baseLegal}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <span className="font-black text-orange-600 text-sm tracking-tighter">{fmt(item.valorEstimado)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action Final */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-gradient-to-br from-orange-600 to-red-700 rounded-[3rem] p-12 text-white shadow-2xl shadow-orange-900/20 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                        <FaChartLine size={240} />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="text-[10px] font-black text-orange-200 uppercase tracking-[0.3em] mb-4">Relatória Consolidado</div>
                            <h2 className="text-5xl font-black tracking-tighter mb-2">{fmt(totalGeral)}</h2>
                            <p className="text-orange-100 text-lg font-medium opacity-80">Impacto total no orçamento municipal de Lajes Pintadas em 2024.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link
                                href="/transparencia/lrf"
                                className="flex items-center justify-center gap-3 bg-white text-orange-700 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-orange-50 transition-all group/btn"
                            >
                                <FaExternalLinkAlt /> Relatórios LRF <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                            <button className="flex items-center justify-center gap-3 bg-orange-800/50 hover:bg-orange-800 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 transition-all">
                                <FaDownload /> Exportar Tudo
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Banner de Conformidade */}
                <motion.div variants={itemVariants} className="mt-20">
                    <BannerPNTP />
                </motion.div>
            </motion.div>
        </div>
    );
}
