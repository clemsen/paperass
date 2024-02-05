import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        const supabase = await createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_KEY
        );
        const res = await supabase.auth.signInWithPassword(credentials);
        const user = await res.data.user;
        if (user && user.aud == "authenticated") {
          return { ...user, access_token: res.data.session.access_token };
        }
        return null;
      },
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.id;
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user_id = token.user_id;
      session.access_token = token.access_token;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 4, // 4 hours
  },
});

export { handler as GET, handler as POST };
