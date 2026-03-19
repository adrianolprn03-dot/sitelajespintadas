"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight, FaHome } from "react-icons/fa";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) return null;

    const labels: Record<string, string> = {
        admin: "Painel",
        noticias: "Notícias",
        licitacoes: "Licitações",
        contratos: "Contratos",
        servidores: "Servidores",
        receitas: "Receitas",
        despesas: "Despesas",
        secretarias: "Secretarias",
        ouvidoria: "Ouvidoria",
        contatos: "Contatos",
        galeria: "Galeria",
        agenda: "Agenda",
        documentos: "Documentos",
        editar: "Editar",
        nova: "Novo(a)",
        novo: "Novo(a)",
        historia: "História",
        prefeito: "Prefeito",
        estrutura: "Estrutura",
        transparencia: "Transparência",
        servicos: "Serviços",
    };

    return (
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide" aria-label="Breadcrumb">
            <Link href={segments[0] === "admin" ? "/admin" : "/"} className="hover:text-primary-500 transition-colors flex items-center gap-1">
                <FaHome className="mb-0.5" />
                <span>{segments[0] === "admin" ? "Início" : "Início"}</span>
            </Link>

            {segments.map((segment, index) => {
                const url = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                const label = labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

                // Ignorar o primeiro 'admin' pois já mostramos 'Início'
                if (segment === "admin" && index === 0) return null;

                // Não linkar se for ID ou o último
                const clickable = !isLast && isNaN(Number(segment)) && segment.length > 5;

                return (
                    <div key={url} className="flex items-center gap-2">
                        <FaChevronRight className="text-[8px]" />
                        {clickable ? (
                            <Link href={url} className="hover:text-primary-500 transition-colors">
                                {label}
                            </Link>
                        ) : (
                            <span className={isLast ? "text-gray-600 font-semibold" : ""}>
                                {label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
