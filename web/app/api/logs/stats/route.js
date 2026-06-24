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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const module = searchParams.get('module') || "ADMISSION";

    const dateFilter = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      // Ajustar para final del día
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }

    const whereClause = { module };
    if (startDate || endDate) {
      whereClause.createdAt = dateFilter;
    }

    // IA Logs
    const aiLogs = await prisma.aiAnalysisLog.findMany({
      where: whereClause,
      include: { user: { select: { name: true, username: true } } },
      orderBy: { createdAt: 'desc' }
    });

    // Manual Logs
    const manualLogs = await prisma.manualEntryLog.findMany({
      where: whereClause,
      include: { user: { select: { name: true, username: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const calcStats = (logs) => {
      if (!logs.length) return { total: 0, avg: 0, min: 0, max: 0, sum: 0 };
      const times = logs.map(l => l.durationSeconds);
      const sum = times.reduce((a, b) => a + b, 0);
      return {
        total: logs.length,
        sum: sum,
        avg: Math.round(sum / logs.length),
        min: Math.min(...times),
        max: Math.max(...times)
      };
    };

    const aiStats = calcStats(aiLogs);
    const manualStats = calcStats(manualLogs);

    let savingsPercentage = 0;
    let speedRatio = 0;

    if (aiStats.avg > 0 && manualStats.avg > 0) {
      if (manualStats.avg > aiStats.avg) {
        savingsPercentage = Math.round(((manualStats.avg - aiStats.avg) / manualStats.avg) * 100);
        speedRatio = (manualStats.avg / aiStats.avg).toFixed(1);
      }
    }

    return NextResponse.json({
      stats: {
        ai: aiStats,
        manual: manualStats,
        comparison: {
          savingsPercentage,
          speedRatio,
          diffAvg: Math.abs(manualStats.avg - aiStats.avg)
        }
      },
      logs: {
        ai: aiLogs,
        manual: manualLogs
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats: ' + error.message }, { status: 500 });
  }
}
