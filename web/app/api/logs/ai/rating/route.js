import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { logId, rating } = body;

    if (!logId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const log = await prisma.aiAnalysisLog.findUnique({
      where: { id: logId }
    });

    if (!log) {
      return NextResponse.json({ error: "Log no encontrado" }, { status: 404 });
    }

    // Opcional: Validar que el log pertenezca al usuario actual
    if (log.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "No autorizado para calificar este log" }, { status: 403 });
    }

    const updatedLog = await prisma.aiAnalysisLog.update({
      where: { id: logId },
      data: { rating }
    });

    return NextResponse.json({ success: true, log: updatedLog });
  } catch (error) {
    console.error('Error updating AI log rating:', error);
    return NextResponse.json({ error: 'Failed to update rating: ' + error.message }, { status: 500 });
  }
}
