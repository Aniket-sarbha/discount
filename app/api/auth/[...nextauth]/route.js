// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';
import { getUserByEmail } from '@/lib/user';

export const authOptions = {
  adapter: PrismaAdapter(prisma),  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'pending', // Set role to 'pending' for new Google sign-ins
        };
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        
        const user = await getUserByEmail(credentials.email);
        
        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }
        
        const isPasswordCorrect = await compare(
          credentials.password,
          user.password
        );
        
        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role || 'pending', // Include role, defaulting to 'pending' if not set
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        // Include role in the token
        token.role = user.role;
      }
      
      // If this is a sign-in with Google, we need to manually set a 'pending' role
      // since we don't have the role selection yet
      if (account?.provider === 'google' && !token.role) {
        token.role = 'pending';
      }
      
      return token;
    },
    // Properly handle redirect to support callbackUrl
    async redirect({ url, baseUrl }) {
      // Redirect to role selection page if the user doesn't have a role yet
      // But only if we're not already going to the role selection page
      if (!url.includes('/role-selection') && 
          !url.includes('/api/auth/signin') && 
          !url.includes('/api/auth/callback')) {
        return `${baseUrl}/role-selection`;
      }
      
      // If the URL is absolute and belongs to our app, use it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // If the URL is relative (starts with /), join it with the base URL
      else if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Otherwise, return to the base URL
      return baseUrl;
    }
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };