import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50/80 font-sans text-gray-800">
            <AdminSidebar />
            
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Elementos decorativos sutis ao fundo do conteúdo */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20" />

                {/* Header fixo do conteúdo */}
                <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-gray-100/50 px-8 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                    <Breadcrumbs />
                    {/* Aqui poderia entrar um componente de Notificações futuramente */}
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-auto p-4 sm:p-8 relative z-10 w-full max-w-[1400px] mx-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
