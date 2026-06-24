import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { startTime, endTime, durationSeconds, durationString, inputText, module = "ADMISSION" } = body;

    const log = await prisma.manualEntryLog.create({
      data: {
        userId: session.user.id,
        module,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        durationSeconds: parseInt(durationSeconds),
        durationString,
        inputText,
      }
    });

    return NextResponse.json({ success: true, logId: log.id });
  } catch (error) {
    console.error('Error saving Manual log:', error);
    return NextResponse.json({ error: 'Failed to save log: ' + error.message }, { status: 500 });
  }
}
