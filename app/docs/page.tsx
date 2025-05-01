"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import Link from "next/link";

// Configuração para suprimir erros de ciclo de vida legados
const originalConsoleError = console.error;
if (typeof window !== "undefined") {
  console.error = (...args) => {
    if (
      args[0]?.includes?.("Warning: Using UNSAFE_componentWillReceiveProps") ||
      args[0]?.includes?.("Please update the following components:")
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

// Importar dinamicamente o componente para evitar problemas com SSR
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((response) => response.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Documentação da API</h1>

      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          Documentações Específicas
        </h2>
        <ul className="list-disc pl-8">
          <li>
            <Link
              href="/docs/notifications"
              className="text-blue-600 hover:underline"
            >
              Sistema de Notificações em Tempo Real
            </Link>{" "}
            - Documentação completa do sistema de notificações com WebSockets e
            Pub/Sub
          </li>
          {/* Adicione mais links de documentação específica aqui conforme necessário */}
        </ul>
      </div>

      {/* @ts-ignore - Ignorar erros de tipo para resolver os avisos de componentWillReceiveProps */}
      <SwaggerUI
        spec={spec}
        supportedSubmitMethods={["get", "post", "put", "delete", "patch"]}
        docExpansion="list"
        defaultModelsExpandDepth={-1}
      />
    </div>
  );
}
