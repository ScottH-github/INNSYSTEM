'use server';

import { signIn, signOut, auth } from '@/auth';
import { prisma } from '@/lib/prisma'; // Direct prisma access in server action allowed? Yes.

export async function handleGoogleLogin() {
  await signIn('google', { redirectTo: '/' });
}

export async function handleSignOut() {
  try {
     const session = await auth();
     if (session?.user?.id) {
         // Log directly to DB since we are server-side
         await prisma.loginLog.create({
             data: {
                 userId: session.user.id,
                 action: 'LOGOUT',
                 userAgent: 'SERVER_ACTION_SIGNOUT'
             }
         });
     }
  } catch (e) {
      console.error("Logout Log Error", e);
  }
  await signOut({ redirectTo: '/login' });
}
