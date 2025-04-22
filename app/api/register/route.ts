import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";

// Schema de validação para o corpo da requisição
const registerSchema = z.object({
  name: z.string().min(2, "Nome precisa ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
  inviteToken: z.string().optional(),
  inviteProjectId: z.string().optional(),
});

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email já em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar os dados
    const validatedData = registerSchema.parse(body);

    // Verificar se o email já está em uso
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Buscar o convite, se fornecido
    let invite = null;
    let projectId = null;

    if (validatedData.inviteToken) {
      invite = await db.invite.findUnique({
        where: {
          inviteToken: validatedData.inviteToken,
          status: "pending",
        },
        include: {
          project: true,
        },
      });

      // Verificar se o convite é válido
      if (!invite) {
        return NextResponse.json(
          { error: "Convite inválido ou expirado" },
          { status: 400 }
        );
      }

      // Verificar se o convite não expirou
      if (new Date() > invite.expiresAt) {
        await db.invite.update({
          where: { id: invite.id },
          data: { status: "expired" },
        });

        return NextResponse.json(
          { error: "Este convite expirou" },
          { status: 410 }
        );
      }

      projectId = invite.projectId;
    }
    // Se não tiver convite mas tiver projectId, usar esse
    else if (validatedData.inviteProjectId) {
      // Verificar se o projeto existe
      const project = await db.project.findUnique({
        where: { id: validatedData.inviteProjectId },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Projeto não encontrado" },
          { status: 400 }
        );
      }

      projectId = validatedData.inviteProjectId;
    }

    // Criar o usuário
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        activeProjectId: projectId, // Definir o projeto como ativo já no registro
      },
    });

    // Se houver um convite, associar o usuário ao projeto
    if (invite) {
      // Atualizar o convite com o ID do usuário
      await db.invite.update({
        where: { id: invite.id },
        data: {
          recipientId: user.id,
          status: "accepted",
        },
      });

      // Adicionar o usuário como membro do projeto
      await db.projectMember.create({
        data: {
          userId: user.id,
          projectId: invite.projectId,
          role: "member",
        },
      });
    }
    // Se tiver projectId mas não tem convite (link direto)
    else if (projectId) {
      // Adicionar o usuário como membro do projeto
      await db.projectMember.create({
        data: {
          userId: user.id,
          projectId: projectId,
          role: "member",
        },
      });
    }

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados de registro inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    );
  }
}
