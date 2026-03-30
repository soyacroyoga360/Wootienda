import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Iniciar sesión",
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <LoginForm />
    </main>
  )
}
