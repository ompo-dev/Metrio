import { SchemaField } from "./types";

/**
 * Converter um esquema em formato de string para um array de campos
 */
export function parseSchemaToFields(schema: string): SchemaField[] {
  try {
    // Remover colchetes e chaves extras para obter apenas o objeto interno
    const cleanSchema = schema
      .replace(/^\[\s*{/, "")
      .replace(/}\s*\]$/, "")
      .trim();

    // Dividir em linhas e processar cada campo
    const lines = cleanSchema.split(",\n");

    return lines.map((line, index) => {
      // Extrair nome e tipo
      const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
      if (!match)
        return {
          id: `temp-${index}`,
          name: "campo",
          type: "string",
          required: true,
        };

      const [, name, type] = match;
      return {
        id: `${index + 1}`,
        name,
        type: (type as any) || "string",
        required: true,
        description: "",
      };
    });
  } catch (error) {
    console.error("Erro ao analisar schema:", error);
    return [
      { id: "1", name: "userId", type: "number", required: true },
      { id: "2", name: "keyHook", type: "string", required: true },
    ];
  }
}

/**
 * Gerar uma chave secreta aleatória
 */
export function generateSecretKey(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "whsec_";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
