"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useMemo, useState } from "react";
import {
  Home,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Layers,
  CreditCard,
  Settings,
  CircleUser,
  LogOut,
  Sparkles,
} from "lucide-react";

interface HedaerProps {
  isOpen: boolean;
}

const cx = (...c: Array<string | false | undefined | null>) =>
  c.filter(Boolean).join(" ");

const Hedaer = ({ isOpen }: HedaerProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = Cookies.get("user") || localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed?.data ? parsed.data : parsed);
      } catch {
        console.error("User parse xatosi");
      }
    }
  }, []);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";

  const profileImg = useMemo(() => {
    if (!user?.image) return null;
    return user.image.startsWith("http") ? user.image : `${BASE_URL}/${user.image}`;
  }, [user, BASE_URL]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    localStorage.clear();
    router.push("/login");
  };

  const isActive = (path: string) =>
    pathname === path || (path !== "/" && pathname?.startsWith(path + "/"));

  const navItemClass = (active: boolean) =>
    cx(
      "group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all",
      "border",
      active
        ? "bg-primary/10 border-primary/20 text-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.05)]"
        : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:border-border/60",
    );

  const iconWrapClass = (active: boolean) =>
    cx(
      "h-9 w-9 rounded-2xl grid place-items-center border transition-all",
      active
        ? "bg-primary/10 border-primary/20 text-primary"
        : "bg-background/30 border-border/60 text-muted-foreground group-hover:text-foreground group-hover:bg-background/40",
    );

  const MENU = [
    { href: "/", label: "Asosiy", icon: Home },
    { href: "/menagers", label: "Menagerlar", icon: UserCheck },
    { href: "/adminss", label: "Adminlar", icon: Users },
    { href: "/teachers", label: "Ustozlar", icon: GraduationCap },
    { href: "/students", label: "Studentlar", icon: Users },
    { href: "/groups", label: "Guruhlar", icon: Layers },
    { href: "/courses", label: "Kurslar", icon: BookOpen },
    { href: "/payment", label: "Payment", icon: CreditCard },
  ];

  const OTHER = [
    { href: "/settings", label: "Sozlamalar", icon: Settings },
    { href: "/profile", label: "Profile", icon: CircleUser },
  ];

  return (
    <>
      {/* ✅ FIXED SIDEBAR */}
      <div
        className={cx(
          "fixed left-0 top-0 h-screen w-72 z-50",
          "bg-background/70 backdrop-blur-xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* TOP (sticky) */}
        <div className="sticky top-0 z-10 border-b border-border/60 bg-background/50 backdrop-blur-xl">
          <div className="px-4 pt-4 pb-3">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl border border-border/60 bg-primary/10 grid place-items-center">
                <Sparkles className="text-primary" size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="font-black tracking-tight text-base leading-tight truncate">
                  Admin CRM
                </h2>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">
                  Edu Panel
                </p>
              </div>
            </div>

            {/* User mini card */}
            <Link
              href="/profile"
              className="mt-4 flex items-center gap-3 rounded-3xl border border-border/60 bg-card/40 hover:bg-muted/30 transition p-3"
            >
              <div className="h-11 w-11 rounded-2xl overflow-hidden border border-border/60 bg-muted grid place-items-center">
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CircleUser className="text-muted-foreground" size={22} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">
                  {user?.first_name
                    ? `${user.first_name} ${user?.last_name || ""}`
                    : "Foydalanuvchi"}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] font-black text-muted-foreground truncate">
                  {user?.role || "manager"}
                </p>
              </div>

              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                Profil
              </span>
            </Link>
          </div>
        </div>

        {/* SCROLL AREA */}
        <div className="h-[calc(100%-150px)] overflow-y-auto px-4 py-4">
          <div className="mb-3">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary/60" />
              Menu
            </span>
          </div>

          <ul className="space-y-1.5">
            {MENU.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link className={navItemClass(active)} href={item.href}>
                    <span className={iconWrapClass(active)}>
                      <Icon size={18} />
                    </span>
                    <span className="font-semibold text-sm">{item.label}</span>
                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-primary shadow-[0_0_0_6px_rgba(59,130,246,0.12)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-6 border-t border-border/60" />

          <div className="mb-3">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-blue-500/60" />
              Boshqalar
            </span>
          </div>

          <ul className="space-y-1.5">
            {OTHER.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link className={navItemClass(active)} href={item.href}>
                    <span className={iconWrapClass(active)}>
                      <Icon size={18} />
                    </span>
                    <span className="font-semibold text-sm">{item.label}</span>
                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-primary shadow-[0_0_0_6px_rgba(59,130,246,0.12)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={handleLogout}
            className={cx(
              "mt-6 w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl border",
              "border-rose-500/20 bg-rose-500/10 text-rose-400",
              "hover:bg-rose-500/15 hover:border-rose-500/30 transition",
              "active:scale-[0.99]",
            )}
          >
            <span className="h-9 w-9 rounded-2xl grid place-items-center border border-rose-500/20 bg-rose-500/10">
              <LogOut size={18} />
            </span>
            <span className="font-black text-sm">Chiqish</span>
          </button>

          <div className="h-6" />
        </div>
      </div>
    </>
  );
};

export default Hedaer;