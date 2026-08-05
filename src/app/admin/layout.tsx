import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { FaExternalLinkAlt, FaUserCircle, FaShieldAlt } from "react-icons/fa";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <>{children}</>;
    }

    const userName = session.user?.name || "Gestor Municipal";
    const userEmail = session.user?.email || "";
    const userRole = (session.user as any)?.role || "admin";
    const userInitials = userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif] text-slate-800 antialiased selection:bg-primary-500 selection:text-white">
            <AdminSidebar userRole={userRole} />
            
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Elementos decorativos sutis ao fundo */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-400/10 to-blue-600/10 rounded-full blur-[140px] pointer-events-none -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-400/10 to-teal-600/10 rounded-full blur-[120px] pointer-events-none -ml-20 -mb-20" />

                {/* Top Header Bar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all">
                    <div className="flex items-center gap-4">
                        <Breadcrumbs />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Status do Sistema */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/80 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Sistema Online
                        </div>

                        {/* Portal Livre Quick Link */}
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-primary-50 text-slate-600 hover:text-primary-700 font-bold text-xs transition-all border border-slate-200/60 hover:border-primary-200"
                        >
                            <FaExternalLinkAlt size={11} className="text-slate-400 hover:text-primary-600" />
                            <span>Portal Público</span>
                        </Link>

                        {/* Perfil do Usuário Logado */}
                        <div className="flex items-center gap-3 pl-3 border-l border-slate-200/60">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-blue-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                                {userInitials}
                            </div>
                            <div className="hidden lg:block text-left">
                                <div className="text-xs font-black text-slate-800 leading-tight truncate max-w-[140px]">{userName}</div>
                                <div className="text-[10px] font-bold text-primary-600 uppercase tracking-widest leading-none mt-0.5 flex items-center gap-1">
                                    <FaShieldAlt size={9} />
                                    {userRole === "admin" ? "Administrador" : "Editor"}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Area de Conteudo Principal */}
                <div className="flex-1 overflow-auto p-4 sm:p-8 relative z-10 w-full max-w-[1440px] mx-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
