"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Banknote,
  Clock,
  Activity,
  ArrowUpRight,
  RefreshCcw,
  ShieldCheck,
  Server,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

type Stats = {
  totalStudents: number;
  activeGroups: number;
  monthlyRevenue: number;
  debtorsCount: number;
};

const fade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const card = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05 },
  }),
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

function MiniPill({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

function KPI({
  title,
  value,
  hint,
  icon,
  trend,
  loading,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  trend: string;
  loading: boolean;
}) {
  return (
    <div className="group rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-muted text-foreground">
          {icon}
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <ArrowUpRight size={12} className="opacity-70" />
          {trend}
        </div>
      </div>

      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>

      <div className="mt-2">
        {loading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <p className="text-2xl font-black tracking-tight">{value}</p>
        )}
      </div>

      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function StatLine({
  label,
  value,
  sub,
  icon,
  loading,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
      <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <p className="text-sm font-black">{value}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

export default function Asosiy() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    activeGroups: 0,
    monthlyRevenue: 0,
    debtorsCount: 0,
  });

  const BASE_URL = useMemo(
    () => process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070",
    [],
  );

  const token = useMemo(() => Cookies.get("token"), []);

  const fetchDashboardData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [groupsRes, studentsRes, paymentsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/group/get-all-group`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/student/get-all-student`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/payment/get-debtors-student?month=2026-02`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats({
        activeGroups: groupsRes.data?.data?.length || 0,
        totalStudents: studentsRes.data?.data?.length || 0,
        debtorsCount:
          paymentsRes.data?.data?.length || paymentsRes.data?.length || 0,
        monthlyRevenue: 45000000, // demo
      });
    } catch (error) {
      console.error("Dashboard xatosi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BASE_URL, token]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-foreground">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP HERO */}
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="rounded-[2rem] border border-border bg-card shadow-sm overflow-hidden"
        >
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                    <Sparkles size={12} className="text-primary" />
                    CRM Analytics
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                    <Activity size={12} className="text-primary" />
                    Overview
                  </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                  Boshqaruv paneli
                  <span className="text-primary"> • </span>
                  umumiy ko‘rsatkichlar
                </h1>

                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  Guruhlar, talabalar, qarzdorlar va tushum bo‘yicha holat.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <MiniPill
                  icon={<Server size={16} />}
                  title="Region"
                  value="Tashkent / UZ"
                />
                <MiniPill
                  icon={<ShieldCheck size={16} />}
                  title="Status"
                  value="Active"
                />

                <button
                  type="button"
                  onClick={fetchDashboardData}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-primary text-primary-foreground px-5 py-3 text-sm font-bold shadow-sm hover:opacity-90 transition active:scale-[0.98] disabled:opacity-60"
                  title="Refresh"
                  disabled={loading}
                >
                  <RefreshCcw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="h-2 w-full bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
        </motion.div>

        {/* KPI GRID */}
        <motion.div
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Talabalar",
              value: String(stats.totalStudents),
              hint: "Jami ro‘yxatdan o‘tganlar",
              icon: <Users size={18} />,
              trend: "8.2%",
            },
            {
              title: "Guruhlar",
              value: String(stats.activeGroups),
              hint: "Faol guruhlar soni",
              icon: <GraduationCap size={18} />,
              trend: "2.1%",
            },
            {
              title: "Qarzdorlar",
              value: String(stats.debtorsCount),
              hint: "Tanlangan oy bo‘yicha",
              icon: <Clock size={18} />,
              trend: "-1.4%",
            },
            {
              title: "Oylik tushum",
              value: `${stats.monthlyRevenue.toLocaleString()} so'm`,
              hint: "Demo qiymat (keyin APIga ulaysiz)",
              icon: <Banknote size={18} />,
              trend: "12.6%",
            },
          ].map((x, i) => (
            <motion.div key={x.title} variants={card} custom={i}>
              <KPI {...x} loading={loading} />
            </motion.div>
          ))}
        </motion.div>

        {/* MAIN: QUICK STATS + RECENT */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* QUICK STATS (chart o'rni) */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="lg:col-span-3 rounded-[2rem] border border-border bg-card p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Quick stats
                </p>
                <h3 className="mt-1 text-lg font-bold">Tezkor ko‘rsatkichlar</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Grafiksiz soddalashtirilgan dashboard.
                </p>
              </div>

              <span className="rounded-2xl border border-border bg-background px-3 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                2026-02
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatLine
                label="O‘rtacha o‘sish"
                value="↑ 6.4%"
                sub="Oxirgi 30 kun (demo)"
                icon={<TrendingUp size={16} />}
                loading={loading}
              />
              <StatLine
                label="Xavf zonasi"
                value={`${stats.debtorsCount} qarzdor`}
                sub="To‘lov nazorati kerak"
                icon={<AlertTriangle size={16} />}
                loading={loading}
              />
              <StatLine
                label="Sifat ko‘rsatkichi"
                value="OK"
                sub="Tizim ishlashi barqaror"
                icon={<CheckCircle2 size={16} />}
                loading={loading}
              />
              <StatLine
                label="Faol guruhlar"
                value={`${stats.activeGroups} ta`}
                sub="Jadval bo‘yicha ishlayotganlar"
                icon={<GraduationCap size={16} />}
                loading={loading}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-background p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                Eslatma
              </p>
              <p className="mt-2 text-sm font-semibold">
                Agar xohlasangiz, bu yerga “Top 5 qarzdor” yoki “Bugungi
                darslar” ro‘yxatini ham qo‘shib beraman.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Hamma sahifalarda bir xil dizayn bo‘lishi uchun shu component
                uslubini davom ettiramiz.
              </p>
            </div>
          </motion.div>

          {/* RECENT / INSIGHTS */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 rounded-[2rem] border border-border bg-card p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Insights
                </p>
                <h3 className="mt-1 text-lg font-bold">Tezkor xulosalar</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  (Demo) — keyin real “events” bilan ulaysiz.
                </p>
              </div>

              <span className="rounded-full border border-border bg-background px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                live
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { title: "Yangi guruh yaratildi", time: "09:41", tone: "primary" },
                { title: "To‘lov qabul qilindi", time: "08:30", tone: "emerald" },
                {
                  title: "Qarzdorlik eslatmasi yuborildi",
                  time: "07:15",
                  tone: "rose",
                },
                { title: "Talaba ro‘yxatdan o‘tdi", time: "06:05", tone: "blue" },
              ].map((x, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {x.time}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest border ${
                        x.tone === "emerald"
                          ? "text-emerald-600 border-emerald-600/20 bg-emerald-500/10"
                          : x.tone === "rose"
                            ? "text-rose-600 border-rose-600/20 bg-rose-500/10"
                            : x.tone === "blue"
                              ? "text-blue-600 border-blue-600/20 bg-blue-500/10"
                              : "text-primary border-primary/20 bg-primary/10"
                      }`}
                    >
                      event
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold">{x.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Avtomatik tizim hodisasi (demo).
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-2xl border border-border bg-primary text-primary-foreground py-3 text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition"
            >
              To‘liq hisobot
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}