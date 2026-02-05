
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Validate token
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetRecord) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    if (resetRecord.expires < new Date()) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash }
    });

    // Delete used token (and potentially all tokens for this email)
    await prisma.passwordResetToken.delete({
       where: { id: resetRecord.id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
