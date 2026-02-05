import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.passwordHash) return null;
 
          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
          if (passwordsMatch) return user;
        }
 
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Sync user with database
        // 1. Check if user exists by email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        let userId = existingUser?.id;

        if (!existingUser) {
          // 2. Create new user if not exists
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || 'Unknown',
              avatar: user.image, // Mapped to 'avatar' in schema
              googleId: user.id, // Google ID
              role: 'STAFF',     // Default role
              status: 'ACTIVE'
            }
          });
          userId = newUser.id;
        } else {
          // 3. Update existing user (e.g. update avatar or googleId)
          if (!existingUser.googleId || existingUser.googleId !== user.id) {
             await prisma.user.update({
               where: { id: existingUser.id },
               data: { googleId: user.id, avatar: user.image }
             });
          }
        }
        
        // 4. Log the login event
        if (userId) {
           await prisma.loginLog.create({
             data: {
               userId: userId,
               action: 'LOGIN',
               userAgent: 'NEXT_AUTH_HOOK',
             }
           });
        }
        
        // Pass the internal ID to the token/session
        user.id = userId; // Allow this to flow to jwt callback
        return true;

      } catch (error) {
        console.error("SignIn Sync Error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // User object is only passed on first sign in
      if (user) {
        token.id = user.id;
        // Fetch role from DB needed? Or optimistically trust signIn?
        // Better to fetch role in session or put in token now.
        // For simplicity, let's assume we want role in token.
        // We can fetch it again or rely on what we just did. 
        // Let's keep it simple: token.sub is usually subject.
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
        
        // Fetch fresh role/status
        const dbUser = await prisma.user.findUnique({
             where: { id: token.userId as string },
             select: { role: true, status: true }
        });
        
        if (dbUser) {
            // @ts-ignore
            session.user.role = dbUser.role;
            // @ts-ignore
            session.user.status = dbUser.status;
        }
      }
      return session;
    }
  }
})
