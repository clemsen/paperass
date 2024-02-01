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
          return user;
        }
        return null;
      },
      credentials: {
        email: { label: "Email", type: "text " },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
});

export { handler as GET, handler as POST };
