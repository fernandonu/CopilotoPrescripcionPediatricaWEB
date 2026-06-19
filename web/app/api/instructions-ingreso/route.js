import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { AGENT_INSTRUCTIONS_INGRESO } from '../../constants';

const FILE_PATH = path.join(process.cwd(), 'instructions-ingreso.txt');

export async function GET() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return NextResponse.json({ instructions: data });
  } catch (error) {
    // If the file does not exist, return default instructions
    return NextResponse.json({ instructions: AGENT_INSTRUCTIONS_INGRESO });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { instructions } = body;

    if (typeof instructions !== 'string') {
      return NextResponse.json({ error: 'Instructions must be a string' }, { status: 400 });
    }

    await fs.writeFile(FILE_PATH, instructions, 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving instructions:', error);
    return NextResponse.json({ error: 'Failed to save instructions: ' + error.message }, { status: 500 });
  }
}
