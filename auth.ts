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
    maxAge: 60 * 60 * 8, // 8 heures au lieu de 24
    updateAge: 60 * 60, // Mise à jour toutes les heures
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
        token.iat = Math.floor(Date.now() / 1000);
        token.exp = Math.floor(Date.now() / 1000) + (8 * 60 * 60); // 8 heures
      }
      // Vérifier si le token a expiré
      if (token.exp && Date.now() >= token.exp * 1000) {
        return { ...token, error: 'RefreshAccessTokenError' };
      }
      return token;
    },
    async session({ session, token }) {
      // Si le token a une erreur, marquer la session comme expirée
      if (token.error) {
        (session as any).error = token.error;
      }
      session.user.id = token.id as string;
      session.user.token = token.token as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  events: {
    async signOut() {
      // Nettoyer les données de session côté client
      console.log('Session expirée - déconnexion automatique');
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
