import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Métricas SaaS API",
        version: "1.0.0",
        description: "API para a plataforma Métricas SaaS",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          User: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              name: {
                type: "string",
              },
              email: {
                type: "string",
                format: "email",
              },
              emailVerified: {
                type: "string",
                format: "date-time",
                nullable: true,
              },
              image: {
                type: "string",
                nullable: true,
              },
              createdAt: {
                type: "string",
                format: "date-time",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
              },
            },
          },
          RegisterRequest: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
              name: {
                type: "string",
              },
              email: {
                type: "string",
                format: "email",
              },
              password: {
                type: "string",
                format: "password",
                minLength: 6,
              },
            },
          },
          LoginRequest: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: {
                type: "string",
                format: "email",
              },
              password: {
                type: "string",
                format: "password",
              },
            },
          },
          ErrorResponse: {
            type: "object",
            properties: {
              error: {
                type: "string",
              },
              details: {
                type: "object",
              },
            },
          },
        },
      },
    },
  });
  return spec;
};
