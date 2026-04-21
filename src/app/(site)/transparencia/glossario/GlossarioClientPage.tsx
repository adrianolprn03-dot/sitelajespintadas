"use client";
import { useState } from "react";
import { FaBook, FaSearch } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import ExportButtons from "@/components/transparencia/ExportButtons";

type Termo = {
    id: string;
    termo: string;
    definicao: string;
};

export default function GlossarioClientPage({ initialData }: { initialData: Termo[] }) {
    const [search, setSearch] = useState("");

    const filteredItems = initialData.filter(item => 
        item.termo.toLowerCase().includes(search.toLowerCase()) ||
        item.definicao.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white font-['Montserrat',sans-serif]">
            <PageHeader
                title="Glossário de Termos"
                subtitle="Dicionário técnico para auxiliar na compreensão dos documentos e relatórios da administração pública."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Glossário" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 pt-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <div className="relative w-full md:w-96 group">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#01b0ef] transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar termos no glossário..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#01b0ef]/20 focus:border-[#01b0ef] transition-all font-medium text-gray-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <ExportButtons data={filteredItems} filename="glossario_lajes_pintadas" />
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold italic">Nenhum termo encontrado para sua busca.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((t) => (
                            <div key={t.id} className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:border-[#01b0ef] transition-all hover:shadow-xl hover:shadow-blue-900/5 group">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#01b0ef] shadow-sm mb-4 group-hover:bg-[#01b0ef] group-hover:text-white transition-all">
                                    <FaBook size={14} />
                                </div>
                                <h3 className="font-black text-[#0088b9] uppercase tracking-widest text-[11px] mb-3 group-hover:text-[#01b0ef] transition-colors">{t.termo}</h3>
                                <div className="h-px w-8 bg-gray-200 mb-4 group-hover:w-16 transition-all" />
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                    {t.definicao}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-20 border-t border-gray-100 pt-12 text-center">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mb-4">Compromisso com a Transparência</p>
                    <div className="flex justify-center gap-8">
                        {["Acessibilidade", "Clareza", "Integridade"].map(tag => (
                            <span key={tag} className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-200 rounded-full" /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
