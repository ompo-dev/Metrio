import { RegisterForm } from "@/components/auth/register-form"
import { Logo } from "@/components/logo"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center space-y-2 text-center">
          <Logo className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Métricas SaaS</h1>
          <p className="text-muted-foreground">Crie sua conta para começar a usar a plataforma</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

