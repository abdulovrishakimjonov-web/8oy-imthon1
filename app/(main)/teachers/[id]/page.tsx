"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Briefcase,
  ArrowLeft,
  Shield,
  Activity,
} from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface TeacherDetail {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  field?: string;
  salary?: number;
  createdAt?: string;
  work_date?: string;
  work_end?: string;
  updatedAt?: string;
  groups?: any[];
}

const cx = (...c: Array<string | false | undefined | null>) =>
  c.filter(Boolean).join(" ");

const Badge = ({
  tone = "neutral",
  children,
}: {
  tone?: "green" | "red" | "amber" | "blue" | "neutral";
  children: React.ReactNode;
}) => {
  const styles =
    tone === "green"
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      : tone === "red"
        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
        : tone === "amber"
          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
          : tone === "blue"
            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
            : "bg-muted/50 text-muted-foreground border-border";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
        styles,
      )}
    >
      {children}
    </span>
  );
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleDateString("uz-UZ", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const InfoItem = ({
  label,
  value,
  icon,
  mono = false,
}: {
  label: string;
  value?: string;
  icon: React.ReactNode;
  mono?: boolean;
}) => (
  <div className="rounded-2xl border border-border bg-background/40 px-4 py-3">
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
    <p
      className={cx(
        "mt-2 text-sm font-bold",
        mono && "font-mono text-[12px]",
      )}
    >
      {value || "---"}
    </p>
  </div>
);

const StatCard = ({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ duration: 0.15 }}
    className="group relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/50"
  >
    <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/10 blur-2xl opacity-70" />

    <div className="flex items-start justify-between gap-4">
      <div className="rounded-2xl border border-primary/15 bg-primary/10 p-3 text-primary">
        {icon}
      </div>

      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-2xl font-black tracking-tight">{value}</p>
      </div>
    </div>

    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
      <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <Activity size={14} className="text-primary" />
        Hozirgi holat
      </div>
      <p className="text-[11px] font-bold text-muted-foreground">
        {hint || "—"}
      </p>
    </div>
  </motion.div>
);

const TeacherInfo = () => {
  const { id } = useParams();
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("token");

  const { data: teacher, isLoading: loading } = useQuery({
    queryKey: ["teacher", id],
    queryFn: async () => {
      if (!token || !id) return null;

      try {
        const res = await axios.get(
          `${BASE_URL}/api/teacher/get-teacher-by-id/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return res.data?.data || res.data;
      } catch (err) {
        const allRes = await axios.get(`${BASE_URL}/api/teacher/get-all-teachers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = allRes.data?.data || allRes.data;
        const found = (Array.isArray(list) ? list : []).find((t: any) => t._id === id);
        return found || null;
      }
    },
    enabled: !!id && !!token,
  });

  const groupsCount = useMemo(() => teacher?.groups?.length || 0, [teacher]);

  const studentsCount = useMemo(() => {
    return (
      teacher?.groups?.reduce(
        (acc: number, group: any) => acc + (group?.students?.length || 0),
        0,
      ) || 0
    );
  }, [teacher]);

  const statusTone = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "faol") return "green";
    if (s.includes("tatil")) return "amber";
    return "red";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 px-10 py-10 shadow-sm text-center">
          <LoadingOutlined className="text-3xl text-primary" />
          <p className="mt-4 text-sm text-muted-foreground font-bold">
            Yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen p-6 text-foreground">
        <div className="max-w-md mx-auto text-center rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-8 shadow-sm">
          <p className="text-muted-foreground">
            Ma&apos;lumot topilmadi yoki xatolik yuz berdi.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm font-black hover:bg-muted/60 transition"
          >
            <ArrowLeft size={16} />
            Orqaga
          </button>
        </div>
      </div>
    );
  }

  const initials =
    `${teacher.first_name?.[0] || ""}${teacher.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-8 text-foreground overflow-hidden">
      {/* background accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm font-black hover:bg-muted/60 transition"
          >
            <ArrowLeft size={16} />
            Orqaga
          </button>

          <div className="flex items-center gap-2">
            <Badge tone="blue">
              <Shield size={14} />
              Teacher Profile
            </Badge>
            <Badge tone={statusTone(teacher.status)}>
              <span
                className={cx(
                  "h-2 w-2 rounded-full",
                  teacher.status === "faol"
                    ? "bg-emerald-500"
                    : teacher.status === "tatilda"
                      ? "bg-amber-500"
                      : "bg-rose-500",
                )}
              />
              {teacher.status}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full lg:w-[420px] rounded-[2rem] border border-border bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/50 h-fit"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-2xl opacity-70" />
                <div className="relative h-24 w-24 rounded-[2rem] border border-primary/20 bg-primary/10 text-primary flex items-center justify-center text-3xl font-black shadow-inner">
                  {initials}
                </div>
              </div>

              <h2 className="mt-5 text-2xl font-black tracking-tight">
                {teacher.first_name} {teacher.last_name}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground font-medium">
                {teacher.field || "O'qituvchi"}
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge tone="blue">
                  <Mail size={14} />
                  {teacher.email}
                </Badge>
                <Badge tone="neutral">
                  <Phone size={14} />
                  {teacher.phone || "---"}
                </Badge>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3">
              <InfoItem
                icon={<Mail size={14} />}
                label="Email"
                value={teacher.email}
                mono
              />
              <InfoItem
                icon={<Phone size={14} />}
                label="Telefon"
                value={teacher.phone || "---"}
                mono
              />
              <InfoItem
                icon={<Briefcase size={14} />}
                label="Mutaxassislik"
                value={teacher.field || "Noma'lum"}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <InfoItem
                  icon={<Calendar size={14} />}
                  label="Ish boshlagan"
                  value={formatDate(teacher.work_date)}
                />
                <InfoItem
                  icon={<Calendar size={14} />}
                  label="Ro'yxatdan o'tgan"
                  value={formatDate(teacher.createdAt)}
                />
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 self-start">
            <StatCard
              icon={<DollarSign />}
              label="Oylik maosh"
              value={`${teacher.salary?.toLocaleString() || 0} so'm`}
              hint="Hisob-kitob"
            />
            <StatCard
              icon={<TrendingUp />}
              label="Guruhlar soni"
              value={groupsCount.toString()}
              hint="Jami guruh"
            />
            <StatCard
              icon={<Users />}
              label="Jami o'quvchilar"
              value={studentsCount.toString()}
              hint="Guruhlar bo‘yicha"
            />
            <StatCard
              icon={<Users />}
              label="Aktiv o'quvchilar"
              value={studentsCount.toString()}
              hint="Hozircha demo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherInfo;