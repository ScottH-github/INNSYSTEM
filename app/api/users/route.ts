import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await auth();
    // In a real app, check if session.user.role is ADMIN
    // if (session?.user?.role !== 'ADMIN') return new Response("Unauthorized", { status: 403 });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      // include: {
      //     _count: { select: { loginLogs: true } }
      // }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    // if (session?.user?.role !== 'ADMIN') return new Response("Unauthorized", { status: 403 });

    const json = await request.json();
    
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: json.email }
    });

    if (existing) {
       return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    let passwordHash = null;
    if (json.password) {
        passwordHash = await bcrypt.hash(json.password, 10);
    }

    const newUser = await prisma.user.create({
      data: {
        email: json.email,
        name: json.name,
        role: json.role || 'STAFF',
        status: 'ACTIVE',
        passwordHash
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("User Creation Error:", error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
