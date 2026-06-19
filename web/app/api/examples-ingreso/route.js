import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { CLINICAL_EXAMPLES_INGRESO } from '../../constants';

const FILE_PATH = path.join(process.cwd(), 'examples-ingreso.json');

export async function GET() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return NextResponse.json({ examples: JSON.parse(data) });
  } catch (error) {
    // If the file does not exist, return default examples
    return NextResponse.json({ examples: CLINICAL_EXAMPLES_INGRESO });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { examples } = body;

    if (!Array.isArray(examples)) {
      return NextResponse.json({ error: 'Examples must be an array' }, { status: 400 });
    }

    await fs.writeFile(FILE_PATH, JSON.stringify(examples, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving examples:', error);
    return NextResponse.json({ error: 'Failed to save examples: ' + error.message }, { status: 500 });
  }
}
