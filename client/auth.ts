import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { cookies } from "next/headers";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ token, session }) {
      const cookieStore = cookies();
      const userObjCookie = cookieStore.get("userObj");

      if (userObjCookie) {
        let cookie = JSON.parse(userObjCookie.value);
        session.user.name = cookie.full_name;
        session.user.id = cookie.user_id;
      }
      console.log("session:", { sessionToken: token, session });
      return session;
    },
    async jwt({ token }) {
      const cookieStore = cookies();
      const userObjCookie = cookieStore.get("userObj");

      if (userObjCookie) {
        let cookie = JSON.parse(userObjCookie.value);
        token.access_token = cookie.access_token;
        token.full_name = cookie.full_name;
        token.refresh_token = cookie.refresh_token;
        token.role = cookie.role;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
