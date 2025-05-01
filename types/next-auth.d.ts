import NextAuth, { DefaultSession } from "next-auth";

// Interface para estender o tipo User
interface IUser {
  id: string;
}

// Interface para projeto
interface Project {
  id: string;
  name: string;
}

declare module "next-auth" {
  /**
   * Extensão do tipo User
   */
  interface User extends IUser {}

  /**
   * Extensão do tipo Session
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Estendendo o JWT token */
  interface JWT {
    sub: string;
    activeProject?: {
      id: string;
      name: string;
    } | null;
  }
}
