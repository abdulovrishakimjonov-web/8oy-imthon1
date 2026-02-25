"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  GraduationCap,
  Banknote,
  Clock,
  Zap,
  Activity,
  Globe,
  ArrowUpRight,
  RefreshCcw,
} from "lucide-react";

type Stats = {
  totalStudents: number;
  activeGroups: number;
  monthlyRevenue: number;
  debtorsCount: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const cardPop = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.06, ease: "easeOut" },
  }),
};

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

  const chartData = useMemo(
    () => [
      { n: "Du", v: 4000 },
      { n: "Se", v: 3000 },
      { n: "Cho", v: 5000 },
      { n: "Pa", v: 2780 },
      { n: "Ju", v: 1890 },
      { n: "Sha", v: 2390 },
    ],
    [],
  );

  useEffect(() => {
    setMounted(true);

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
          axios.get(
            `${BASE_URL}/api/payment/get-debtors-student?month=2026-02`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ]);

        setStats({
          activeGroups: groupsRes.data?.data?.length || 0,
          totalStudents: studentsRes.data?.data?.length || 0,
          debtorsCount:
            paymentsRes.data?.data?.length || paymentsRes.data?.length || 0,
          monthlyRevenue: 45000000,
        });
      } catch (error) {
        console.error("Dashboard xatosi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [BASE_URL, token]);

  if (!mounted) return null;

  const cards = [
    {
      label: "Talabalar",
      value: stats.totalStudents,
      icon: Users,
      ring: "ring-blue-500/20",
      iconBg: "bg-blue-500/10",
      iconText: "text-blue-500",
      trend: "+8.2%",
      trendText: "text-blue-500",
    },
    {
      label: "Guruhlar",
      value: stats.activeGroups,
      icon: GraduationCap,
      ring: "ring-emerald-500/20",
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-500",
      trend: "+2.1%",
      trendText: "text-emerald-500",
    },
    {
      label: "Qarzdorlar",
      value: stats.debtorsCount,
      icon: Clock,
      ring: "ring-rose-500/20",
      iconBg: "bg-rose-500/10",
      iconText: "text-rose-500",
      trend: "-1.4%",
      trendText: "text-rose-500",
    },
    {
      label: "Oylik Tushum",
      value: `${stats.monthlyRevenue.toLocaleString()} so'm`,
      icon: Banknote,
      ring: "ring-amber-500/25",
      iconBg: "bg-amber-500/10",
      iconText: "text-amber-500",
      trend: "+12.6%",
      trendText: "text-amber-500",
    },
  ] as const;

  return (
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-8 text-foreground overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-rose-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 rounded-3xl border border-border bg-card/70 p-5 sm:p-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/50"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Activity size={18} className="opacity-90" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-muted-foreground">
                  Dashboard Overview
                </span>
              </div>

              <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
                Boshqaruv paneli{" "}
                <span className="text-primary">statistikasi</span>
              </h1>

              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Guruhlar, talabalar, qarzdorlar va tushum bo‘yicha umumiy holat.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3">
                <Globe size={16} className="text-primary" />
                <div className="leading-tight">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Server
                  </p>
                  <p className="text-sm font-mono font-bold">Tashkent / UZ</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3">
                <Zap size={16} className="text-yellow-500" />
                <div className="leading-tight">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    Active
                    <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-emerald-500 align-middle" />
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm font-bold hover:bg-background transition"
                title="Yangilash"
              >
                <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              variants={cardPop}
              custom={i}
              whileHover={{ y: -2 }}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/50 ring-1 ${c.ring}`}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-80" />

              <div className="flex items-start justify-between gap-3">
                <div className={`rounded-2xl p-3 ${c.iconBg}`}>
                  <c.icon size={22} className={c.iconText} />
                </div>

                <div className="flex items-center gap-1 text-[11px] font-black">
                  <span className={c.trendText}>{c.trend}</span>
                  <ArrowUpRight size={14} className={c.trendText} />
                </div>
              </div>

              <p className="mt-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                {c.label}
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <h2 className="text-2xl font-black tracking-tight">
                  {loading ? (
                    <span className="inline-block h-7 w-28 rounded-xl bg-muted animate-pulse" />
                  ) : (
                    c.value
                  )}
                </h2>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Oxirgi 7 kun bo‘yicha dinamik ko‘rsatkich.
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Chart */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 rounded-3xl border border-border bg-card/70 p-5 sm:p-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/50"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Activity size={16} className="text-primary" />
                  Oqim analitikasi
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Haftalik ko‘rsatkich (demo data).
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-3 py-2 text-xs font-bold">
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-mono">2026-02</span>
              </div>
            </div>

            <div className="mt-5 h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: 0, right: 8 }}>
                  <defs>
                    <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="n"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{ stroke: "hsl(var(--border))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    labelStyle={{ fontWeight: 800 }}
                  />

                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#dashArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-5 sm:p-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/50"
          >
            {/* scanning line */}
            <motion.div
              animate={{ top: ["-10%", "110%"] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute left-0 top-0 z-20 h-[2px] w-full bg-primary/25 shadow-[0_0_18px_hsl(var(--primary))]"
            />

            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Globe size={16} className="text-primary" />
                  Tizim jurnali
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Oxirgi faoliyatlar (demo).
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-background/60 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Live
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { t: "09:41", m: "Yangi guruh yaratildi", c: "text-primary" },
                { t: "08:30", m: "To'lov qabul qilindi", c: "text-emerald-500" },
                {
                  t: "07:15",
                  m: "Qarzdorlik xabari yuborildi",
                  c: "text-rose-500",
                },
                { t: "06:05", m: "Talaba ro‘yxatdan o‘tdi", c: "text-blue-500" },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-background/50 px-4 py-3"
                >
                  <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {log.t}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        event
                      </span>
                    </div>
                    <p className={`mt-1 text-sm font-bold ${log.c}`}>
                      {log.m}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-2xl border border-border bg-primary text-primary-foreground py-3 text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition"
            >
              To'liq hisobot
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}