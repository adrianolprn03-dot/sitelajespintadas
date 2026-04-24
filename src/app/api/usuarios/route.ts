import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Função helper para validar se o usuário é admin
async function checkAdminStatus() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "admin") {
        return false;
    }
    return true;
}

export async function GET() {
    try {
        const isAdmin = await checkAdminStatus();
        if (!isAdmin) {
            return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
        }

        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                ativo: true,
                criadoEm: true,
                atualizadoEm: true,
            },
            orderBy: {
                nome: 'asc'
            }
        });

        return NextResponse.json({ items: usuarios });
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const isAdmin = await checkAdminStatus();
        if (!isAdmin) {
            return NextResponse.json({ error: "Acesso negado. Apenas administradores." }, { status: 403 });
        }

        const data = await request.json();
        
        // Validação básica
        if (!data.nome || !data.email || !data.senha || !data.perfil) {
            return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 });
        }

        // Verificar se e-mail já existe
        const existingUser = await prisma.usuario.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Já existe um usuário cadastrado com este e-mail" }, { status: 400 });
        }

        // Hash da senha
        const senhaHash = await bcrypt.hash(data.senha, 12);

        // Criar usuário
        const usuario = await prisma.usuario.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: senhaHash,
                perfil: data.perfil,
                ativo: data.ativo !== undefined ? data.ativo : true,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                ativo: true,
            }
        });

        return NextResponse.json(usuario, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        return NextResponse.json({ error: "Erro ao criar usuário" }, { status: 500 });
    }
}
