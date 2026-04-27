"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    FaHome, FaNewspaper, FaGavel, FaFileContract, FaUsers,
    FaMoneyBillWave, FaChartBar, FaBuilding, FaBullhorn,
    FaSignOutAlt, FaTimes, FaBars, FaCalendarAlt, FaImages, FaEnvelope,
    FaHandshake, FaPlane, FaHammer, FaQuestionCircle, FaBook,
    FaUserFriends, FaUpload, FaFileAlt, FaExternalLinkAlt, FaUserShield
} from "react-icons/fa";
import { useState } from "react";

const menuItems = [
    { label: "Dashboard", href: "/admin", icon: FaHome, exact: true, roles: ["admin", "editor", "comunicacao"] },
    { label: "Notícias", href: "/admin/noticias", icon: FaNewspaper, roles: ["admin", "editor", "comunicacao"] },
    { label: "Agenda", href: "/admin/agenda", icon: FaCalendarAlt, roles: ["admin", "editor", "comunicacao"] },
    { label: "Galeria", href: "/admin/galeria", icon: FaImages, roles: ["admin", "editor", "comunicacao"] },
    { label: "Obras", href: "/admin/obras", icon: FaHammer, roles: ["admin", "editor"] },
    { label: "FAQ", href: "/admin/faq", icon: FaQuestionCircle, roles: ["admin", "editor"] },
    { label: "Glossário", href: "/admin/glossario", icon: FaBook, roles: ["admin", "editor"] },
    { label: "Licitações", href: "/admin/licitacoes", icon: FaGavel, roles: ["admin", "editor"] },
    { label: "Contratos", href: "/admin/contratos", icon: FaFileContract, roles: ["admin", "editor"] },
    { label: "Convênios", href: "/admin/convenios", icon: FaHandshake, roles: ["admin", "editor"] },
    { label: "Diárias", href: "/admin/diarias", icon: FaPlane, roles: ["admin", "editor"] },
    { label: "Servidores", href: "/admin/servidores", icon: FaUsers, roles: ["admin", "editor"] },
    { label: "Receitas", href: "/admin/receitas", icon: FaMoneyBillWave, roles: ["admin", "editor"] },
    { label: "Despesas", href: "/admin/despesas", icon: FaChartBar, roles: ["admin", "editor"] },
    { label: "Conselhos", href: "/admin/conselhos", icon: FaUserFriends, roles: ["admin", "editor"] },
    { label: "Legislação", href: "/admin/legislacao", icon: FaGavel, roles: ["admin", "editor"] },
    { label: "Documentos", href: "/admin/documentos", icon: FaFileContract, roles: ["admin", "editor"] },
    { label: "Secretarias", href: "/admin/secretarias", icon: FaBuilding, roles: ["admin", "editor"] },
    { label: "Unidades At.", href: "/admin/unidades", icon: FaBuilding, roles: ["admin", "editor"] },
    { label: "Ouvidoria", href: "/admin/ouvidoria", icon: FaBullhorn, roles: ["admin", "editor"] },
    { label: "e-SIC", href: "/admin/esic", icon: FaFileAlt, roles: ["admin", "editor"] },
    { label: "Fale Conosco", href: "/admin/contatos", icon: FaEnvelope, roles: ["admin", "editor"] },
    { label: "Links Externos", href: "/admin/links-externos", icon: FaExternalLinkAlt, roles: ["admin", "editor"] },
    { label: "Configurações", href: "/admin/configuracoes", icon: FaBuilding, roles: ["admin"] },
    { label: "Usuários", href: "/admin/usuarios", icon: FaUserShield, roles: ["admin"] },
    { label: "Saúde / REMUME", href: "/admin/saude", icon: FaBook, roles: ["admin", "editor"] },
    { label: "Frota Municipal", href: "/admin/frota", icon: FaHome, roles: ["admin", "editor"] },
    { label: "Emendas Parl.", href: "/admin/emendas", icon: FaMoneyBillWave, roles: ["admin", "editor"] },
    { label: "Emendas PIX", href: "/admin/emendas-pix", icon: FaMoneyBillWave, roles: ["admin", "editor"] },
    { label: "Relatórios Fiscais", href: "/admin/relatorios-fiscais", icon: FaChartBar, roles: ["admin", "editor"] },
    { label: "Pesquisas (PNTP)", href: "/admin/pesquisa-satisfacao", icon: FaChartBar, roles: ["admin", "editor"] },
    { label: "Concursos", href: "/admin/concursos", icon: FaUsers, roles: ["admin", "editor"] },
    { label: "Carta de Serviços", href: "/admin/carta-servicos", icon: FaFileAlt, roles: ["admin", "editor"] },
    { label: "Símbolos Oficiais", href: "/admin/configuracoes/simbolos", icon: FaImages, roles: ["admin"] },
    { label: "Importar CSV", href: "/admin/importacao", icon: FaUpload, roles: ["admin"] },
];

export default function AdminSidebar({ userRole = "admin" }: { userRole?: string }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <aside
            className={`bg-white/80 backdrop-blur-xl border-r border-gray-100 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${collapsed ? "w-20" : "w-64"} min-h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 rounded-tr-[2rem] rounded-br-[2rem] m-2`}
            aria-label="Menu administrativo"
        >
            {/* Logo & Toggle */}
            <div className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-2`}>
                {!collapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/30 shrink-0">
                            <span className="text-white text-xs">🏛️</span>
                        </div>
                        <div className="whitespace-nowrap">
                            <div className="text-sm font-black text-gray-800 tracking-tight leading-none mb-1">Painel Admin</div>
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">Lajes Pintadas</div>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all shrink-0"
                    aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
                >
                    {collapsed ? <FaBars size={14} /> : <FaTimes size={14} />}
                </button>
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <nav className="space-y-1.5" aria-label="Navegação Principal">
                    {menuItems.filter(item => item.roles.includes(userRole)).map((item) => {
                        const active = isActive(item.href, item.exact);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                className={`group flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden isolate ${
                                    active
                                        ? "text-primary-700 font-bold bg-primary-50/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]"
                                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 font-medium"
                                } ${collapsed ? 'justify-center border border-transparent hover:border-gray-100 px-0' : ''}`}
                            >
                                {/* Indicador Ativo */}
                                {active && !collapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary-500 rounded-r-full shadow-[0_0_12px_rgba(var(--color-primary-500),0.8)]" />
                                )}

                                <div className={`flex items-center justify-center rounded-xl transition-all duration-300 shrink-0 ${active && collapsed ? 'w-10 h-10 bg-primary-50 text-primary-600 shadow-sm' : ''} ${!collapsed && active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                    <item.icon size={16} />
                                </div>
                                
                                {!collapsed && (
                                    <span className="text-xs tracking-wide whitespace-nowrap">{item.label}</span>
                                )}

                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] -z-10" />
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer / User Actions */}
            <div className="p-4 border-t border-gray-50/50 mt-auto bg-gray-50/30 rounded-br-[2rem]">
                <div className={`space-y-2 ${collapsed ? '' : 'px-2'}`}>
                    <Link
                        href="/"
                        target="_blank"
                        title={collapsed ? "Ver site" : undefined}
                        className={`group flex items-center gap-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-800 transition-colors ${collapsed ? 'justify-center' : 'px-2'}`}
                    >
                        <FaBuilding className="text-gray-400 group-hover:text-gray-600" size={14} />
                        {!collapsed && <span className="text-xs font-bold tracking-wide">Acessar Portal Livre</span>}
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        title={collapsed ? "Sair" : undefined}
                        className={`w-full group flex items-center gap-3 py-2.5 rounded-xl text-red-500/80 hover:text-red-600 hover:bg-red-50/80 transition-all ${collapsed ? 'justify-center' : 'px-2'}`}
                    >
                        <FaSignOutAlt className="group-hover:-translate-x-0.5 transition-transform" size={14} />
                        {!collapsed && <span className="text-xs font-bold tracking-wide">Encerrar Sessão</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
