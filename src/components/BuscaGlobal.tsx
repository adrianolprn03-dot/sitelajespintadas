"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchResult {
    titulo: string;
    href: string;
    secao: string;
    tipo: "pagina" | "noticia" | "licitacao";
}

const paginasEstaticas: SearchResult[] = [
    { titulo: "Portal da Transparência", href: "/transparencia", secao: "Transparência", tipo: "pagina" },
    { titulo: "Obras Públicas", href: "/transparencia/obras", secao: "Transparência", tipo: "pagina" },
    { titulo: "Receitas Públicas", href: "/transparencia/receitas", secao: "Transparência", tipo: "pagina" },
    { titulo: "Despesas Públicas", href: "/transparencia/despesas", secao: "Transparência", tipo: "pagina" },
    { titulo: "Licitações", href: "/transparencia/licitacoes", secao: "Transparência", tipo: "pagina" },
    { titulo: "Contratos", href: "/transparencia/contratos", secao: "Transparência", tipo: "pagina" },
    { titulo: "Convênios", href: "/transparencia/convenios", secao: "Transparência", tipo: "pagina" },
    { titulo: "Diárias", href: "/transparencia/diarias", secao: "Transparência", tipo: "pagina" },
    { titulo: "Servidores Municipais", href: "/transparencia/servidores", secao: "Transparência", tipo: "pagina" },
    { titulo: "Relatórios Fiscais (RREO/RGF)", href: "/transparencia/relatorios", secao: "Transparência", tipo: "pagina" },
    { titulo: "LOA / LDO / PPA", href: "/transparencia/orcamento", secao: "Transparência", tipo: "pagina" },
    { titulo: "Legislação Municipal", href: "/transparencia/legislacao", secao: "Transparência", tipo: "pagina" },
    { titulo: "Dados Abertos", href: "/transparencia/dados-abertos", secao: "Transparência", tipo: "pagina" },
    { titulo: "FAQ / Perguntas Frequentes", href: "/transparencia/faq", secao: "Atendimento", tipo: "pagina" },
    { titulo: "Glossário de Termos", href: "/transparencia/glossario", secao: "Atendimento", tipo: "pagina" },
    { titulo: "e-SIC – Acesso à Informação", href: "/servicos/esic", secao: "Serviços", tipo: "pagina" },
    { titulo: "Ouvidoria Municipal", href: "/servicos/ouvidoria", secao: "Serviços", tipo: "pagina" },
    { titulo: "A Prefeitura", href: "/a-prefeitura", secao: "Institucional", tipo: "pagina" },
    { titulo: "Secretarias Municipais", href: "/secretarias", secao: "Institucional", tipo: "pagina" },
    { titulo: "Programa de Integridade", href: "/transparencia/integridade", secao: "Transparência", tipo: "pagina" },
    { titulo: "Acessibilidade Digital", href: "/transparencia/acessibilidade", secao: "Atendimento", tipo: "pagina" },
    { titulo: "Política de Privacidade", href: "/privacidade", secao: "Legal", tipo: "pagina" },
    { titulo: "Mapa do Site", href: "/mapa-do-site", secao: "Legal", tipo: "pagina" },
];

export default function BuscaGlobal({ onClose }: { onClose?: () => void }) {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResultados([]);
            return;
        }

        const q = query.toLowerCase();
        const paginasFiltradas = paginasEstaticas.filter(p =>
            p.titulo.toLowerCase().includes(q) || p.secao.toLowerCase().includes(q)
        );
        setResultados(paginasFiltradas.slice(0, 8));
    }, [query]);

    const handleSelect = (href: string) => {
        router.push(href);
        onClose?.();
    };

    const tipoColors: Record<string, string> = {
        pagina: "bg-blue-50 text-blue-600",
        noticia: "bg-orange-50 text-orange-600",
        licitacao: "bg-purple-50 text-purple-600",
    };

    return (
        <div className="w-full">
            <div className="relative group/search">
                <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500 transition-transform group-focus-within/search:scale-110" />
                <input
                    ref={inputRef}
                    id="busca"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar no portal..."
                    className="w-full bg-white border border-gray-100 rounded-full pl-14 pr-12 py-4 text-sm font-bold text-gray-700 placeholder:text-gray-400 placeholder:font-black placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px] focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 outline-none transition-all shadow-xl shadow-black/5"
                    aria-label="Buscar no portal"
                    role="searchbox"
                    aria-autocomplete="list"
                    aria-expanded={resultados.length > 0}
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Limpar busca"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            {resultados.length > 0 && (
                <div className="absolute left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-[100] animate-fade-in-up" role="listbox">
                    <div className="p-2">
                        {resultados.map((r, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(r.href)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-primary-50 transition-all text-left rounded-2xl group/item mb-1 last:mb-0"
                                role="option"
                            >
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-gray-800 group-hover/item:text-primary-600 transition-colors">{r.titulo}</span>
                                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mt-1">{r.secao}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${tipoColors[r.tipo]} shadow-sm`}>
                                    {r.tipo === "pagina" ? "Página" : r.tipo}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {query.trim().length >= 2 && resultados.length === 0 && !loading && (
                <div className="absolute left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2rem] p-8 text-center shadow-2xl z-[100] animate-fade-in-up">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl mb-4">🔍</span>
                        <p className="text-gray-400 text-sm font-black uppercase tracking-widest leading-relaxed">
                            Nenhum resultado para <br/>
                            <span className="text-primary-500">"{query}"</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
