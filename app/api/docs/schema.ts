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
              activeProjectId: {
                type: "string",
                nullable: true,
              },
            },
          },
          Project: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              name: {
                type: "string",
              },
              logoIcon: {
                type: "string",
              },
              type: {
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
              userId: {
                type: "string",
              },
            },
          },
          ProjectRequest: {
            type: "object",
            required: ["name", "logoIcon"],
            properties: {
              name: {
                type: "string",
              },
              logoIcon: {
                type: "string",
              },
              type: {
                type: "string",
                nullable: true,
              },
            },
          },
          Webhook: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              name: {
                type: "string",
              },
              technicalName: {
                type: "string",
              },
              description: {
                type: "string",
                nullable: true,
              },
              isActive: {
                type: "boolean",
              },
              secretToken: {
                type: "string",
              },
              events: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              headers: {
                type: "object",
                nullable: true,
              },
              payloadSchema: {
                type: "object",
              },
              createdAt: {
                type: "string",
                format: "date-time",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
              },
              userId: {
                type: "string",
              },
              projectId: {
                type: "string",
              },
            },
          },
          WebhookRequest: {
            type: "object",
            required: [
              "name",
              "technicalName",
              "secretToken",
              "projectId",
              "payloadSchema",
            ],
            properties: {
              name: {
                type: "string",
              },
              technicalName: {
                type: "string",
              },
              description: {
                type: "string",
                nullable: true,
              },
              secretToken: {
                type: "string",
              },
              events: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              headers: {
                type: "object",
                nullable: true,
              },
              payloadSchema: {
                type: "object",
              },
              projectId: {
                type: "string",
              },
            },
          },
          DataWebhook: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "ID do webhook associado a este dado",
              },
              data: {
                type: "object",
                description: "Dados JSON recebidos pelo webhook",
              },
              createdAt: {
                type: "string",
                format: "date-time",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
              },
              webhookName: {
                type: "string",
                description: "Nome do webhook",
              },
              projectId: {
                type: "string",
                description: "ID do projeto associado",
              },
            },
          },
          WebhookPayload: {
            type: "object",
            required: ["keyHook"],
            properties: {
              keyHook: {
                type: "string",
                description: "Token secreto para autenticação do webhook",
              },
            },
            additionalProperties: true,
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
          SuccessResponse: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
              },
              message: {
                type: "string",
              },
            },
          },
          Invite: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              email: {
                type: "string",
                format: "email",
              },
              status: {
                type: "string",
                enum: ["pending", "accepted", "rejected", "expired"],
              },
              inviteToken: {
                type: "string",
              },
              createdAt: {
                type: "string",
                format: "date-time",
              },
              expiresAt: {
                type: "string",
                format: "date-time",
              },
              senderId: {
                type: "string",
              },
              recipientId: {
                type: "string",
                nullable: true,
              },
              projectId: {
                type: "string",
              },
              sender: {
                $ref: "#/components/schemas/User",
              },
              recipient: {
                $ref: "#/components/schemas/User",
                nullable: true,
              },
              project: {
                $ref: "#/components/schemas/Project",
              },
            },
          },
          InviteRequest: {
            type: "object",
            required: ["email", "projectId"],
            properties: {
              email: {
                type: "string",
                format: "email",
              },
              projectId: {
                type: "string",
              },
            },
          },
          InviteActionRequest: {
            type: "object",
            required: ["action"],
            properties: {
              action: {
                type: "string",
                enum: ["accept", "reject"],
              },
            },
          },
          Member: {
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
              role: {
                type: "string",
              },
              status: {
                type: "string",
              },
              lastActive: {
                type: "string",
              },
            },
          },
          Role: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              name: {
                type: "string",
              },
              description: {
                type: "string",
              },
              members: {
                type: "integer",
              },
            },
          },
          MemberRequest: {
            type: "object",
            required: ["name", "email", "role"],
            properties: {
              name: {
                type: "string",
              },
              email: {
                type: "string",
                format: "email",
              },
              role: {
                type: "string",
              },
              projectId: {
                type: "string",
                description:
                  "ID do projeto (opcional, usa o projeto ativo se não fornecido)",
              },
            },
          },
          Team: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "ID único da equipe",
              },
              name: {
                type: "string",
                description: "Nome da equipe",
              },
              description: {
                type: "string",
                description: "Descrição da equipe",
                nullable: true,
              },
              iconColor: {
                type: "string",
                description: "Cor do ícone da equipe",
                nullable: true,
              },
              isActive: {
                type: "boolean",
                description: "Status de ativação da equipe",
              },
              createdAt: {
                type: "string",
                format: "date-time",
                description: "Data de criação da equipe",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                description: "Data da última atualização da equipe",
              },
              projectId: {
                type: "string",
                description: "ID do projeto ao qual a equipe pertence",
              },
              memberCount: {
                type: "integer",
                description: "Número de membros na equipe",
              },
            },
            required: [
              "id",
              "name",
              "isActive",
              "createdAt",
              "updatedAt",
              "projectId",
            ],
          },
          TeamMember: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "ID único do membro na equipe",
              },
              role: {
                type: "string",
                description: "Função do membro na equipe (lead, member, etc.)",
              },
              joinedAt: {
                type: "string",
                format: "date-time",
                description: "Data em que o membro entrou na equipe",
              },
              teamId: {
                type: "string",
                description: "ID da equipe",
              },
              projectMemberId: {
                type: "string",
                description: "ID do membro do projeto",
              },
              user: {
                $ref: "#/components/schemas/User",
                description: "Informações do usuário",
              },
            },
            required: ["id", "role", "joinedAt", "teamId", "projectMemberId"],
          },
          CreateTeamRequest: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Nome da equipe",
              },
              description: {
                type: "string",
                description: "Descrição da equipe",
                nullable: true,
              },
              iconColor: {
                type: "string",
                description: "Cor do ícone da equipe",
                nullable: true,
              },
              projectId: {
                type: "string",
                description: "ID do projeto ao qual a equipe pertence",
              },
            },
            required: ["name", "projectId"],
          },
          UpdateTeamRequest: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Nome da equipe",
              },
              description: {
                type: "string",
                description: "Descrição da equipe",
                nullable: true,
              },
              iconColor: {
                type: "string",
                description: "Cor do ícone da equipe",
                nullable: true,
              },
              isActive: {
                type: "boolean",
                description: "Status de ativação da equipe",
              },
            },
          },
          AddTeamMemberRequest: {
            type: "object",
            properties: {
              projectMemberId: {
                type: "string",
                description:
                  "ID do membro do projeto a ser adicionado à equipe",
              },
              role: {
                type: "string",
                description: "Função do membro na equipe (lead, member, etc.)",
                default: "member",
              },
            },
            required: ["projectMemberId"],
          },
          TeamsResponse: {
            type: "object",
            properties: {
              teams: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Team",
                },
              },
            },
          },
          TeamResponse: {
            type: "object",
            properties: {
              team: {
                $ref: "#/components/schemas/Team",
              },
            },
          },
          TeamMembersResponse: {
            type: "object",
            properties: {
              members: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/TeamMember",
                },
              },
            },
          },
          TeamMemberResponse: {
            type: "object",
            properties: {
              member: {
                $ref: "#/components/schemas/TeamMember",
              },
            },
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
      paths: {
        "/api/auth/login": {
          post: {
            tags: ["Autenticação"],
            summary: "Login de usuário",
            description: "Autenticar um usuário com email e senha",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/LoginRequest",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Login bem-sucedido",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        user: {
                          $ref: "#/components/schemas/User",
                        },
                        token: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Credenciais inválidas",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/register": {
          post: {
            tags: ["Autenticação"],
            summary: "Registro de novo usuário",
            description: "Criar uma nova conta de usuário",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/RegisterRequest",
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Usuário registrado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
              400: {
                description: "Dados inválidos ou usuário já existe",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/projects": {
          get: {
            tags: ["Projetos"],
            summary: "Listar projetos",
            description: "Obter todos os projetos do usuário autenticado",
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Lista de projetos",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Project",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ["Projetos"],
            summary: "Criar projeto",
            description: "Criar um novo projeto",
            security: [{ BearerAuth: [] }],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProjectRequest",
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Projeto criado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Project",
                    },
                  },
                },
              },
              400: {
                description: "Dados inválidos",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/projects/active": {
          get: {
            tags: ["Projetos"],
            summary: "Obter projeto ativo",
            description: "Obter o projeto ativo do usuário",
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Projeto ativo",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Project",
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              404: {
                description: "Projeto ativo não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/webhooks": {
          get: {
            tags: ["Webhooks"],
            summary: "Listar webhooks",
            description:
              "Obter todos os webhooks do usuário ou de um projeto específico",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "projectId",
                in: "query",
                description: "ID do projeto para filtrar webhooks",
                required: false,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Lista de webhooks",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Webhook",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ["Webhooks"],
            summary: "Criar webhook",
            description: "Criar um novo webhook",
            security: [{ BearerAuth: [] }],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/WebhookRequest",
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Webhook criado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Webhook",
                    },
                  },
                },
              },
              400: {
                description: "Dados inválidos",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/webhooks/{id}": {
          get: {
            tags: ["Webhooks"],
            summary: "Obter webhook",
            description: "Obter detalhes de um webhook específico",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "id",
                in: "path",
                description: "ID do webhook",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Detalhes do webhook",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Webhook",
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              404: {
                description: "Webhook não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          put: {
            tags: ["Webhooks"],
            summary: "Atualizar webhook",
            description: "Atualizar um webhook existente",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "id",
                in: "path",
                description: "ID do webhook",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/WebhookRequest",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Webhook atualizado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Webhook",
                    },
                  },
                },
              },
              400: {
                description: "Dados inválidos",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              404: {
                description: "Webhook não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          delete: {
            tags: ["Webhooks"],
            summary: "Excluir webhook",
            description: "Excluir um webhook existente",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "id",
                in: "path",
                description: "ID do webhook",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Webhook excluído com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/SuccessResponse",
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              404: {
                description: "Webhook não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/webhooks/{id}/toggle": {
          post: {
            tags: ["Webhooks"],
            summary: "Ativar/desativar webhook",
            description: "Alternar o status de ativo/inativo de um webhook",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "id",
                in: "path",
                description: "ID do webhook",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Status do webhook alterado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Webhook",
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              404: {
                description: "Webhook não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/webhook/{projectId}/{webhookId}": {
          post: {
            tags: ["Webhook Callbacks"],
            summary: "Receber dados de webhook",
            description:
              "Endpoint para receber dados de sistemas externos via webhook",
            parameters: [
              {
                name: "projectId",
                in: "path",
                description: "ID do projeto",
                required: true,
                schema: {
                  type: "string",
                },
              },
              {
                name: "webhookId",
                in: "path",
                description: "ID do webhook",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/WebhookPayload",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Dados recebidos com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/SuccessResponse",
                    },
                  },
                },
              },
              400: {
                description: "Payload inválido ou webhook inativo",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              401: {
                description: "Token inválido",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              404: {
                description: "Webhook não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/webhook-data": {
          get: {
            tags: ["Webhook Data"],
            summary: "Listar dados de webhooks",
            description: "Obter todos os dados recebidos por webhooks",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "projectId",
                in: "query",
                description: "ID do projeto para filtrar dados",
                required: false,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Lista de dados de webhooks",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/DataWebhook",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/webhook-data/{id}": {
          get: {
            tags: ["Webhook Data"],
            summary: "Obter dados de um webhook específico",
            description: "Obter dados recebidos por um webhook específico",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "id",
                in: "path",
                description: "ID do webhook",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Dados do webhook",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/DataWebhook",
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              404: {
                description: "Dados não encontrados",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/projects/invite": {
          post: {
            tags: ["Convites"],
            summary: "Criar um novo convite",
            description:
              "Cria um novo convite para um usuário participar de um projeto",
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/InviteRequest",
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Convite criado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        invite: {
                          $ref: "#/components/schemas/Invite",
                        },
                      },
                    },
                  },
                },
              },
              400: {
                description: "Dados inválidos ou convite já existente",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
              },
              403: {
                description: "Sem permissão para convidar para este projeto",
              },
              500: {
                description: "Erro interno do servidor",
              },
            },
          },
          get: {
            tags: ["Convites"],
            summary: "Listar convites de um projeto",
            description: "Retorna todos os convites de um projeto específico",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "projectId",
                in: "query",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Lista de convites",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        invites: {
                          type: "array",
                          items: {
                            $ref: "#/components/schemas/Invite",
                          },
                        },
                      },
                    },
                  },
                },
              },
              400: {
                description: "ID do projeto não fornecido",
              },
              401: {
                description: "Não autorizado",
              },
              403: {
                description: "Sem permissão para acessar este projeto",
              },
              500: {
                description: "Erro interno do servidor",
              },
            },
          },
          delete: {
            tags: ["Convites"],
            summary: "Excluir um convite",
            description: "Remove um convite pendente do sistema",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "inviteId",
                in: "query",
                required: true,
                schema: {
                  type: "string",
                },
                description: "ID do convite a ser excluído",
              },
            ],
            responses: {
              200: {
                description: "Convite excluído com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                          example: "Convite excluído com sucesso",
                        },
                      },
                    },
                  },
                },
              },
              400: {
                description: "ID do convite não fornecido",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: {
                          type: "string",
                          example: "ID do convite é obrigatório",
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
              },
              403: {
                description: "Sem permissão para excluir este convite",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: {
                          type: "string",
                          example: "Sem permissão para excluir este convite",
                        },
                      },
                    },
                  },
                },
              },
              404: {
                description: "Convite não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: {
                          type: "string",
                          example: "Convite não encontrado",
                        },
                      },
                    },
                  },
                },
              },
              500: {
                description: "Erro interno do servidor",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        error: {
                          type: "string",
                          example: "Erro ao excluir convite",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/api/invites/pending": {
          get: {
            tags: ["Convites"],
            summary: "Listar convites pendentes do usuário atual",
            description:
              "Retorna todos os convites pendentes do usuário autenticado",
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Lista de convites pendentes",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Invite",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
              },
            },
          },
        },
        "/api/projects/members": {
          get: {
            tags: ["Membros"],
            summary: "Listar membros do projeto",
            description:
              "Obtém a lista de membros do projeto atual ou do projeto especificado",
            security: [{ BearerAuth: [] }],
            parameters: [
              {
                name: "projectId",
                in: "query",
                description:
                  "ID do projeto (opcional, usa o projeto ativo se não fornecido)",
                required: false,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Lista de membros do projeto",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Member",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              404: {
                description: "Projeto não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          post: {
            tags: ["Membros"],
            summary: "Adicionar membro ao projeto",
            description:
              "Adiciona um novo membro ao projeto atual ou ao projeto especificado",
            security: [{ BearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/MemberRequest",
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Membro adicionado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Member",
                    },
                  },
                },
              },
              400: {
                description: "Dados inválidos",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              404: {
                description: "Projeto não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/projects/roles": {
          get: {
            tags: ["Funções"],
            summary: "Listar funções disponíveis",
            description:
              "Obtém a lista de funções disponíveis para membros de projetos",
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "Lista de funções",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Role",
                      },
                    },
                  },
                },
              },
              401: {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/projects/teams": {
          post: {
            summary: "Criar uma nova equipe",
            tags: ["Teams"],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/CreateTeamRequest",
                  },
                },
              },
            },
            responses: {
              "201": {
                description: "Equipe criada com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TeamResponse",
                    },
                  },
                },
              },
              "400": {
                description: "Requisição inválida",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "403": {
                description: "Acesso negado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          get: {
            summary: "Listar equipes de um projeto",
            tags: ["Teams"],
            parameters: [
              {
                name: "projectId",
                in: "query",
                description: "ID do projeto para filtrar equipes",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Lista de equipes do projeto",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TeamsResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "403": {
                description: "Acesso negado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/projects/teams/{teamId}": {
          get: {
            summary: "Obter detalhes de uma equipe",
            tags: ["Teams"],
            parameters: [
              {
                name: "teamId",
                in: "path",
                description: "ID da equipe a ser consultada",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Detalhes da equipe",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TeamResponse",
                    },
                  },
                },
              },
              "404": {
                description: "Equipe não encontrada",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "403": {
                description: "Acesso negado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          patch: {
            summary: "Atualizar uma equipe",
            tags: ["Teams"],
            parameters: [
              {
                name: "teamId",
                in: "path",
                description: "ID da equipe a ser atualizada",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UpdateTeamRequest",
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "Equipe atualizada com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TeamResponse",
                    },
                  },
                },
              },
              "400": {
                description: "Requisição inválida",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "404": {
                description: "Equipe não encontrada",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "403": {
                description: "Acesso negado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          delete: {
            summary: "Remover uma equipe",
            tags: ["Teams"],
            parameters: [
              {
                name: "teamId",
                in: "path",
                description: "ID da equipe a ser removida",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Equipe removida com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: {
                          type: "boolean",
                        },
                        message: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
              "404": {
                description: "Equipe não encontrada",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "403": {
                description: "Acesso negado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/projects/teams/{teamId}/members": {
          post: {
            summary: "Adicionar membro a uma equipe",
            tags: ["Teams"],
            parameters: [
              {
                name: "teamId",
                in: "path",
                description: "ID da equipe",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AddTeamMemberRequest",
                  },
                },
              },
            },
            responses: {
              "201": {
                description: "Membro adicionado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TeamMemberResponse",
                    },
                  },
                },
              },
              "400": {
                description: "Requisição inválida",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "404": {
                description: "Equipe ou membro não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "409": {
                description: "Membro já existe na equipe",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "403": {
                description: "Acesso negado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          get: {
            summary: "Listar membros de uma equipe",
            tags: ["Teams"],
            parameters: [
              {
                name: "teamId",
                in: "path",
                description: "ID da equipe",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Lista de membros da equipe",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TeamMembersResponse",
                    },
                  },
                },
              },
              "404": {
                description: "Equipe não encontrada",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "403": {
                description: "Acesso negado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
        "/api/projects/teams/{teamId}/members/{memberId}": {
          delete: {
            summary: "Remover membro de uma equipe",
            tags: ["Teams"],
            parameters: [
              {
                name: "teamId",
                in: "path",
                description: "ID da equipe",
                required: true,
                schema: {
                  type: "string",
                },
              },
              {
                name: "memberId",
                in: "path",
                description: "ID do membro da equipe a ser removido",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              "200": {
                description: "Membro removido com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: {
                          type: "boolean",
                        },
                        message: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
              "404": {
                description: "Equipe ou membro não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "403": {
                description: "Acesso negado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
          patch: {
            summary: "Atualizar função de um membro na equipe",
            tags: ["Teams"],
            parameters: [
              {
                name: "teamId",
                in: "path",
                description: "ID da equipe",
                required: true,
                schema: {
                  type: "string",
                },
              },
              {
                name: "memberId",
                in: "path",
                description: "ID do membro da equipe a ser atualizado",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      role: {
                        type: "string",
                        description: "Nova função do membro na equipe",
                      },
                    },
                    required: ["role"],
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "Membro atualizado com sucesso",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TeamMemberResponse",
                    },
                  },
                },
              },
              "400": {
                description: "Requisição inválida",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "404": {
                description: "Equipe ou membro não encontrado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "401": {
                description: "Não autorizado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
              "403": {
                description: "Acesso negado",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/ErrorResponse",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return spec;
};
