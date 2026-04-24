import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function checkAdminStatus() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "admin") {
        return false;
    }
    return true;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdminStatus();
        if (!isAdmin) {
            return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                nome: true,
                email: true,
                perfil: true,
                ativo: true,
            }
        });

        if (!usuario) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return NextResponse.json(usuario);
    } catch (error) {
        return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const isAdmin = await checkAdminStatus();
        if (!isAdmin) {
            return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
        }

        const data = await request.json();
        
        // Se e-mail foi enviado, validar se já não existe em outro usuário
        if (data.email) {
            const existingUser = await prisma.usuario.findUnique({
                where: { email: data.email }
            });

            if (existingUser && existingUser.id !== params.id) {
                return NextResponse.json({ error: "Já existe um usuário cadastrado com este e-mail" }, { status: 400 });
            }
        }

        const updateData: any = {
            nome: data.nome,
            email: data.email,
            perfil: data.perfil,
            ativo: data.ativo,
        };

        // Se uma nova senha for fornecida, faz o hash e atualiza
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
                ativo: true,
            }
        });

        return NextResponse.json(usuario);
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        const isAdmin = session?.user && (session.user as any).role === "admin";
        
        if (!isAdmin) {
            return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
        }

        // Prevenir que o usuário exclua a si mesmo
        const currentUserId = (session.user as any).id;
        if (currentUserId === params.id) {
            return NextResponse.json({ error: "Você não pode excluir seu próprio usuário. Peça a outro administrador para fazê-lo." }, { status: 400 });
        }

        // Para evitar apagar o último admin ou algo do tipo, podemos fazer apenas deleção lógica ou hard delete se tiver mais admins.
        await prisma.usuario.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 });
    }
}
