import { RegisterForm } from "@/app/auth/components/register-form";
import { Logo } from "@/components/logo";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: {
    inviteToken?: string;
    inviteProjectId?: string;
  };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Metrio</h1>
          <p className="text-muted-foreground">
            Crie sua conta para acessar o dashboard
          </p>
        </div>
        <RegisterForm
          inviteToken={searchParams.inviteToken}
          inviteProjectId={searchParams.inviteProjectId}
        />
      </div>
    </div>
  );
}
