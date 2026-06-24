import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Todos los roles autorizados en este módulo pueden ver el historial
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "ADMISSION")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const history = await prisma.instruction.findMany({
      where: { type: 'ADMISSION' },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching instructions history:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
