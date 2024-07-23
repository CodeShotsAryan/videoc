// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {JWT} from 'next-auth/jwt'

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {
    async jwt({ token, account }:any) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      
      return token;
    },
    async session({ session, token }:any) {
      session.accessToken = token.accessToken;
      
      return session;
    },
    
  },
  
};

const handler  = NextAuth(authOptions);

export { handler as GET, handler as POST };