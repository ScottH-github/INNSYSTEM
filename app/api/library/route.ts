import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.itemLibrary.findMany({
      orderBy: {
        category: 'asc',
      }
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch library items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const item = await prisma.itemLibrary.create({
      data: {
        category: json.category,
        name: json.name,
        spec: json.spec,
        unit: json.unit,
        unitPrice: parseFloat(json.unitPrice),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
