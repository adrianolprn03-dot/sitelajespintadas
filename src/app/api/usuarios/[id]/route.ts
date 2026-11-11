export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireServerAuth } from "@/lib/rbac";
import { registrarHistoricoAlteracao } from "@/lib/audit";

function parseSecList(raw: unknown): string[] {
    if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
    if (typeof raw === "string") {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
        } catch {
            return raw
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }
    }
    return [];
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const auth = await requireServerAuth(["admin", "controladoria"]);
    if (!auth.authorized) return auth.response;

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                secretariasAutorizadas: true,
                ativo: true,
            },
        });

        if (!usuario) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json({
            ...usuario,
            secretariasAutorizadas: parseSecList(usuario.secretariasAutorizadas),
        });
    } catch {
        return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const auth = await requireServerAuth(["admin"]);
    if (!auth.authorized) return auth.response;

    try {
        const data = await request.json();

        if (data.email) {
            const existingUser = await prisma.usuario.findUnique({
                where: { email: data.email },
            });

            if (existingUser && existingUser.id !== params.id) {
                return NextResponse.json({ error: "Já existe um usuário cadastrado com este e-mail" }, { status: 400 });
            }
        }

        const secList =
            data.secretariasAutorizadas !== undefined ? parseSecList(data.secretariasAutorizadas) : undefined;

        const updateData: Record<string, unknown> = {
            nome: data.nome,
            email: data.email,
            perfil: data.perfil,
            ativo: data.ativo,
        };
        if (secList !== undefined) {
            updateData.secretariasAutorizadas = JSON.stringify(secList);
        }

        if (data.senha && data.senha.trim() !== "") {
            updateData.senha = await bcrypt.hash(data.senha, 12);
        }

        const usuario = await prisma.usuario.update({
            where: { id: params.id },
            data: updateData,
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                secretariasAutorizadas: true,
                ativo: true,
            },
        });

        await registrarHistoricoAlteracao({
            entidade: "Usuario",
            entidadeId: usuario.id,
            acao: "edicao",
            resumoAlteracao: `Atualização de usuário ${usuario.nome} (${usuario.perfil})`,
            dadosNovos: {
                perfil: usuario.perfil,
                secretariasAutorizadas: parseSecList(usuario.secretariasAutorizadas),
                ativo: usuario.ativo,
            },
            user: auth.user,
        });

        return NextResponse.json({
            ...usuario,
            secretariasAutorizadas: parseSecList(usuario.secretariasAutorizadas),
        });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const auth = await requireServerAuth(["admin"]);
    if (!auth.authorized) return auth.response;

    try {
        if (auth.user.id === params.id) {
            return NextResponse.json(
                { error: "Você não pode excluir seu próprio usuário. Peça a outro administrador para fazê-lo." },
                { status: 400 }
            );
        }

        await prisma.usuario.delete({
            where: { id: params.id },
        });

        await registrarHistoricoAlteracao({
            entidade: "Usuario",
            entidadeId: params.id,
            acao: "exclusao",
            resumoAlteracao: `Exclusão do usuário ID ${params.id}`,
            user: auth.user,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 });
    }
}
