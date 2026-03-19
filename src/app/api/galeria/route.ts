import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const album = searchParams.get("album");

    const where: any = { publicada: true };
    if (album) where.album = album;

    try {
        const items = await prisma.galeriaFoto.findMany({
            where,
            orderBy: { criadoEm: "desc" },
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const foto = await prisma.galeriaFoto.create({
            data: body,
        });
        return NextResponse.json(foto, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
