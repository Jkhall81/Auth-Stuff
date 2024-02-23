import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { cookies } from "next/headers";
import { fetcher } from "./lib/apiUtils";

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
      // console.log("session:", { sessionToken: token, session });
      return session;
    },
    async jwt({ token, account }) {
      const cookieStore = cookies();
      const userObjCookie = cookieStore.get("userObj");

      if (account?.access_token) {
        // token.account_obj = account;
        const apiEndpoint = "google/";
        const response = await fetcher<{
          email: string;
          full_name: string;
          access_token: string;
          refresh_token: string;
        }>(apiEndpoint, "POST", { access_token: account.id_token });
        const userObjString = JSON.stringify({
          email: response.email,
          full_name: response.full_name,
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        });
        cookies().set("userObj", userObjString);
      }

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
