"use client";

import React, { useMemo, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  KeyRound,
  Save,
  LogOut,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";

const cx = (...c: Array<string | false | undefined | null>) =>
  c.filter(Boolean).join(" ");

const SectionCard = ({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55 shadow-sm overflow-hidden">
      <div className="flex items-start gap-3 p-5 sm:p-6 border-b border-border">
        <div className="h-11 w-11 rounded-2xl border border-border bg-background/40 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-black tracking-tight">
            {title}
          </h3>
          {desc && (
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
          )}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
};

const Toggle = ({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-bold">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-8 w-14 rounded-full border transition",
          checked
            ? "bg-primary/20 border-primary/30"
            : "bg-background/40 border-border",
        )}
        aria-pressed={checked}
      >
        <span
          className={cx(
            "absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border bg-card shadow-sm transition",
            checked
              ? "left-7 border-primary/30"
              : "left-1 border-border opacity-80",
          )}
        />
      </button>
    </div>
  );
};

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) => {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          "w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition",
          "focus:ring-2 focus:ring-ring",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      />
    </div>
  );
};

const Select = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
}) => {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-border bg-background/55 px-4 py-3 pr-10 text-sm outline-none transition focus:ring-2 focus:ring-ring cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronRight
          size={16}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default function Settings() {
  // UI-only state (keyin API ga ulaysiz)
  const [fullName, setFullName] = useState("Abu");
  const [email, setEmail] = useState("admin@example.com");
  const [phone, setPhone] = useState("+998 90 000 00 00");

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");

  const [notifyPayments, setNotifyPayments] = useState(true);
  const [notifySystem, setNotifySystem] = useState(true);

  const initials = useMemo(() => {
    const parts = fullName.trim().split(" ").filter(Boolean);
    const a = parts[0]?.[0] || "A";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [fullName]);

  const handleSave = () => {
    // bu yerga API qo'yasiz
    alert("Saqlash (demo). Keyin API ulab beramiz ✅");
  };

  const handleLogout = () => {
    // token clear + redirect (o'zingizning loyihangizga moslab)
    alert("Logout (demo)");
  };

  return (
    <div className="relative w-full p-4 sm:p-6 min-h-screen text-foreground overflow-hidden">
      {/* accents */}
      <div className="pointer-events-none absolute -top-24 left-1/3 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />

      {/* Page header */}
      <div className="relative rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-primary">
              <SettingsIcon size={18} />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                Settings
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
              Sozlamalar
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Profil, xavfsizlik va tizim sozlamalarini boshqaring.
            </p>
          </div>

          <div className="flex flex-col xs:flex-row gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm"
            >
              <Save size={16} />
              Saqlash
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background/45 px-4 py-3 text-sm font-black hover:bg-muted/50 transition"
            >
              <LogOut size={16} />
              Chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-5">
          <SectionCard
            icon={<User size={18} />}
            title="Profil"
            desc="Asosiy shaxsiy ma'lumotlar"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-3xl border border-primary/20 bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-black truncate">{fullName}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {email}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Input
                label="Full name"
                value={fullName}
                onChange={setFullName}
                placeholder="Ism Familiya"
              />
              <Input
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="email@example.com"
              />
              <Input
                label="Phone"
                value={phone}
                onChange={setPhone}
                placeholder="+998 90 ..."
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={<Palette size={18} />}
            title="Ko‘rinish"
            desc="Theme va UI afzalliklari"
          >
            <div className="space-y-4">
              <Toggle
                checked={theme === "dark"}
                onChange={(v) => setTheme(v ? "dark" : "light")}
                label="Dark mode"
                hint="Hozircha UI demo. Keyin real theme switch ulaymiz."
              />
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                  <span className="text-sm font-bold">Joriy</span>
                </div>
                <span className="text-xs font-black uppercase tracking-widest">
                  {theme}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          <SectionCard
            icon={<Bell size={18} />}
            title="Bildirishnomalar"
            desc="Kerakli alertlarni yoqing/o‘chiring"
          >
            <div className="space-y-5">
              <Toggle
                checked={notifyPayments}
                onChange={setNotifyPayments}
                label="To‘lovlar bo‘yicha bildirishnoma"
                hint="Qarzdorlik / to‘lov qabul qilindi."
              />
              <Toggle
                checked={notifySystem}
                onChange={setNotifySystem}
                label="Tizim xabarlari"
                hint="Server holati, yangilanishlar."
              />
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SectionCard
              icon={<Shield size={18} />}
              title="Xavfsizlik"
              desc="Parol va himoya sozlamalari"
            >
              <div className="space-y-4">
                <Input
                  label="Current password"
                  type="password"
                  value={"********"}
                  onChange={() => {}}
                  disabled
                />
                <Input
                  label="New password"
                  type="password"
                  value={""}
                  onChange={() => {}}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background/45 px-4 py-3 text-sm font-black hover:bg-muted/50 transition"
                >
                  <KeyRound size={16} />
                  Parolni yangilash
                </button>
                <p className="text-[11px] text-muted-foreground">
                  Keyin API ulab, real validation qo‘shamiz.
                </p>
              </div>
            </SectionCard>

            <SectionCard
              icon={<Globe size={18} />}
              title="Til"
              desc="Interfeys tilini tanlang"
            >
              <div className="space-y-4">
                <Select
                  label="Language"
                  value={lang}
                  onChange={(v) => setLang(v as any)}
                  options={[
                    { label: "O‘zbek (uz)", value: "uz" },
                    { label: "Русский (ru)", value: "ru" },
                    { label: "English (en)", value: "en" },
                  ]}
                />
                <div className="rounded-2xl border border-border bg-background/40 p-4">
                  <p className="text-xs text-muted-foreground">
                    Tanlangan til:
                  </p>
                  <p className="text-sm font-black mt-1 uppercase tracking-widest">
                    {lang}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}