import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata = {
  title: "Recuperar contraseña | Wootienda",
  description: "Recupera el acceso a tu cuenta de Wootienda",
}

export default function ResetPasswordPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <ResetPasswordForm />
    </main>
  )
}
