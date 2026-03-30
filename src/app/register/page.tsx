import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Crear cuenta",
}

export default function RegisterPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <RegisterForm />
    </main>
  )
}
