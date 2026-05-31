import { UpdatePasswordForm } from "@/components/auth/update-password-form"

export const metadata = {
  title: "Nueva contraseña | Wootienda",
  description: "Crea una nueva contraseña segura para tu cuenta",
}

export default function UpdatePasswordPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <UpdatePasswordForm />
    </main>
  )
}
