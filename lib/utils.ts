import { customAlphabet } from "nanoid";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Mescla classes CSS usando clsx e tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gera um token aleatório de convite
 * @returns Token de convite de 24 caracteres
 */
export function generateToken(length = 24): string {
  // Usar um alfabeto seguro para URLs e tokens: letras e números
  const nanoid = customAlphabet(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    length
  );
  return nanoid();
}

/**
 * Formata uma data para exibição localizada
 */
export function formatDate(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formata um valor monetário para BRL
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
