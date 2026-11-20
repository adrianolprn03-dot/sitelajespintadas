import { NextResponse } from "next/server";
import { MUNICIPIO } from "@/config/municipio";

export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json({
        status: "ok",
        municipio: MUNICIPIO.nome,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
}
