
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/finance?projectId=...
// Returns financial summary for a project
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  try {
    const records = await prisma.financeRecord.findMany({
      where: { projectId },
      orderBy: { date: 'desc' }
    });

    const income = records
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0);

    const expense = records
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0);

    const profit = income - expense;
    const margin = income > 0 ? (profit / income) * 100 : 0;

    return NextResponse.json({
      summary: {
        totalIncome: income,
        totalExpense: expense,
        netProfit: profit,
        profitMargin: margin
      },
      records
    });
  } catch (error) {
    console.error('Finance API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/finance
// Create a new finance record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, type, category, amount, date, description, invoiceNo } = body;

    const record = await prisma.financeRecord.create({
      data: {
        projectId,
        type,
        category,
        amount: parseFloat(amount),
        date: new Date(date),
        description,
        invoiceNo
      }
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Finance Create Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
