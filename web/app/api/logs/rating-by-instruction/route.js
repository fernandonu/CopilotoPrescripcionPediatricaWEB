import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module') || "ADMISSION";

    // 1. Obtener todas las instrucciones históricas ordenadas cronológicamente
    const instructions = await prisma.instruction.findMany({
      where: { type: module },
      orderBy: { createdAt: 'asc' }
    });

    if (instructions.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // 2. Obtener todos los logs de IA de ese módulo que tengan una valoración (rating)
    const logs = await prisma.aiAnalysisLog.findMany({
      where: {
        module: module,
        rating: { not: null }
      },
      orderBy: { createdAt: 'asc' }
    });

    // 3. Cruzar los datos
    const results = [];

    for (let i = 0; i < instructions.length; i++) {
      const currentInst = instructions[i];
      const nextInst = instructions[i + 1];

      // El rango de vigencia de la instrucción actual
      const startTime = new Date(currentInst.createdAt).getTime();
      const endTime = nextInst ? new Date(nextInst.createdAt).getTime() : Date.now();

      // Filtrar logs que fueron creados dentro de la vigencia de esta instrucción
      const logsInPeriod = logs.filter(log => {
        const logTime = new Date(log.createdAt).getTime();
        return logTime >= startTime && logTime < endTime;
      });

      const totalRatings = logsInPeriod.length;
      let averageRating = 0;

      if (totalRatings > 0) {
        const sum = logsInPeriod.reduce((acc, log) => acc + log.rating, 0);
        averageRating = sum / totalRatings;
      }

      results.push({
        id: currentInst.id,
        date: currentInst.createdAt,
        snippet: currentInst.content.substring(0, 100) + '...',
        totalRatings,
        averageRating: parseFloat(averageRating.toFixed(2))
      });
    }

    return NextResponse.json({ data: results });

  } catch (error) {
    console.error('Error fetching rating by instruction stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats: ' + error.message }, { status: 500 });
  }
}
