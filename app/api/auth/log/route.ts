
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
       return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const json = await request.json();
    
    if (json.action === 'LOGOUT') {
        await prisma.loginLog.create({
            data: {
                userId: session.user.id,
                action: 'LOGOUT',
                userAgent: request.headers.get('user-agent') || 'Unknown'
            }
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Logging failed' }, { status: 500 });
  }
}
