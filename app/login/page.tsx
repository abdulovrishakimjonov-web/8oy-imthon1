"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ModeToggle } from "@/components/mode";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length > 2 && !loading;
  }, [email, password, loading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Email yoki parol xato!");
      }

      const user = data?.data;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role) Cookies.set("role", user.role, { expires: 7 });
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100vh] w-full overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-28 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-28 h-[520px] w-[520px] rounded-full bg-rose-500/10 blur-[140px]" />

      <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
        <ModeToggle />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-6xl items-center justify-center p-4 sm:p-6">
        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[28px] border border-border bg-card/70 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/55 md:grid-cols-2">
          {/* LEFT PANEL */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
            <div className="relative flex h-full flex-col justify-between p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  <Sparkles size={12} className="text-primary" />
                  CRM EDU PANEL
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight">
                  Xush kelibsiz 👋
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  O‘quv markazingizni boshqarish uchun tizimga kiring. Tez,
                  xavfsiz va qulay.
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Xavfsiz kirish</p>
                      <p className="text-xs text-muted-foreground">
                        Token va role cookie bilan boshqariladi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Zamonaviy UI</p>
                      <p className="text-xs text-muted-foreground">
                        Light/Dark mode, responsiv va clean dizayn.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] font-medium text-muted-foreground">
                © {new Date().getFullYear()} CRM Edu Panel
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="md:hidden">
                <h1 className="text-2xl font-black tracking-tight">
                  Xush kelibsiz 👋
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tizimga kirish uchun ma'lumotlarni kiriting
                </p>
              </div>

              <div className="hidden md:block">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                  Sign in
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight">
                  Tizimga kirish
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Email va parolingizni kiriting.
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-input bg-background px-10 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                    placeholder="admin@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                  Parol
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full rounded-2xl border border-input bg-background px-10 py-3 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="group relative w-full overflow-hidden rounded-2xl bg-primary px-4 py-3 text-sm font-black text-primary-foreground shadow-sm transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition group-hover:opacity-100" />
                <span className="relative inline-flex items-center justify-center gap-2">
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? "Kutilmoqda..." : "Tizimga kirish"}
                </span>
              </button>

              <p className="pt-1 text-center text-[11px] text-muted-foreground">
                Kirish orqali siz tizim qoidalariga rozilik bildirasiz.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}