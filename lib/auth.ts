import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Decode LINE's id_token (HS256 JWT) to extract email
function decodeLineIdToken(idToken: string): { email?: string } {
  try {
    const payload = idToken.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    return { email: decoded.email };
  } catch {
    return {};
  }
}

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
          const cloned = response.clone();
          const body = await cloned.json();
          // Extract email from id_token before removing it
          const lineEmail = body.id_token
            ? decodeLineIdToken(body.id_token).email
            : undefined;
          // Store email temporarily for the profile callback
          if (lineEmail) {
            (globalThis as Record<string, unknown>).__lineEmail = lineEmail;
          }
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
        const email = (globalThis as Record<string, unknown>).__lineEmail as
          | string
          | undefined;
        delete (globalThis as Record<string, unknown>).__lineEmail;
        return {
          id: profile.userId,
          name: profile.displayName,
          email: email ?? undefined,
          image: profile.pictureUrl,
        };
      },
      checks: ["state"],
    },
  ],
  callbacks: {
    async signIn({ user, account }) {
      const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "login",
              name: user.name ?? "",
              email: user.email ?? "",
              provider: account?.provider ?? "",
              image: user.image ?? "",
              loggedInAt: new Date().toISOString(),
            }),
          });
        } catch (err) {
          console.error("Login webhook error:", err);
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});
