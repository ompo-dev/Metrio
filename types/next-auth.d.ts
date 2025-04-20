import { DefaultSession } from "next-auth";

// Estenda o tipo User do NextAuth
declare module "next-auth" {
  /**
   * Estendendo o tipo User do NextAuth
   */
  interface User {
    id: string;
    activeProject?: {
      id: string;
      name: string;
    } | null;
  }

  /**
   * Estendendo o tipo Session
   */
  interface Session {
    user: {
      id: string;
      activeProject?: {
        id: string;
        name: string;
      } | null;
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
