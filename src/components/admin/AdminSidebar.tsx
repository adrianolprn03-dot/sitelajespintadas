"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { MUNICIPIO } from "@/config/municipio";
import { useState } from "react";
import {
    FaHome, FaNewspaper, FaGavel, FaFileContract, FaUsers,
    FaMoneyBillWave, FaChartBar, FaBuilding, FaBullhorn,
    FaSignOutAlt, FaTimes, FaBars, FaCalendar, FaImages, FaEnvelope,
    FaHandshake, FaPlane, FaHammer, FaQuestionCircle, FaBook,
    FaUserFriends, FaUpload, FaFile, FaExternalLinkAlt, FaUserShield,
    FaUserGraduate, FaUserTie, FaCog, FaTheaterMasks, FaHeartbeat,
    FaChevronDown, FaShieldAlt
} from "react-icons/fa";

type MenuItem = {
    label: string;
    href: string;
    icon: any;
    exact?: boolean;
    roles: string[];
    badge?: string;
};

type MenuCategory = {
    title: string;
    items: MenuItem[];
};

const menuCategories: MenuCategory[] = [
    {
        title: "Principal",
        items: [
            { label: "Dashboard", href: "/admin", icon: FaHome, exact: true, roles: ["admin", "editor", "comunicacao"] },
        ]
    },
    {
        title: "Conteúdo & Mídia",
        items: [
            { label: "Notícias", href: "/admin/noticias", icon: FaNewspaper, roles: ["admin", "editor", "comunicacao"] },
            { label: "Agenda Eventos", href: "/admin/agenda", icon: FaCalendar, roles: ["admin", "editor", "comunicacao"] },
            { label: "Galeria de Fotos", href: "/admin/galeria", icon: FaImages, roles: ["admin", "editor", "comunicacao"] },
            { label: "FAQ / Dúvidas", href: "/admin/faq", icon: FaQuestionCircle, roles: ["admin", "editor"] },
            { label: "Glossário", href: "/admin/glossario", icon: FaBook, roles: ["admin", "editor"] },
            { label: "Incentivos Culturais", href: "/admin/incentivos-culturais", icon: FaTheaterMasks, roles: ["admin", "editor"] },
        ]
    },
    {
        title: "Transparência & Finanças",
        items: [
            { label: "Licitações", href: "/admin/licitacoes", icon: FaGavel, roles: ["admin", "editor"] },
            { label: "Contratos", href: "/admin/contratos", icon: FaFileContract, roles: ["admin", "editor"] },
            { label: "Convênios", href: "/admin/convenios", icon: FaHandshake, roles: ["admin", "editor"] },
            { label: "Diárias de Viagem", href: "/admin/diarias", icon: FaPlane, roles: ["admin", "editor"] },
            { label: "Receitas", href: "/admin/receitas", icon: FaMoneyBillWave, roles: ["admin", "editor"] },
            { label: "Despesas", href: "/admin/despesas", icon: FaChartBar, roles: ["admin", "editor"] },
            { label: "Emendas Parl.", href: "/admin/emendas", icon: FaMoneyBillWave, roles: ["admin", "editor"] },
            { label: "Emendas PIX", href: "/admin/emendas-pix", icon: FaMoneyBillWave, roles: ["admin", "editor"] },
            { label: "Relatórios Fiscais", href: "/admin/relatorios-fiscais", icon: FaChartBar, roles: ["admin", "editor"] },
            { label: "Pesquisas (PNTP)", href: "/admin/pesquisa-satisfacao", icon: FaChartBar, roles: ["admin", "editor"] },
        ]
    },
    {
        title: "Saúde & Serviços",
        items: [
            { label: "Saúde / REMUME", href: "/admin/saude", icon: FaBook, roles: ["admin", "editor"] },
            { label: "Regulação em Saúde", href: "/admin/central-regulacao", icon: FaHeartbeat, roles: ["admin", "editor"] },
            { label: "Obras Públicas", href: "/admin/obras", icon: FaHammer, roles: ["admin", "editor"] },
            { label: "Unidades Atend.", href: "/admin/unidades", icon: FaBuilding, roles: ["admin", "editor"] },
            { label: "Carta de Serviços", href: "/admin/carta-servicos", icon: FaFile, roles: ["admin", "editor"] },
            { label: "Conselhos", href: "/admin/conselhos", icon: FaUserFriends, roles: ["admin", "editor"] },
            { label: "Legislação", href: "/admin/legislacao", icon: FaGavel, roles: ["admin", "editor"] },
            { label: "Documentos", href: "/admin/documentos", icon: FaFileContract, roles: ["admin", "editor"] },
        ]
    },
    {
        title: "Gestão de Pessoas & Frota",
        items: [
            { label: "Servidores", href: "/admin/servidores", icon: FaUsers, roles: ["admin", "editor"] },
            { label: "Estagiários", href: "/admin/estagiarios", icon: FaUserGraduate, roles: ["admin", "editor"] },
            { label: "Terceirizados", href: "/admin/terceirizados", icon: FaUserTie, roles: ["admin", "editor"] },
            { label: "Concursos Público", href: "/admin/concursos", icon: FaUsers, roles: ["admin", "editor"] },
            { label: "Editais", href: "/admin/editais", icon: FaBullhorn, roles: ["admin", "editor"] },
            { label: "Frota Municipal", href: "/admin/frota", icon: FaHome, roles: ["admin", "editor"] },
        ]
    },
    {
        title: "Atendimento & Comunicação",
        items: [
            { label: "Ouvidoria", href: "/admin/ouvidoria", icon: FaBullhorn, roles: ["admin", "editor"] },
            { label: "e-SIC", href: "/admin/esic", icon: FaFile, roles: ["admin", "editor"] },
            { label: "Fale Conosco", href: "/admin/contatos", icon: FaEnvelope, roles: ["admin", "editor"] },
            { label: "Links Externos", href: "/admin/links-externos", icon: FaExternalLinkAlt, roles: ["admin", "editor"] },
        ]
    },
    {
        title: "Configurações & Sistema",
        items: [
            { label: "Configurações", href: "/admin/configuracoes", icon: FaCog, roles: ["admin", "editor", "comunicacao"] },
            { label: "Gestão de Usuários", href: "/admin/usuarios", icon: FaUserShield, roles: ["admin"] },
            { label: "Símbolos Oficiais", href: "/admin/configuracoes/simbolos", icon: FaImages, roles: ["admin"] },
            { label: "Importar Dados CSV", href: "/admin/importacao", icon: FaUpload, roles: ["admin"] },
        ]
    }
];

export default function AdminSidebar({ userRole = "admin" }: { userRole?: string }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <aside
            className={`bg-white/95 backdrop-blur-xl border-r border-gray-100/80 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
                collapsed ? "w-20" : "w-64"
            } min-h-screen sticky top-0 shadow-[4px_0_30px_rgba(0,0,0,0.03)] z-40`}
            aria-label="Menu administrativo"
        >
            {/* Header com Logo & Toggle */}
            <div className={`p-5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-gray-100/60 mb-2`}>
                {!collapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-600 to-blue-700 flex items-center justify-center shadow-lg shadow-primary-600/25 shrink-0">
                            <span className="text-white text-base">🏛️</span>
                        </div>
                        <div className="whitespace-nowrap min-w-0">
                            <div className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">Painel Admin</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none truncate">{MUNICIPIO.nome}</div>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all shrink-0 border border-transparent hover:border-primary-100"
                    aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
                >
                    {collapsed ? <FaBars size={14} /> : <FaTimes size={14} />}
                </button>
            </div>

            {/* Menu Categorizado */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {menuCategories.map((cat, cIdx) => {
                    const filteredItems = cat.items.filter(item => item.roles.includes(userRole));
                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={cIdx} className="space-y-1">
                            {!collapsed && (
                                <div className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-1.5 opacity-80">
                                    {cat.title}
                                </div>
                            )}

                            <nav className="space-y-1">
                                {filteredItems.map((item) => {
                                    const active = isActive(item.href, item.exact);
                                    const IconComponent = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={collapsed ? item.label : undefined}
                                            className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 relative isolate text-xs font-semibold ${
                                                active
                                                    ? "text-primary-700 bg-primary-50/90 font-bold shadow-xs shadow-primary-500/10"
                                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                            } ${collapsed ? 'justify-center px-0 py-3' : ''}`}
                                        >
                                            {/* Indicador Ativo Borda Esquerda */}
                                            {active && !collapsed && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-primary-600 rounded-r-full shadow-sm" />
                                            )}

                                            <div className={`flex items-center justify-center shrink-0 transition-colors ${
                                                active ? 'text-primary-600 scale-110' : 'text-gray-400 group-hover:text-gray-700'
                                            }`}>
                                                <IconComponent size={15} />
                                            </div>

                                            {!collapsed && (
                                                <span className="truncate leading-tight tracking-tight">{item.label}</span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    );
                })}
            </div>

            {/* User Footer / Actions */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                <div className={`space-y-1.5 ${collapsed ? '' : 'px-1'}`}>
                    <Link
                        href="/"
                        target="_blank"
                        title={collapsed ? "Ver Portal Livre" : undefined}
                        className={`group flex items-center gap-2.5 py-2 rounded-xl text-gray-500 hover:text-primary-700 hover:bg-white transition-all text-xs font-bold ${
                            collapsed ? 'justify-center' : 'px-2.5 border border-transparent hover:border-gray-200 shadow-xs'
                        }`}
                    >
                        <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary-600 shrink-0" size={12} />
                        {!collapsed && <span className="truncate">Visualizar Portal Livre</span>}
                    </Link>

                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        title={collapsed ? "Encerrar Sessão" : undefined}
                        className={`w-full group flex items-center gap-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-all text-xs font-bold ${
                            collapsed ? 'justify-center' : 'px-2.5'
                        }`}
                    >
                        <FaSignOutAlt className="group-hover:-translate-x-0.5 transition-transform shrink-0" size={12} />
                        {!collapsed && <span>Sair da Conta</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
