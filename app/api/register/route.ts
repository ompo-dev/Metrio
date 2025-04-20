import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";

// Esquema de validação para registro
const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
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
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação do corpo da requisição
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados de entrada inválidos", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Verifica se o email já está em uso
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já está em uso" },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria o usuário no banco de dados
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove a senha do objeto retornado
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
