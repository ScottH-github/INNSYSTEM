
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    // if (session?.user?.role !== 'ADMIN') return new Response("Forbidden", { status: 403 });

    const { id } = await params;
    const json = await request.json();
    
    const updated = await prisma.user.update({
      where: { id },
      data: {
        role: json.role,
        status: json.status,
        name: json.name
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    // if (session?.user?.role !== 'ADMIN') return new Response("Forbidden", { status: 403 });

    const { id } = await params;
    
    // Check if target is self
    if (session?.user?.id === id) {
        return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
