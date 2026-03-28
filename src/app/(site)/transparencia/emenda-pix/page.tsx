"use client";

import { useState, useEffect } from "react";
import { FaQrcode as FaPix, FaMoneyBillWave, FaCalendarAlt, FaUserTie, FaBuilding, FaHandHoldingHeart, FaSearch, FaFileInvoiceDollar, FaRegLightbulb } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type EmendaPix = {
    id: string;
    ano: number;
    autor: string;
    valor: number;
    objeto: string;
    status: string;
    dataRecebimento?: string;
};

const mockEmendasPix: EmendaPix[] = [
    {
        id: "1",
        ano: 2024,
        autor: "Transferência Especial - Bancada RN",
        valor: 450000.00,
        objeto: "Estruturação de Unidades de Saúde e custeio de ações de atenção básica.",
        status: "Recebido",
        dataRecebimento: "15/04/2024"
    },
    {
        id: "2",
        ano: 2024,
        autor: "Emenda Individual - Deputado Federal",
        valor: 200000.00,
        objeto: "Ações de custeio para assistência social e combate à insegurança alimentar.",
        status: "Em Processamento",
    },
    {
        id: "3",
        ano: 2025,
        autor: "Transferência Especial - Governo Federal",
        valor: 320000.00,
        objeto: "Investimento em infraestrutura urbana e pavimentação de vias públicas.",
        status: "Previsto",
    }
];

export default function EmendaPixPage() {
    const [items, setItems] = useState<EmendaPix[]>(mockEmendasPix);
    const [search, setSearch] = useState("");
    const [totalValor, setTotalValor] = useState(0);

    useEffect(() => {
        const calculateTotal = () => {
            const sum = items.reduce((acc, curr) => acc + curr.valor, 0);
            setTotalValor(sum);
        };
        calculateTotal();
    }, [items]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
    };

    const filteredItems = items.filter(i => 
        i.autor.toLowerCase().includes(search.toLowerCase()) || 
        i.objeto.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f1f5f9] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Transferências Especiais (PIX)"
                subtitle="Consulte os recursos federais destinados diretamente ao tesouro municipal via Emendas PIX."
                variant="premium"
                icon={<FaPix className="text-secondary-400" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Emendas PIX" }
                ]}
            />

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                
                {/* Dashboard Header */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                                <FaFileInvoiceDollar size={24} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Captado</p>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tighter">{formatCurrency(totalValor)}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                                <FaHandHoldingHeart size={24} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Qtd. de Emendas</p>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tighter">{items.length} Repasses</h3>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                                <FaCalendarAlt size={24} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Último Exercício</p>
                            <h3 className="text-2xl font-black text-gray-800 tracking-tighter">2024 / 2025</h3>
                        </div>
                    </div>

                    <div className="bg-blue-600 p-8 rounded-[2rem] shadow-xl shadow-blue-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2">Transparência Ativa</p>
                            <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tighter">PNTP · Criterio Nacional</h3>
                            <div className="mt-4 flex items-center gap-2 text-[8px] font-black text-blue-200 uppercase tracking-widest">
                                <span>Ver Radar da Transparência</span>
                                <div className="w-4 h-0.5 bg-secondary-400"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/60 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-8 md:p-12 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gray-50/30">
                        <div className="max-w-md w-full">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3 block ml-2">Filtrar Documentos</label>
                            <div className="relative group">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Pesquise por autor ou objeto da emenda..."
                                    className="w-full pl-14 pr-8 py-5 bg-white border border-gray-200 rounded-[2rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Recebidas</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Previstas</span>
                        </div>
                    </div>

                    {/* Desktop List Layout */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#fcfdfe] border-b border-gray-100">
                                <tr>
                                    <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Exercício / Autor</th>
                                    <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Objeto da Transferência</th>
                                    <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-12 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Valor Repassado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <AnimatePresence>
                                    {filteredItems.map((e, idx) => (
                                        <motion.tr 
                                            key={e.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-blue-50/20 transition-colors group"
                                        >
                                            <td className="px-12 py-10 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 w-fit mb-2">{e.ano}</span>
                                                    <span className="font-black text-gray-800 text-sm whitespace-nowrap">{e.autor}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 align-top max-w-lg">
                                                <div className="group-hover:translate-x-1 transition-transform">
                                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                                        {e.objeto}
                                                    </p>
                                                    {e.dataRecebimento && (
                                                        <div className="mt-3 flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                                            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                                                            Liquidado em {e.dataRecebimento}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 align-top">
                                                <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                    e.status === 'Recebido' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                                    e.status === 'Previsto' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    {e.status}
                                                </span>
                                            </td>
                                            <td className="px-12 py-10 align-top text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-lg font-black text-gray-800 tracking-tighter">{formatCurrency(e.valor)}</span>
                                                    <Link 
                                                        href="/transparencia/despesas" 
                                                        className="mt-2 text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-700 flex items-center gap-2 group-hover:underline transition-all"
                                                    >
                                                        Ver Execução <ArrowRight size={10} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* No items found */}
                    {filteredItems.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <FaSearch size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Nenhuma emenda encontrada</h3>
                            <p className="text-gray-400 text-sm font-medium mt-2">Tente buscar por termos mais genéricos.</p>
                        </div>
                    )}
                </div>

                {/* Legal and compliance footer */}
                <div className="mt-24 bg-gray-50/50 p-12 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-gray-100">
                            <FaHandHoldingHeart size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Legal</p>
                            <p className="text-sm font-black text-gray-700 tracking-tight">Emenda à Constituição nº 105/2019</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        {['Portal da Transparência', 'PNTP 2025', 'Lei de Acesso'].map(tag => (
                            <span key={tag} className="text-[9px] font-black text-gray-400 bg-white px-4 py-2 rounded-xl border border-gray-100 uppercase tracking-widest">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ArrowRight({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    );
}
