
'use server';
import { prisma } from '@/lib/prisma';

export async function validateResetToken(token: string) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token }
  });

  if (!record) return { valid: false, error: 'Token not found' };
  if (record.expires < new Date()) return { valid: false, error: 'Token expired' };

  return { valid: true, email: record.email };
}
