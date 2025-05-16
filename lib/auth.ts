import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// Tipagem para projeto
interface Project {
  id: string;
  name: string;
}

// Interface para estender a sessão do usuário
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  activeProject?: Project | null;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        // Usar asserção de tipo para acessar a propriedade activeProject
        const extendedUser = session.user as ExtendedUser;

        extendedUser.id = token.sub as string;
        extendedUser.name = token.name as string;
        extendedUser.email = token.email as string;
        extendedUser.image = token.picture as string;
        extendedUser.activeProject = token.activeProject as Project | null;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Após autenticação bem-sucedida, buscar o projeto ativo do usuário
        const dbUser = await db.user.findUnique({
          where: {
            id: user.id,
          },
          include: {
            activeProject: true,
          },
        });

        token.activeProject = dbUser?.activeProject || null;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
};

// Removendo as definições de tipo que agora estão no arquivo types/next-auth.d.ts
