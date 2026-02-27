import Link from "next/link"
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout — TôMeOrganizando",
  description: "Assine o TôMeOrganizando por R$ 149,90/ano e tenha clareza financeira.",
}

export default function CheckoutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-20">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Lock size={28} className="text-primary" />
        </div>
        <h1 className="mt-6 font-[var(--font-heading)] text-3xl font-bold text-foreground">
          Checkout
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Página de checkout em construção. Em breve você poderá assinar o
          TôMeOrganizando por R$ 149,90/ano.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl font-bold text-foreground">
              R$ 149,90
            </span>
            <span className="text-muted-foreground">/ano</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            equivale a R$ 12,49/mês
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck size={16} className="text-primary" />
            Garantia de 7 dias
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Voltar para a página inicial
        </Link>
      </div>
    </main>
  )
}
