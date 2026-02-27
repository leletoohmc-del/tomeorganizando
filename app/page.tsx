"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Fingerprint,
  FolderSync,
  Gauge,
  LayoutDashboard,
  Menu,
  PiggyBank,
  RefreshCw,
  Shield,
  ShieldCheck,
  Smartphone,
  Target,
  TrendingUp,
  Wallet,
  X,
  Zap,
  AlertTriangle,
  Download,
  Settings,
  BarChart3,
  Clock,
  Lock,
  Bell,
  LogOut,
  User,
  Mail,
  KeyRound,
} from "lucide-react"

/* ============================
   TYPES
   ============================ */
interface UserData {
  name: string
  email: string
  password: string
}

/* ============================
   AUTH HOOK (localStorage/sessionStorage)
   ============================ */
function useAuth() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const session =
      sessionStorage.getItem("tmo_session") ||
      localStorage.getItem("tmo_session")
    if (session) {
      try {
        setUser(JSON.parse(session))
      } catch {
        /* ignore */
      }
    }
  }, [])

  const signup = useCallback((data: UserData) => {
    const users: UserData[] = JSON.parse(
      localStorage.getItem("tmo_users") || "[]"
    )
    if (users.find((u) => u.email === data.email)) {
      return { ok: false, error: "E-mail ja cadastrado." }
    }
    users.push(data)
    localStorage.setItem("tmo_users", JSON.stringify(users))
    const session = { name: data.name, email: data.email }
    localStorage.setItem("tmo_session", JSON.stringify(session))
    setUser(session)
    return { ok: true, error: null }
  }, [])

  const login = useCallback(
    (email: string, password: string, remember: boolean) => {
      const users: UserData[] = JSON.parse(
        localStorage.getItem("tmo_users") || "[]"
      )
      const found = users.find(
        (u) => u.email === email && u.password === password
      )
      if (!found) return { ok: false, error: "E-mail ou senha incorretos." }
      const session = { name: found.name, email: found.email }
      if (remember) {
        localStorage.setItem("tmo_session", JSON.stringify(session))
      } else {
        sessionStorage.setItem("tmo_session", JSON.stringify(session))
      }
      setUser(session)
      return { ok: true, error: null }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem("tmo_session")
    sessionStorage.removeItem("tmo_session")
    setUser(null)
  }, [])

  return { user, signup, login, logout }
}

/* ============================
   SYNC MODAL
   ============================ */
function SyncModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [checked, setChecked] = useState(false)
  const [remember, setRemember] = useState(false)
  const [step, setStep] = useState<"checkbox" | "confirm" | "done">("checkbox")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 px-5 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        {step === "checkbox" && (
          <>
            <h3 className="text-lg font-bold text-foreground">
              Sincronização Automática
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Ao ativar, suas transações bancárias serão importadas
              automaticamente. Você pode pausar ou remover a conexão quando
              quiser.
            </p>
            <label className="mt-6 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
                className="mt-1 h-4 w-4 accent-primary"
              />
              <span className="text-sm font-medium text-foreground">
                Ativar sincronização automática
              </span>
            </label>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  if (checked) setStep("confirm")
                }}
                disabled={!checked}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
              >
                Continuar
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground"
              >
                Agora não
              </button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <h3 className="text-lg font-bold text-foreground">
              Confirmar ativação?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Sua sincronização será ativada. Você pode desativar a qualquer
              momento nas configurações.
            </p>
            <label className="mt-5 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                Lembrar minha escolha
              </span>
            </label>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep("done")}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Confirmar
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground"
              >
                Agora não
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <>
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Check size={28} className="text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">
                Sincronização ativada
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Suas transações serão importadas automaticamente.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
              >
                Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ============================
   NAVBAR
   ============================ */
function Navbar({
  user,
  onLogout,
}: {
  user: { name: string; email: string } | null
  onLogout: () => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = [
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Modos", href: "#modos" },
    { label: "Recursos", href: "#recursos" },
    { label: "Preco", href: "#preco" },
    { label: "Entrar", href: "#entrar" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/90 shadow-sm border-b border-border backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a
          href="#"
          className="font-[var(--font-heading)] text-xl font-bold tracking-tight text-foreground"
        >
          TôMeOrganizando
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {"Ola, "}
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          ) : (
            <a
              href="#cadastro"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Criar conta
            </a>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-foreground md:hidden"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-5 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-foreground"
              >
                {l.label}
              </a>
            ))}
            {user ? (
              <button
                onClick={() => {
                  onLogout()
                  setMobileOpen(false)
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground"
              >
                <LogOut size={14} />
                Sair ({user.name})
              </button>
            ) : (
              <a
                href="#cadastro"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Criar conta
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

/* ============================
   HERO
   ============================ */
function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-32 md:pt-44">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Menos susto. Mais decisão.
          </span>
          <h1 className="mt-6 font-[var(--font-heading)] text-4xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-6xl md:leading-tight">
            Faça o dinheiro parar de desaparecer.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            O TôMeOrganizando sincroniza suas contas, categoriza cada centavo e
            te mostra o que vem pela frente — no celular e no computador.
          </p>

          <div className="mx-auto mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
            {[
              "Entenda para onde vai",
              "Saiba como termina o mês",
              "Decida antes do problema",
            ].map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <Check size={16} className="text-primary" />
                {b}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-left">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="rounded-full border border-border bg-card px-3 py-1">
                {"Clareza 30\u2122"}
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1">
                {"Plano Fôlego\u2122"}
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1">
                {"Reserva Inteligente\u2122"}
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1">
                {"Mapa Financeiro\u2122"}
              </span>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#cadastro"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-primary/30"
            >
              Criar conta
              <ArrowRight size={18} />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver por dentro
              <ChevronDown size={16} />
            </a>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            {"Pix ou cartão \u2022 Garantia 7 dias \u2022 Sem exposição"}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ============================
   O QUE ESTÁ ACONTECENDO HOJE
   ============================ */
function ProblemaHoje() {
  const items = [
    {
      icon: AlertTriangle,
      text: "Aquele nó no estômago quando o app do banco abre",
    },
    {
      icon: Wallet,
      text: "A fatura aparece e voce não sabe como chegou ali",
    },
    {
      icon: Gauge,
      text: "Cada semana é um improviso diferente com o mesmo resultado",
    },
    {
      icon: Eye,
      text: "Voce acha que controla — ate a conta nao fechar",
    },
  ]

  return (
    <section className="bg-foreground py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold text-background text-balance md:text-4xl">
            O que acontece quando ninguém te mostra o mapa?
          </h2>
          <p className="mt-4 text-base text-background/70">
            Se algum desses te soa familiar, o problema não é falta de
            disciplina.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.text}
                className="flex items-start gap-4 rounded-2xl border border-background/10 bg-background/5 p-6 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/20">
                  <item.icon size={20} className="text-destructive" />
                </div>
                <p className="text-base font-medium leading-relaxed text-background/90">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================
   COMO VOCÊ USA NA VIDA REAL
   ============================ */
function ComoFunciona({ onOpenSync }: { onOpenSync: () => void }) {
  return (
    <section id="como-funciona" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Na prática
          </span>
          <h2 className="mt-6 font-[var(--font-heading)] text-3xl font-bold text-foreground text-balance md:text-4xl">
            Como voce usa na vida real
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-5">
          {[
            {
              step: "01",
              icon: Smartphone,
              title: "Comece manual",
              desc: "Adicione suas contas e ajuste categorias. Uma vez só.",
            },
            {
              step: "02",
              icon: RefreshCw,
              title: "Ative a sincronia",
              desc: "Com sua confirmação, tudo passa a ser automático.",
            },
            {
              step: "03",
              icon: BarChart3,
              title: "Consulte o Clareza 30\u2122",
              desc: "Veja a projeção dos próximos 30 dias do seu bolso.",
            },
            {
              step: "04",
              icon: Target,
              title: "Ajuste limites",
              desc: "Defina tetos por categoria e metas simples.",
            },
            {
              step: "05",
              icon: Clock,
              title: "Check-in semanal",
              desc: "Volte uma vez por semana. 3 minutos bastam.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="absolute -top-3 left-5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                {item.step}
              </span>
              <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <item.icon size={22} className="text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Confirmation block */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground">
                Sobre a sincronização automática
              </h4>
              <ul className="mt-3 flex flex-col gap-2">
                {[
                  'Checkbox "Ativar sincronização automática" antes de qualquer coisa',
                  'Pop-up com Confirmar, Agora não e "Lembrar minha escolha"',
                  "Pause, altere ou desconecte quando quiser — sem burocracias",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    {b}
                  </li>
                ))}
              </ul>
              <button
                onClick={onOpenSync}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
              >
                Ver demonstração da confirmação
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================
   ESCOLHA SEU MODO
   ============================ */
function Modos() {
  const modes = [
    {
      icon: FolderSync,
      title: "Organizar",
      system: "Mapa Financeiro\u2122",
      tagline: "Cada centavo com endereço certo.",
      bullets: [
        "Categorias automáticas que voce pode ajustar",
        "Recorrências identificadas e agrupadas",
        "Panorama de onde cada real foi parar",
      ],
    },
    {
      icon: Zap,
      title: "Sair do Aperto",
      system: "Plano Fôlego\u2122",
      tagline: "7 dias de passos simples. Sem aula.",
      bullets: [
        "Checklist diário com ações práticas",
        "Foco em cortes imediatos que geram folga",
        "Modo guiado e silencioso — sem exposição",
      ],
    },
    {
      icon: PiggyBank,
      title: "Construir Reserva",
      system: "Reserva Inteligente\u2122",
      tagline: "Comece com R$ 10. Mas comece.",
      bullets: [
        "Meta de reserva baseada nos seus gastos reais",
        "Sugestão automática de valor mensal",
        "Marcos visuais a cada etapa concluída",
      ],
    },
    {
      icon: TrendingUp,
      title: "Prever o Mês",
      system: "Clareza 30\u2122",
      tagline: "Saber antes é poder agir.",
      bullets: [
        "Projeção dos próximos 30 dias em tempo real",
        '"Se continuar assim, sobra/falta R$ X"',
        "Alertas configuráveis para agir no momento certo",
      ],
    },
  ]

  return (
    <section id="modos" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Modos
          </span>
          <h2 className="mt-6 font-[var(--font-heading)] text-3xl font-bold text-foreground text-balance md:text-4xl">
            Escolha seu modo hoje
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Cada momento pede uma abordagem. Use o modo que faz sentido agora.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((m) => (
            <div
              key={m.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <m.icon size={24} className="text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {m.title}
              </h3>
              <span className="mt-1 inline-block text-xs font-semibold tracking-wide text-primary/80">
                {m.system}
              </span>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {m.tagline}
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {m.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      size={14}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================
   RECURSOS
   ============================ */
function Recursos() {
  const features = [
    {
      icon: Lock,
      title: "Sincronização bancária",
      desc: "Conexão segura e autorizada por voce, com controle total.",
    },
    {
      icon: RefreshCw,
      title: "Recorrências automáticas",
      desc: "Identifica gastos repetidos e os agrupa para voce.",
    },
    {
      icon: Target,
      title: "Limites por categoria",
      desc: "Tetos personalizados com aviso antes de estourar.",
    },
    {
      icon: Bell,
      title: "Alertas opcionais",
      desc: "Notificações que voce configura como quiser.",
    },
    {
      icon: TrendingUp,
      title: "Clareza 30\u2122",
      desc: "Projeção inteligente dos próximos 30 dias.",
    },
    {
      icon: Zap,
      title: "Plano Fôlego\u2122",
      desc: "Sistema de 7 dias para sair do aperto.",
    },
    {
      icon: PiggyBank,
      title: "Reserva Inteligente\u2122",
      desc: "Construção de reserva baseada na sua realidade.",
    },
    {
      icon: FolderSync,
      title: "Mapa Financeiro\u2122",
      desc: "Categorias, limites e recorrências num painel visual.",
    },
    {
      icon: LayoutDashboard,
      title: "Painel no computador",
      desc: "Visão completa e ampla direto do navegador.",
    },
    {
      icon: Download,
      title: "Exportação de dados",
      desc: "Exporte seus registros quando quiser.",
      badge: "Em breve",
    },
  ]

  return (
    <section id="recursos" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Recursos
          </span>
          <h2 className="mt-6 font-[var(--font-heading)] text-3xl font-bold text-foreground text-balance md:text-4xl">
            Tudo que voce precisa. Nada que não precisa.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="relative rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              {f.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {f.badge}
                </span>
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <f.icon size={20} className="text-primary" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================
   BEFORE / AFTER
   ============================ */
function BeforeAfter() {
  const before = [
    "Não sei quanto posso gastar esta semana",
    "O mês acaba e eu não entendo o que aconteceu",
    "O cartão manda e eu obedeço",
    "Vivo apagando incêndio toda semana",
  ]
  const after = [
    "Sei onde cortar e onde posso respirar",
    "Clareza 30\u2122 me mostra o fim do mês com antecedência",
    "Limites por categoria que eu mesmo defino",
    "Check-in semanal de 3 minutos resolve tudo",
  ]

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold text-foreground text-balance md:text-4xl">
            Antes vs. Depois
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A diferença entre improvisar e ter um mapa.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8">
            <span className="inline-block rounded-full bg-destructive/15 px-3 py-1 text-sm font-semibold text-destructive">
              Antes
            </span>
            <ul className="mt-6 flex flex-col gap-4">
              {before.map((b) => (
                <li key={b} className="flex items-center gap-3 text-foreground">
                  <X size={16} className="shrink-0 text-destructive" />
                  <span className="text-base">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
            <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary">
              Depois
            </span>
            <ul className="mt-6 flex flex-col gap-4">
              {after.map((b) => (
                <li key={b} className="flex items-center gap-3 text-foreground">
                  <Check size={16} className="shrink-0 text-primary" />
                  <span className="text-base">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================
   PRIVACIDADE
   ============================ */
function Privacidade() {
  return (
    <section className="bg-foreground py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background/10">
            <Shield size={28} className="text-background" />
          </div>
          <h2 className="mt-6 font-[var(--font-heading)] text-3xl font-bold text-background text-balance md:text-4xl">
            Privacidade e controle
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Fingerprint,
                title: "Seus dados não são vendidos",
                desc: "Nenhuma informação é compartilhada com terceiros. Ponto.",
              },
              {
                icon: ShieldCheck,
                title: "Sem spam. Sem pressão.",
                desc: "Zero e-mails desnecessários. Zero venda cruzada.",
              },
              {
                icon: Settings,
                title: "Desconecte quando quiser",
                desc: "Voce controla cada permissão e pode revogar acesso a qualquer momento.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-background/10 bg-background/5 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/10">
                  <item.icon size={20} className="text-background" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-background">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-background/70">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================
   PREÇO
   ============================ */
function Preco() {
  const includes = [
    "Acesso completo mobile + desktop",
    "Sincronização bancária + recorrências",
    "Clareza 30\u2122, Plano Fôlego\u2122, Reserva Inteligente\u2122, Mapa Financeiro\u2122",
    "Atualizações incluídas por 12 meses",
  ]

  return (
    <section id="preco" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-lg text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Plano único
          </span>
          <h2 className="mt-6 font-[var(--font-heading)] text-3xl font-bold text-foreground md:text-4xl">
            TôMeOrganizando Anual
          </h2>

          <div className="mx-auto mt-10 rounded-3xl border-2 border-primary/30 bg-card p-8 shadow-lg md:p-10">
            <div className="flex items-baseline justify-center gap-2">
              <span className="font-[var(--font-heading)] text-5xl font-bold text-foreground md:text-6xl">
                R$ 149,90
              </span>
              <span className="text-lg text-muted-foreground">/ano</span>
            </div>
            <p className="mt-2 text-base text-muted-foreground">
              equivale a R$ 12,49/mês
            </p>

            <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-2">
              {["Pix", "Cartão", "Garantia 7 dias"].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>

            <ul className="mx-auto mt-8 flex max-w-xs flex-col gap-3 text-left">
              {includes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <Check
                    size={16}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/checkout"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
            >
              Assinar anual
              <ArrowRight size={18} />
            </Link>

            <p className="mt-4 text-sm text-muted-foreground">
              Voce escolhe como pagar.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================
   GARANTIA
   ============================ */
function Garantia() {
  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center md:flex-row md:text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Garantia de 7 dias
            </h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              Teste por 7 dias. Se não gerar clareza real sobre o seu dinheiro,
              devolvemos tudo. Sem perguntas, sem formulários.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================
   FAQ
   ============================ */
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: "Como funciona o Clareza 30\u2122?",
      a: "O Clareza 30\u2122 analisa seus gastos recentes, identifica padrões e projeta como será o saldo nos próximos 30 dias. Voce vê se vai sobrar ou faltar dinheiro — antes de acontecer.",
    },
    {
      q: "Por que a primeira vez é manual?",
      a: "Para que voce configure categorias e entenda o funcionamento antes da automação. Assim, voce tem controle total desde o primeiro dia.",
    },
    {
      q: "Como confirmar a sincronização recorrente?",
      a: 'Voce marca um checkbox claro e confirma em um pop-up com as opções: Confirmar, Agora não, ou "Lembrar minha escolha".',
    },
    {
      q: "Posso desligar a sincronização?",
      a: "Sim, a qualquer momento. Voce pode pausar, alterar ou remover a conexão diretamente no app ou no painel do computador.",
    },
    {
      q: "Pix libera na hora?",
      a: "Sim. Após a confirmação do Pix, seu acesso é liberado automaticamente.",
    },
    {
      q: "Posso pagar no cartão?",
      a: "Sim. Voce escolhe entre Pix e cartão de crédito no checkout.",
    },
    {
      q: "Tem plano mensal?",
      a: "Não. Oferecemos apenas o plano anual de R$ 149,90 (equivalente a R$ 12,49/mês). Acreditamos que organização financeira exige constância.",
    },
    {
      q: "Serve para autônomo?",
      a: "Sim. O TôMeOrganizando funciona para qualquer pessoa que recebe e gasta dinheiro — CLT, autônomo, MEI, freelancer.",
    },
    {
      q: "Funciona no computador?",
      a: "Sim. Voce tem o app no celular e um painel completo no navegador. Tudo sincronizado.",
    },
    {
      q: "Como funciona a garantia?",
      a: "Se em até 7 dias voce sentir que o app não gerou clareza, devolvemos 100% do valor. Sem perguntas.",
    },
    {
      q: "Meus dados ficam seguros?",
      a: "Levamos sua privacidade a sério. Seus dados não são vendidos, não há spam e voce controla todas as permissões.",
    },
    {
      q: "Preciso saber de finanças para usar?",
      a: "De jeito nenhum. O app foi feito para quem quer clareza prática, não para quem quer estudar o mercado financeiro.",
    },
  ]

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Dúvidas
          </span>
          <h2 className="mt-6 font-[var(--font-heading)] text-3xl font-bold text-foreground md:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <div className="mx-auto mt-14 flex max-w-2xl flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="text-base font-medium text-foreground">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================
   CADASTRO
   ============================ */
function Cadastro({
  user,
  onSignup,
  onLogout,
}: {
  user: { name: string; email: string } | null
  onSignup: (data: UserData) => { ok: boolean; error: string | null }
  onLogout: () => void
}) {
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Preencha todos os campos.")
      return
    }
    const result = onSignup({ name: name.trim(), email: email.trim(), password })
    if (!result.ok && result.error) {
      setError(result.error)
    }
  }

  if (user) {
    return (
      <section id="cadastro" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-lg">
            <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h2 className="font-[var(--font-heading)] text-2xl font-bold text-foreground">
                {"Olá, "}
                {user.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Cadastro demonstrativo nesta versão.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-secondary p-5">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    <span className="text-xs font-semibold tracking-wide text-primary">
                      {"Clareza 30\u2122"}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">
                    + R$ 412,00
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Projeção para fim do mês
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-secondary p-5">
                  <div className="flex items-center gap-2">
                    <PiggyBank size={16} className="text-primary" />
                    <span className="text-xs font-semibold tracking-wide text-primary">
                      {"Reserva Inteligente\u2122"}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        38%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        da meta
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: "38%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  disabled
                  className="flex-1 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary opacity-60"
                >
                  Ir para o app (em breve)
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <LogOut size={14} />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="cadastro" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="font-[var(--font-heading)] text-2xl font-bold text-foreground">
              Crie sua conta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Rápido, sem complicação.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Como quer ser chamado
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    ref={nameRef}
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-xl border border-input bg-background py-3 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-input bg-background py-3 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Senha
                </label>
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="signup-password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full rounded-xl border border-input bg-background py-3 pr-10 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPw ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
              >
                Criar conta e entrar
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Cadastro demonstrativo nesta versão.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================
   LOGIN
   ============================ */
function Login({
  user,
  onLogin,
}: {
  user: { name: string; email: string } | null
  onLogin: (
    email: string,
    password: string,
    remember: boolean
  ) => { ok: boolean; error: string | null }
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState("")

  if (user) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos.")
      return
    }
    const result = onLogin(email.trim(), password, remember)
    if (!result.ok && result.error) {
      setError(result.error)
    }
  }

  return (
    <section id="entrar" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h2 className="font-[var(--font-heading)] text-2xl font-bold text-foreground">
              Entrar
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Acesse sua conta.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-input bg-background py-3 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Senha
                </label>
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    id="login-password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full rounded-xl border border-input bg-background py-3 pr-10 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPw ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Lembrar de mim
                </span>
              </label>

              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
              >
                Entrar
              </button>

              <p className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                  onClick={() => {
                    /* placeholder */
                  }}
                >
                  Esqueci minha senha
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================
   CTA FINAL
   ============================ */
function CTAFinal() {
  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[var(--font-heading)] text-3xl font-bold text-primary-foreground text-balance md:text-4xl">
            Clareza não custa caro. Custa uma decisão.
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            R$ 12,49 por mês para nunca mais ser pego de surpresa.
          </p>
          <Link
            href="/checkout"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary-foreground px-8 py-4 text-base font-semibold text-primary shadow-lg transition-all hover:opacity-90"
          >
            Assinar por R$ 149,90/ano
            <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-primary-foreground/70">
            {"Garantia de 7 dias \u2022 Pagamento seguro"}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ============================
   FOOTER
   ============================ */
function Footer() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center">
        <span className="font-[var(--font-heading)] text-lg font-bold text-foreground">
          TôMeOrganizando
        </span>
        <p className="text-sm text-muted-foreground">
          {"\u00A9 2026 TôMeOrganizando. Todos os direitos reservados."}
        </p>
      </div>
    </footer>
  )
}

/* ============================
   STICKY MOBILE CTA
   ============================ */
function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 px-5 py-3 backdrop-blur-lg md:hidden">
      <Link
        href="/checkout"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
      >
        {"Assinar R$ 149,90/ano"}
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}

/* ============================
   PAGE
   ============================ */
export default function Page() {
  const { user, signup, login, logout } = useAuth()
  const [syncOpen, setSyncOpen] = useState(false)

  return (
    <main>
      <Navbar user={user} onLogout={logout} />
      <Hero />
      <ProblemaHoje />
      <ComoFunciona onOpenSync={() => setSyncOpen(true)} />
      <Modos />
      <Recursos />
      <BeforeAfter />
      <Privacidade />
      <Preco />
      <Garantia />
      <FAQ />
      <Cadastro user={user} onSignup={signup} onLogout={logout} />
      <Login user={user} onLogin={login} />
      <CTAFinal />
      <Footer />
      <StickyMobileCTA />
      <SyncModal open={syncOpen} onClose={() => setSyncOpen(false)} />
    </main>
  )
}
