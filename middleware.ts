import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rotas públicas que não precisam de autenticação
  const isPublicPath =
    pathname.startsWith("/auth") ||
    pathname === "/" ||
    pathname.startsWith("/api/docs") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts");

  // Verifica se o usuário está autenticado
  const isAuthenticated = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redireciona usuários autenticados para o dashboard se tentarem acessar páginas de auth
  if (isAuthenticated && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redireciona usuários não autenticados para login se tentarem acessar rotas protegidas
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Configura a middleware para rodar em rotas específicas
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
