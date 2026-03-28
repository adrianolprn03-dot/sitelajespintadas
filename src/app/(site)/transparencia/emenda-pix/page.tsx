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
    const [loading, setLoading] = useState(false);
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
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Emendas PIX"
                subtitle="Acompanhe as Transferências Especiais destinadas diretamente ao tesouro municipal para aplicação em políticas públicas."
                variant="premium"
                icon={<FaPix className="text-secondary-400" />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Emenda PIX" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* Info Card Explanatório */}
                <div className="bg-blue-600 rounded-[2.5rem] p-8 md:p-12 mb-16 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 border border-white/30 text-secondary-400">
                            <FaPix size={40} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-3">O que são Emendas PIX?</h2>
                            <p className="text-blue-50 font-medium text-base leading-relaxed opacity-90">
                                Oficialmente chamadas de <strong className="text-secondary-300">Transferências Especiais</strong>, são recursos federais repassados diretamente ao município sem a necessidade de convênios prévios, permitindo maior agilidade na execução de obras e serviços para a população de Lajes Pintadas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtros e Destaque */}
                <div className="flex flex-col lg:flex-row gap-8 mb-16">
                    <div className="flex-1 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0088b9] ml-2">Pesquisar Emendas</label>
                            <div className="relative group">
                                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#01b0ef] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Filtrar por autor ou objeto da emenda..."
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-[#01b0ef]/10 focus:bg-white transition-all outline-none"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-80 bg-[#002241] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#01b0ef]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-secondary-400/20 rounded-xl flex items-center justify-center">
                                    <FaFileInvoiceDollar className="text-secondary-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary-300">Total em PIX</span>
                            </div>
                            <h4 className="text-3xl font-black tracking-tighter mb-1">{formatCurrency(totalValor)}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Exercício 2024-2025</p>
                        </div>
                    </div>
                </div>

                {/* Grid de Emendas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredItems.map((e, idx) => (
                            <motion.div
                                key={e.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${idx % 2 === 0 ? 'bg-blue-600' : 'bg-emerald-500'}`} />
                                
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <FaCalendarAlt className="text-amber-500" /> {e.ano}
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                        e.status === 'Recebido' ? 'bg-green-50 text-green-600 border-green-100' : 
                                        e.status === 'Previsto' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                        {e.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#01b0ef] group-hover:bg-[#01b0ef] group-hover:text-white transition-all shadow-inner border border-gray-100">
                                        <FaUserTie size={22} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Autor da Emenda</p>
                                        <h3 className="font-black text-[#002241] text-sm leading-tight uppercase tracking-tight group-hover:text-[#01b0ef] transition-colors line-clamp-2">
                                            {e.autor}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                                        <FaRegLightbulb className="text-amber-400 shrink-0 mt-1" />
                                        <p className="text-xs font-medium text-gray-500 leading-relaxed text-left">
                                            {e.objeto}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor do Repasse</p>
                                        <p className="text-xl font-black text-[#002241] tracking-tighter">{formatCurrency(e.valor)}</p>
                                    </div>
                                    <Link 
                                        href="/transparencia/despesas" 
                                        className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-[#01b0ef] hover:text-white transition-all shadow-sm"
                                        title="Ver execução financeira"
                                    >
                                        <FaBuilding size={16} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Rodapé Informativo */}
                <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 mb-6">
                        <FaHandHoldingHeart className="text-secondary-400 animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Transparência Ativa · Lajes Pintadas</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
