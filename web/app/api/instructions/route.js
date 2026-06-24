import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AGENT_INSTRUCTIONS } from '../../constants';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const instruction = await prisma.instruction.findFirst({
      where: { type: 'PRESCRIPTION' },
      orderBy: { createdAt: 'desc' }
    });

    if (instruction) {
      return NextResponse.json({ instructions: instruction.content });
    }

    // Si no existe, devolvemos la constante por defecto
    return NextResponse.json({ instructions: AGENT_INSTRUCTIONS });
  } catch (error) {
    console.error('Error fetching instructions:', error);
    return NextResponse.json({ instructions: AGENT_INSTRUCTIONS });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "PRESCRIPTION")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { instructions } = body;

    if (typeof instructions !== 'string') {
      return NextResponse.json({ error: 'Instructions must be a string' }, { status: 400 });
    }

    await prisma.instruction.create({
      data: { type: 'PRESCRIPTION', content: instructions }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving instructions:', error);
    return NextResponse.json({ error: 'Failed to save instructions: ' + error.message }, { status: 500 });
  }
}
