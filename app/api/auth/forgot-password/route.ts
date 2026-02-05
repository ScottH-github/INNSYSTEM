
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if user not found to prevent enumeration
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({ success: true });
    }

    // Generate token
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    });

    // In production, send email via SendGrid/AWS SES
    // For MVP, log to console
    console.log(`
    === PASSWORD RESET EMAIL ===
    To: ${email}
    Link: http://localhost:3000/login/reset?token=${token}
    ============================
    `);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
