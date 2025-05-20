import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { SchemaField } from "../types";
import { WebhookFormData } from "../types";

interface ExampleRequestProps {
  fields: SchemaField[];
  formData: WebhookFormData;
}

export function ExampleRequest({ fields, formData }: ExampleRequestProps) {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-sm font-medium mb-2">Exemplo de Requisição</h3>
      <div className="rounded-md overflow-hidden">
        <SyntaxHighlighter
          language="typescript"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            fontSize: "0.75rem",
            borderRadius: "0.375rem",
          }}
          showLineNumbers
        >
          {`// Exemplo de requisição com Axios e TypeScript
import axios from 'axios';

// Definição da interface com os tipos corretos
interface WebhookPayload {${fields
            .map((field) => {
              let typeDefinition = "";
              switch (field.type) {
                case "string":
                  typeDefinition = "string";
                  break;
                case "number":
                  typeDefinition = "number";
                  break;
                case "boolean":
                  typeDefinition = "boolean";
                  break;
                case "object":
                  typeDefinition = "Record<string, any>";
                  break;
                case "array":
                  typeDefinition = "any[]";
                  break;
              }
              return `\n  ${field.name}${
                field.required ? "" : "?"
              }: ${typeDefinition}; // ${field.description || ""}`;
            })
            .join("")}\n}

// Função para enviar o webhook
async function enviarWebhook() {
  try {
    const data: WebhookPayload = {${fields
      .map((field) => {
        let exampleValue = "";
        switch (field.type) {
          case "string":
            exampleValue =
              field.name === "keyHook"
                ? `'${formData.secret || "whsec_...123"}'`
                : "'valor de exemplo'";
            break;
          case "number":
            exampleValue = "123";
            break;
          case "boolean":
            exampleValue = "true";
            break;
          case "object":
            exampleValue = '{ chave: "valor" }';
            break;
          case "array":
            exampleValue = '["item1", "item2"]';
            break;
        }
        return `\n      ${field.name}: ${exampleValue},`;
      })
      .join("")}
    };

    const response = await axios.post(
      'https://api.metrio.com/${formData.hookName || "seu-hook"}',
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Webhook enviado com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
    throw error;
  }
}`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
