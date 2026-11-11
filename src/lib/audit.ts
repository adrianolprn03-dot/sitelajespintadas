import { prisma } from "@/lib/prisma";
import type { AuthContext } from "@/lib/rbac";

export interface LogAuditInput {
    entidade: string;
    entidadeId: string;
    acao:
        | "criacao"
        | "edicao"
        | "revisao"
        | "aprovacao"
        | "publicacao"
        | "conferencia_sem_alteracao"
        | "exclusao"
        | "importacao";
    resumoAlteracao: string;
    dadosAnteriores?: unknown;
    dadosNovos?: unknown;
    isConferenciaSemAlteracao?: boolean;
    secretaria?: string | null;
    user?: AuthContext | null;
}

export async function registrarHistoricoAlteracao(input: LogAuditInput) {
    try {
        await prisma.historicoAlteracao.create({
            data: {
                entidade: input.entidade,
                entidadeId: input.entidadeId,
                acao: input.acao,
                resumoAlteracao: input.resumoAlteracao,
                dadosAnteriores: input.dadosAnteriores ? JSON.stringify(input.dadosAnteriores) : null,
                dadosNovos: input.dadosNovos ? JSON.stringify(input.dadosNovos) : null,
                isConferenciaSemAlteracao: Boolean(input.isConferenciaSemAlteracao),
                usuarioId: input.user?.id || null,
                usuarioNome: input.user?.nome || "Sistema / Operador",
                usuarioPerfil: input.user?.perfil || "sistema",
                secretaria: input.secretaria || null,
            },
        });
    } catch (err) {
        console.error("Aviso: falha ao gravar histórico de auditoria:", err);
    }
}

