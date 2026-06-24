import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CLINICAL_EXAMPLES_INGRESO } from '../../constants';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const example = await prisma.clinicalExample.findUnique({
      where: { type: 'ADMISSION' }
    });

    if (example) {
      return NextResponse.json({ examples: JSON.parse(example.content) });
    }

    // Si no existe, devolvemos la constante por defecto
    return NextResponse.json({ examples: CLINICAL_EXAMPLES_INGRESO });
  } catch (error) {
    console.error('Error fetching examples:', error);
    return NextResponse.json({ examples: CLINICAL_EXAMPLES_INGRESO });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "ADMISSION")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { examples } = body;

    if (!Array.isArray(examples)) {
      return NextResponse.json({ error: 'Examples must be an array' }, { status: 400 });
    }

    const content = JSON.stringify(examples, null, 2);

    await prisma.clinicalExample.upsert({
      where: { type: 'ADMISSION' },
      update: { content },
      create: { type: 'ADMISSION', content }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving examples:', error);
    return NextResponse.json({ error: 'Failed to save examples: ' + error.message }, { status: 500 });
  }
}
