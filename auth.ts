import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers } = NextAuth({
  providers: [
    Credentials({
      id: 'credentials-user',
      name: 'Connexion',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        // Appel à ton backend d'authentification
        const res = await fetch('http://localhost:8081/api/v1/auth/signin', {
          method: 'POST',
          body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) return null;
        const data = await res.json();

        // On attend { user: {...}, accessToken: "..." }
        if (data.user && data.accessToken) {
          return {
            id: data.user.id,
            name: `${data.user.firstName} ${data.user.lastName}`,
            email: data.user.email,
            token: data.accessToken,
            role: data.user.role ?? null,
          } as unknown as User;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.token = user.token; // Le token backend
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.token = token.token as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
