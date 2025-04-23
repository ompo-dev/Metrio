import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Este endpoint serve apenas para verificar o status do servidor WebSocket
    return NextResponse.json(
      { success: true, message: "Servidor WebSocket está em execução" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no servidor WebSocket:", error);
    return NextResponse.json(
      { error: "Erro no servidor WebSocket" },
      { status: 500 }
    );
  }
}
