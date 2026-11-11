import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type PerfilUsuario =
    | "admin"           // Administrador Geral
    | "controladoria"   // Controladoria / Revisor PNTP
    | "editor"          // Editor de Secretaria
    | "integracao"      // Operador de Integração e Importação
    | "esic"            // Operador de e-SIC / Ouvidoria
    | "comunicacao";    // Comunicação / Notícias

export const PERFIS_LABELS: Record<PerfilUsuario, string> = {
    admin: "Administrador Geral",
    controladoria: "Controladoria / Revisor PNTP",
    editor: "Editor de Secretaria",
    integracao: "Operador de Integração",
    esic: "Operador de e-SIC e Ouvidoria",
    comunicacao: "Comunicação Institucional",
};

export type SituacaoPublicacao =
    | "rascunho"
    | "aguardando_revisao"
    | "publicado"
    | "necessita_atualizacao"
    | "integracao_indisponivel"
    | "nao_publicado"
    | "nao_ocorrencia_declarada"
    | "nao_aplicavel";

export const SITUACAO_PUBLICACAO_META: Record<
    SituacaoPublicacao,
    { label: string; badgeClass: string; descricao: string }
> = {
    rascunho: {
        label: "Rascunho",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
        descricao: "Em elaboração pela secretaria, ainda não visível publicamente.",
    },
    aguardando_revisao: {
        label: "Aguardando Revisão",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        descricao: "Encaminhado para conferência da Controladoria/Revisor.",
    },
    publicado: {
        label: "Publicado",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        descricao: "Validado e disponível para consulta pública.",
    },
    necessita_atualizacao: {
        label: "Necessita Atualização",
        badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
        descricao: "Prazo de atualização periódica vencido ou próximo do vencimento.",
    },
    integracao_indisponivel: {
        label: "Integração Indisponível",
        badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
        descricao: "Falha temporária na comunicação com a fonte externa oficial.",
    },
    nao_publicado: {
        label: "Conteúdo Ainda Não Publicado",
        badgeClass: "bg-red-100 text-red-800 border-red-200",
        descricao: "Informação obrigatória pendente de envio pelo setor responsável.",
    },
    nao_ocorrencia_declarada: {
        label: "Não Ocorrência Declarada",
        badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
        descricao: "Inexistência de fatos no período formalmente declarada pelo órgão.",
    },
    nao_aplicavel: {
        label: "Não Aplicável (Fundamentado)",
        badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
        descricao: "Critério não aplicável ao ente municipal mediante fundamentação legal.",
    },
};

export interface AuthContext {
    id: string;
    nome: string;
    email: string;
    perfil: PerfilUsuario;
    secretariasAutorizadas: string[];
}

export async function getAuthContext(): Promise<AuthContext | null> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const userAny = session.user as any;
    let secretariasAutorizadas: string[] = [];

    try {
        const dbUser = await prisma.usuario.findUnique({
            where: { email: session.user.email },
            select: { id: true, nome: true, email: true, perfil: true, secretariasAutorizadas: true, ativo: true },
        });
        if (!dbUser || !dbUser.ativo) return null;

        if (dbUser.secretariasAutorizadas) {
            try {
                const parsed = JSON.parse(dbUser.secretariasAutorizadas);
                if (Array.isArray(parsed)) secretariasAutorizadas = parsed;
            } catch {
                secretariasAutorizadas = dbUser.secretariasAutorizadas
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
            }
        }

        return {
            id: dbUser.id,
            nome: dbUser.nome,
            email: dbUser.email,
            perfil: (dbUser.perfil as PerfilUsuario) || "editor",
            secretariasAutorizadas,
        };
    } catch {
        return {
            id: userAny.id || "session-user",
            nome: session.user.name || "Servidor Autenticado",
            email: session.user.email,
            perfil: (userAny.role as PerfilUsuario) || "editor",
            secretariasAutorizadas: [],
        };
    }
}

export async function requireServerAuth(allowedRoles?: PerfilUsuario[]): Promise<
    | { authorized: true; user: AuthContext }
    | { authorized: false; response: NextResponse }
> {
    const user = await getAuthContext();
    if (!user) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Não autenticado. Faça login no painel administrativo." },
                { status: 401 }
            ),
        };
    }

    if (allowedRoles && allowedRoles.length > 0 && user.perfil !== "admin") {
        if (!allowedRoles.includes(user.perfil)) {
            return {
                authorized: false,
                response: NextResponse.json(
                    {
                        error: `Acesso negado. Seu perfil (${PERFIS_LABELS[user.perfil] || user.perfil}) não possui permissão para esta operação.`,
                    },
                    { status: 403 }
                ),
            };
        }
    }

    return { authorized: true, user };
}

export function canAccessSecretaria(user: AuthContext, secretariaAlvo?: string | null): boolean {
    if (user.perfil === "admin" || user.perfil === "controladoria" || user.perfil === "integracao") {
        return true;
    }
    if (!secretariaAlvo) return true;
    if (user.secretariasAutorizadas.length === 0) return true; // Caso não tenha restrição específica cadastrada

    const alvoNorm = secretariaAlvo.toLowerCase().trim();
    return user.secretariasAutorizadas.some((sec) => {
        const secNorm = sec.toLowerCase().trim();
        return alvoNorm.includes(secNorm) || secNorm.includes(alvoNorm);
    });
}

export function canApprovePublication(user: AuthContext): boolean {
    return user.perfil === "admin" || user.perfil === "controladoria";
}

export function canAccessEsicPersonalData(user: AuthContext | null): boolean {
    if (!user) return false;
    return user.perfil === "admin" || user.perfil === "controladoria" || user.perfil === "esic";
}

