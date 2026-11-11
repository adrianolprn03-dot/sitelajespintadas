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

export async function GET() {
    const auth = await requireServerAuth(["admin", "controladoria"]);
    if (!auth.authorized) return auth.response;

    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                secretariasAutorizadas: true,
                ativo: true,
                criadoEm: true,
                atualizadoEm: true,
            },
            orderBy: {
                nome: "asc",
            },
        });

        const formatted = usuarios.map((u) => ({
            ...u,
            secretariasAutorizadas: parseSecList(u.secretariasAutorizadas),
        }));

        return NextResponse.json({ items: formatted });
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const auth = await requireServerAuth(["admin"]);
    if (!auth.authorized) return auth.response;

    try {
        const data = await request.json();

        if (!data.nome || !data.email || !data.senha || !data.perfil) {
            return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 });
        }

        const existingUser = await prisma.usuario.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Já existe um usuário cadastrado com este e-mail" }, { status: 400 });
        }

        const senhaHash = await bcrypt.hash(data.senha, 12);
        const secList = parseSecList(data.secretariasAutorizadas);

        const usuario = await prisma.usuario.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: senhaHash,
                perfil: data.perfil,
                secretariasAutorizadas: JSON.stringify(secList),
                ativo: data.ativo !== undefined ? data.ativo : true,
            },
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
            acao: "criacao",
            resumoAlteracao: `Criação de usuário ${usuario.nome} (${usuario.perfil})`,
            dadosNovos: { email: usuario.email, perfil: usuario.perfil, secretariasAutorizadas: secList },
            user: auth.user,
        });

        return NextResponse.json(
            {
                ...usuario,
                secretariasAutorizadas: secList,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
    }
}
