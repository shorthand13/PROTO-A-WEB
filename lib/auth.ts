import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // LINE Login (custom OAuth provider)
    {
      id: "line",
      name: "LINE",
      type: "oauth",
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      authorization: {
        url: "https://access.line.me/oauth2/v2.1/authorize",
        params: { scope: "profile openid email", response_type: "code" },
      },
      token: {
        url: "https://api.line.me/oauth2/v2.1/token",
        async conform(response: Response) {
          const body = await response.json();
          // Remove id_token to prevent HS256 JWT validation error
          const { id_token: _, ...rest } = body;
          return new Response(JSON.stringify(rest), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
          });
        },
      },
      userinfo: "https://api.line.me/v2/profile",
      profile(profile) {
        return {
          id: profile.userId,
          name: profile.displayName,
          image: profile.pictureUrl,
        };
      },
      checks: ["state"],
    },
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});
