"use client";
import Link from "next/link";
import { FaDownload, FaDatabase, FaFileCode, FaTable } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";

const conjuntos = [
    {
        titulo: "Servidores Municipais",
        descricao: "Lista de servidores ativos com cargo, lotação e remuneração",
        endpoint: "/api/servidores",
        formatos: ["JSON", "CSV"],
        atualizacao: "Mensal",
        lei: "LC 131/2009",
        cor: "from-teal-500 to-green-600",
    },
    {
        titulo: "Receitas Públicas",
        descricao: "Arrecadação municipal por categoria, mês e exercício",
        endpoint: "/api/receitas",
        formatos: ["JSON", "CSV"],
        atualizacao: "Mensal",
        lei: "LC 131/2009",
        cor: "from-emerald-500 to-teal-600",
    },
    {
        titulo: "Despesas Públicas",
        descricao: "Empenhos, liquidações e pagamentos por secretaria",
        endpoint: "/api/despesas",
        formatos: ["JSON", "CSV"],
        atualizacao: "Mensal",
        lei: "LC 131/2009",
        cor: "from-blue-500 to-indigo-600",
    },
    {
        titulo: "Licitações",
        descricao: "Processos licitatórios: pregões, concorrências, dispensas",
        endpoint: "/api/licitacoes",
        formatos: ["JSON", "CSV"],
        atualizacao: "Contínua",
        lei: "Lei 14.133/2021",
        cor: "from-purple-500 to-violet-600",
    },
    {
        titulo: "Contratos",
        descricao: "Contratos celebrados com valor, objeto e fornecedor",
        endpoint: "/api/contratos",
        formatos: ["JSON", "CSV"],
        atualizacao: "Contínua",
        lei: "Lei 14.133/2021",
        cor: "from-orange-500 to-amber-600",
    },
    {
        titulo: "Convênios",
        descricao: "Convênios firmados com órgãos estaduais e federais",
        endpoint: "/api/convenios",
        formatos: ["JSON", "CSV"],
        atualizacao: "Contínua",
        lei: "LAI",
        cor: "from-pink-500 to-rose-600",
    },
    {
        titulo: "Obras Públicas",
        descricao: "Obras, reformas e construções com progresso e valores",
        endpoint: "/api/admin/obras",
        formatos: ["JSON"],
        atualizacao: "Semanal",
        lei: "PNTP",
        cor: "from-orange-600 to-red-600",
    },
    {
        titulo: "Diárias",
        descricao: "Diárias concedidas a servidores por viagens a serviço",
        endpoint: "/api/diarias",
        formatos: ["JSON", "CSV"],
        atualizacao: "Contínua",
        lei: "LAI",
        cor: "from-sky-500 to-cyan-600",
    },
];

export default function DadosAbertosPage() {
    const handleDownload = async (endpoint: string, titulo: string, formato: string) => {
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            const items = Array.isArray(data) ? data : (data.items || []);

            if (formato === "JSON") {
                const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${titulo.toLowerCase().replace(/\s+/g, "-")}.json`;
                a.click();
                URL.revokeObjectURL(url);
            } else if (formato === "CSV" && items.length > 0) {
                const headers = Object.keys(items[0]).join(",");
                const rows = items.map((item: Record<string, unknown>) =>
                    Object.values(item).map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
                ).join("\n");
                const blob = new Blob([headers + "\n" + rows], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${titulo.toLowerCase().replace(/\s+/g, "-")}.csv`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch {
            alert("Erro ao baixar dados. Tente novamente.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Dados Abertos"
                subtitle="Bases de dados em formato aberto para reutilização por pesquisadores, desenvolvedores e cidadãos"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Dados Abertos" }
                ]}
            />

            {/* Conformidade */}
            <div className="bg-lime-50 border-b border-lime-100 py-5 px-6">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-lime-800 text-[10px] font-black uppercase tracking-widest">
                    {["Open Data Charter", "CKAN / API REST", "OGP – Parceria p/ Gov. Aberto", "Decreto 8.777/2016"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-lime-100">
                            <span className="text-lime-600">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-16">
                
                {/* Intro */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 mb-10 flex items-start gap-6">
                    <div className="w-16 h-16 bg-lime-50 rounded-2xl flex items-center justify-center shrink-0">
                        <FaDatabase className="text-lime-600" size={28} />
                    </div>
                    <div>
                        <h2 className="font-black text-[#0088b9] text-lg uppercase tracking-tight mb-3">Como usar os dados</h2>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium mb-4">
                            Todos os conjuntos de dados estão disponíveis nos formatos <strong>JSON</strong> (via API REST) e <strong>CSV</strong> (para uso em planilhas).
                            Os dados são fornecidos <strong>sem restrições de uso</strong>, conforme a <strong>Política de Dados Abertos do Governo Federal (Decreto 8.777/2016)</strong>.
                        </p>
                        <div className="flex gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><FaFileCode className="text-lime-500" /> API JSON</span>
                            <span className="flex items-center gap-2"><FaTable className="text-blue-500" /> Download CSV</span>
                            <span className="flex items-center gap-2"><FaDownload className="text-orange-500" /> Gratuito</span>
                        </div>
                    </div>
                </div>

                {/* Cards de conjunto de dados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {conjuntos.map((c) => (
                        <div key={c.titulo} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            <div className={`bg-gradient-to-r ${c.cor} p-6 flex items-center justify-between`}>
                                <div>
                                    <span className="text-white/70 text-[9px] font-black uppercase tracking-widest">Conjunto de Dados</span>
                                    <h3 className="text-white font-black text-lg uppercase tracking-tight">{c.titulo}</h3>
                                </div>
                                <span className="bg-black/20 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                    {c.lei}
                                </span>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-500 text-sm font-medium mb-4">{c.descricao}</p>
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Atualização</span>
                                        <span className="text-[11px] font-black text-[#0088b9]">{c.atualizacao}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {c.formatos.map((f) => (
                                            <span key={f} className="px-2 py-1 bg-gray-100 text-gray-500 text-[9px] font-black uppercase rounded">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {c.formatos.includes("JSON") && (
                                        <button
                                            onClick={() => handleDownload(c.endpoint, c.titulo, "JSON")}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                        >
                                            <FaFileCode size={12} /> JSON
                                        </button>
                                    )}
                                    {c.formatos.includes("CSV") && (
                                        <button
                                            onClick={() => handleDownload(c.endpoint, c.titulo, "CSV")}
                                            className="flex-1 flex items-center justify-center gap-2 bg-lime-600 hover:bg-lime-700 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                        >
                                            <FaTable size={12} /> CSV
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Licença */}
                <div className="mt-12 bg-gray-100 rounded-2xl p-6 text-center">
                    <p className="text-gray-500 text-xs font-bold">
                        Os dados são publicados sob a Licença <strong>Creative Commons CC BY 4.0</strong> — uso livre, com atribuição.
                        Em caso de dúvidas sobre os dados, acesse o <Link href="/servicos/esic" className="text-[#01b0ef] underline">e-SIC</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
