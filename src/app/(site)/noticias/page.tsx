"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
    FaSearch,
    FaTimes,
    FaClock,
    FaChevronLeft,
    FaChevronRight,
    FaEnvelope,
    FaNewspaper,
    FaCheck,
    FaRegCalendarAlt,
    FaFilter
} from "react-icons/fa";
import { HiArrowLongRight, HiMiniSparkles } from "react-icons/hi2";
import PageHeader from "@/components/PageHeader";
import { MUNICIPIO } from "@/config/municipio";

type Secretaria = {
    id: string;
    nome: string;
    slug: string;
};

type Noticia = {
    id: string;
    titulo: string;
    slug: string;
    resumo: string;
    conteudo?: string;
    publicadoEm: string;
    imagem?: string | null;
    secretaria?: { id: string; nome: string; slug: string } | null;
};

function formatarData(dataStr: string) {
    if (!dataStr) return "";
    try {
        const date = dataStr.includes("T") ? new Date(dataStr) : new Date(dataStr + "T00:00:00");
        if (isNaN(date.getTime())) {
            return new Date(dataStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
        }
        return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
        return "Data indisponível";
    }
}

function calcularTempoLeitura(conteudo?: string, resumo?: string): string {
    const text = (resumo || "") + " " + (conteudo || "").replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return `${minutes} min`;
}

export default function NoticiasPage() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSecretariaId, setSelectedSecretariaId] = useState<string>("");
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 9;

    // Newsletter state
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterEnviado, setNewsletterEnviado] = useState(false);

    // Fetch Secretarias on mount
    useEffect(() => {
        const fetchSecretarias = async () => {
            try {
                const res = await fetch("/api/secretarias");
                if (res.ok) {
                    const data = await res.json();
                    setSecretarias(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Erro ao carregar secretarias:", err);
            }
        };
        fetchSecretarias();
    }, []);

    // Fetch Noticias on filter/page change
    useEffect(() => {
        const fetchNoticias = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.set("publicada", "true");
                params.set("limit", limit.toString());
                params.set("page", page.toString());
                if (searchQuery.trim()) {
                    params.set("q", searchQuery.trim());
                }
                if (selectedSecretariaId) {
                    params.set("secretariaId", selectedSecretariaId);
                }

                const res = await fetch(`/api/noticias?${params.toString()}`);
                const data = await res.json();
                setNoticias(data.items || []);
                setTotalItems(data.total || 0);
            } catch (error) {
                console.error("Erro ao buscar notícias:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchNoticias, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery, selectedSecretariaId, page]);

    const totalPages = Math.ceil(totalItems / limit) || 1;
    const isFiltered = searchQuery.trim().length > 0 || selectedSecretariaId !== "";

    // Hero section articles (only when on page 1 and no active search/filter)
    const showHero = page === 1 && !isFiltered && noticias.length >= 3;
    const heroDestaque = showHero ? noticias[0] : null;
    const heroSecundarias = showHero ? noticias.slice(1, 3) : [];
    const gridNoticias = showHero ? noticias.slice(3) : noticias;

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        setNewsletterEnviado(true);
        setNewsletterEmail("");
        setTimeout(() => setNewsletterEnviado(false), 5000);
    };

    const limparFiltros = () => {
        setSearchQuery("");
        setSelectedSecretariaId("");
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <PageHeader
                title="Portal de Notícias"
                subtitle={`Fique por dentro de todas as ações, serviços e acontecimentos de ${MUNICIPIO.nome}`}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Notícias" }
                ]}
            />

            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
                {/* 1. HERO MAGAZINE SECTION (Apenas página 1 sem filtros) */}
                {showHero && heroDestaque && (
                    <section className="mb-14" aria-label="Notícia em destaque">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-2.5 h-7 bg-[#0088b9] rounded-full" />
                            <h2 className="text-xl md:text-2xl font-black text-[#002241] uppercase tracking-tight flex items-center gap-2">
                                EM DESTAQUE HOJE <HiMiniSparkles className="w-5 h-5 text-[#FDB913]" />
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Card Principal */}
                            <div className="lg:col-span-8">
                                <Link
                                    href={`/noticias/${heroDestaque.slug}`}
                                    className="group relative flex flex-col justify-end min-h-[460px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 hover:-translate-y-1.5 border border-gray-100"
                                >
                                    {/* Imagem de Fundo */}
                                    {heroDestaque.imagem ? (
                                        <img
                                            src={heroDestaque.imagem}
                                            alt={heroDestaque.titulo}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#002241] to-[#0088b9]" />
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#001a33] via-[#001a33]/70 to-transparent z-10" />

                                    {/* Conteúdo */}
                                    <div className="relative z-20 p-6 md:p-10 flex flex-col justify-end">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="bg-[#FDB913] text-[#002241] text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
                                                {heroDestaque.secretaria?.nome || "Notícia Principal"}
                                            </span>
                                            <span className="text-white/80 text-xs font-bold flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                                <FaRegCalendarAlt className="w-3.5 h-3.5 text-[#01b0ef]" />
                                                {formatarData(heroDestaque.publicadoEm)}
                                            </span>
                                            <span className="text-white/80 text-xs font-bold flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                                <FaClock className="w-3.5 h-3.5 text-[#FDB913]" />
                                                {calcularTempoLeitura(heroDestaque.conteudo, heroDestaque.resumo)} de leitura
                                            </span>
                                        </div>

                                        <h3 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 group-hover:text-[#01b0ef] transition-colors line-clamp-3">
                                            {heroDestaque.titulo}
                                        </h3>

                                        <p className="text-gray-200 text-sm md:text-base font-medium line-clamp-2 mb-6 leading-relaxed max-w-3xl">
                                            {heroDestaque.resumo}
                                        </p>

                                        <div className="inline-flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest bg-[#01b0ef] hover:bg-[#0088b9] px-6 py-3.5 rounded-full w-fit transition-all shadow-lg group-hover:gap-4">
                                            Ler matéria completa <HiArrowLongRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Cards Secundários do Hero */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                {heroSecundarias.map((n) => (
                                    <Link
                                        key={n.id}
                                        href={`/noticias/${n.slug}`}
                                        className="group relative flex flex-col justify-end h-[235px] rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl hover:shadow-blue-900/15 transition-all duration-500 hover:-translate-y-1 border border-gray-100"
                                    >
                                        {n.imagem ? (
                                            <img
                                                src={n.imagem}
                                                alt={n.titulo}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#0088b9] to-[#002241]" />
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#001a33]/95 via-[#001a33]/60 to-transparent z-10" />

                                        <div className="relative z-20 p-5 flex flex-col justify-end">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/20">
                                                    {n.secretaria?.nome || "Notícia"}
                                                </span>
                                                <span className="text-white/70 text-[10px] font-bold">
                                                    {formatarData(n.publicadoEm)}
                                                </span>
                                            </div>

                                            <h4 className="text-base font-black text-white leading-snug line-clamp-2 group-hover:text-[#01b0ef] transition-colors">
                                                {n.titulo}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 2. BARRA DE BUSCA E FILTROS */}
                <section className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        {/* Campo de Pesquisa */}
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Buscar notícias por palavras-chave ou título..."
                                className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#01b0ef] focus:bg-white transition-all placeholder:text-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setPage(1);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Limpar pesquisa"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Botão de Limpar Filtros se Ativo */}
                        {isFiltered && (
                            <button
                                onClick={limparFiltros}
                                className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black uppercase tracking-wider rounded-2xl transition-colors flex items-center justify-center gap-2"
                            >
                                <FaTimes className="w-3.5 h-3.5" /> Limpar filtros
                            </button>
                        )}
                    </div>

                    {/* Filtros de Categoria (Pills) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400 mr-2 flex items-center gap-1.5 shrink-0">
                            <FaFilter className="w-3 h-3 text-[#0088b9]" /> Filtrar:
                        </span>

                        <button
                            onClick={() => {
                                setSelectedSecretariaId("");
                                setPage(1);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                                selectedSecretariaId === ""
                                    ? "bg-[#0088b9] text-white shadow-md shadow-blue-900/20"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Todas as Categorias
                        </button>

                        {secretarias.map((sec) => (
                            <button
                                key={sec.id}
                                onClick={() => {
                                    setSelectedSecretariaId(sec.id);
                                    setPage(1);
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                                    selectedSecretariaId === sec.id
                                        ? "bg-[#0088b9] text-white shadow-md shadow-blue-900/20"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {sec.nome}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Status de Contador de Resultados */}
                <div className="flex items-center justify-between mb-6 px-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {loading
                            ? "Carregando notícias..."
                            : `Exibindo ${noticias.length} de ${totalItems} notícias encontradas`}
                    </p>
                </div>

                {/* 3. GRELHA DE NOTÍCIAS + SIDEBAR */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* COLUNA PRINCIPAL DE ARTIGOS */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 animate-pulse flex flex-col gap-4">
                                        <div className="w-full h-44 bg-gray-200 rounded-2xl" />
                                        <div className="w-1/3 h-4 bg-gray-200 rounded-full" />
                                        <div className="w-full h-6 bg-gray-200 rounded-lg" />
                                        <div className="w-3/4 h-6 bg-gray-200 rounded-lg" />
                                        <div className="w-full h-12 bg-gray-100 rounded-xl" />
                                    </div>
                                ))}
                            </div>
                        ) : gridNoticias.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-xl shadow-gray-200/40 border border-gray-100">
                                <div className="w-16 h-16 bg-blue-50 text-[#0088b9] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                                    🔍
                                </div>
                                <h3 className="text-xl font-black text-[#002241] uppercase mb-2">
                                    Nenhuma notícia encontrada
                                </h3>
                                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                                    Não encontramos matérias para os termos ou categoria selecionados. Tente buscar com outras palavras.
                                </p>
                                {isFiltered && (
                                    <button
                                        onClick={limparFiltros}
                                        className="px-6 py-3 bg-[#01b0ef] hover:bg-[#0088b9] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md"
                                    >
                                        Ver todas as notícias
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {gridNoticias.map((n) => (
                                    <article
                                        key={n.id}
                                        className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-lg shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-1.5 flex flex-col group"
                                    >
                                        {/* Thumbnail Imagem */}
                                        <Link href={`/noticias/${n.slug}`} className="block relative h-48 overflow-hidden bg-gray-100">
                                            {n.imagem ? (
                                                <img
                                                    src={n.imagem}
                                                    alt={n.titulo}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#0088b9]/20 to-[#01b0ef]/30 flex items-center justify-center">
                                                    <FaNewspaper className="w-10 h-10 text-[#0088b9]/40" />
                                                </div>
                                            )}

                                            {/* Tag Secretaria */}
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-[#FDB913] text-[#002241] text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md">
                                                    {n.secretaria?.nome || "Geral"}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* Conteúdo do Card */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-3 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                                                <span className="flex items-center gap-1">
                                                    <FaRegCalendarAlt className="w-3 h-3 text-[#01b0ef]" />
                                                    {formatarData(n.publicadoEm)}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <FaClock className="w-3 h-3 text-gray-400" />
                                                    {calcularTempoLeitura(n.conteudo, n.resumo)} de leitura
                                                </span>
                                            </div>

                                            <h3 className="font-black text-[#002241] text-base leading-snug mb-3 group-hover:text-[#01b0ef] transition-colors line-clamp-2">
                                                <Link href={`/noticias/${n.slug}`}>{n.titulo}</Link>
                                            </h3>

                                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-6 flex-1 font-medium">
                                                {n.resumo}
                                            </p>

                                            <Link
                                                href={`/noticias/${n.slug}`}
                                                className="inline-flex items-center gap-2 text-[#0088b9] font-black text-[11px] uppercase tracking-wider group-hover:gap-3 transition-all pt-3 border-t border-gray-100"
                                            >
                                                Ler matéria <HiArrowLongRight className="w-4 h-4 text-[#01b0ef]" />
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* PAGINAÇÃO */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mt-4">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                >
                                    <FaChevronLeft className="w-3 h-3" /> Anterior
                                </button>

                                <span className="text-xs font-black uppercase text-gray-500 tracking-wider">
                                    Página {page} de {totalPages}
                                </span>

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-wider text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                >
                                    Próxima <FaChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* BARRA LATERAL (SIDEBAR) */}
                    <aside className="lg:col-span-4 flex flex-col gap-8">
                        {/* CARD 1: NEWSLETTER MUNICIPAL */}
                        <div className="bg-gradient-to-br from-[#002241] to-[#0088b9] rounded-3xl p-7 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md border border-white/20">
                                <FaEnvelope className="w-6 h-6 text-[#FDB913]" />
                            </div>

                            <h3 className="text-xl font-black uppercase tracking-tight mb-2 leading-snug">
                                Informativo Municipal
                            </h3>
                            <p className="text-white/80 text-xs font-medium leading-relaxed mb-6">
                                Receba as principais novidades, obras e notícias oficiais da Prefeitura de {MUNICIPIO.nome} no seu e-mail.
                            </p>

                            {newsletterEnviado ? (
                                <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-4 flex items-center gap-3 text-emerald-200 text-xs font-bold">
                                    <FaCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                                    <span>Cadastro realizado com sucesso! Em breve você receberá nossos boletins.</span>
                                </div>
                            ) : (
                                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                                    <input
                                        type="email"
                                        required
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        placeholder="Seu melhor e-mail..."
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#FDB913] transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-[#FDB913] hover:bg-yellow-400 text-[#002241] text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-[1.02]"
                                    >
                                        Cadastrar-se gratuitamente
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* CARD 2: ÚLTIMAS NOTÍCIAS (FEED RÁPIDO) */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <span className="w-2 h-6 bg-[#01b0ef] rounded-full" />
                                <h3 className="text-base font-black text-[#002241] uppercase tracking-tight">
                                    Últimas Publicações
                                </h3>
                            </div>

                            <div className="flex flex-col gap-4">
                                {noticias.slice(0, 5).map((n) => (
                                    <Link
                                        key={n.id}
                                        href={`/noticias/${n.slug}`}
                                        className="group flex gap-3 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                                    >
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                                            {n.imagem ? (
                                                <img
                                                    src={n.imagem}
                                                    alt={n.titulo}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#0088b9]/10 flex items-center justify-center text-xs font-black text-[#0088b9]">
                                                    P
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                                {formatarData(n.publicadoEm)}
                                            </span>
                                            <h4 className="text-xs font-black text-[#002241] leading-snug group-hover:text-[#01b0ef] transition-colors line-clamp-2">
                                                {n.titulo}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* CARD 3: NAVEGAR POR SECRETARIA */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                                <span className="w-2 h-6 bg-[#FDB913] rounded-full" />
                                <h3 className="text-base font-black text-[#002241] uppercase tracking-tight">
                                    Secretarias
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {secretarias.map((sec) => (
                                    <button
                                        key={sec.id}
                                        onClick={() => {
                                            setSelectedSecretariaId(sec.id);
                                            setPage(1);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                            selectedSecretariaId === sec.id
                                                ? "bg-[#0088b9] text-white border-[#0088b9]"
                                                : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                                        }`}
                                    >
                                        {sec.nome}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
