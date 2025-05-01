import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { JoinWithInvite } from "../components/join-with-invite";

export const metadata: Metadata = {
  title: "Juntar-se ao Projeto | Metrics SaaS",
  description: "Aceite o convite e junte-se a um projeto",
};

export default async function JoinPage({
  params,
}: {
  params: { token: string };
}) {
  // Verificar se o usuário está autenticado
  const session = await getServerSession(authOptions);

  // Se não estiver autenticado, redirecionar para a página de registro com o token
  if (!session) {
    redirect(`/auth/register?inviteToken=${params.token}`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <JoinWithInvite token={params.token} userId={session.user.id} />
    </div>
  );
}
