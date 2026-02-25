"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Search,
  Plus,
  X,
  MoreHorizontal,
  RotateCcw,
  Info,
  Loader2,
  Users,
  GraduationCap,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface Teacher {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
}

const STATIC_COURSES = [
  { id: "6994723c9a3d056f54b7e4a2", name: "Ingliz tili" },
  { id: "681dcb7444fa70421ae9fb9d", name: "Frontend dasturlash" },
];

const cx = (...c: Array<string | false | undefined | null>) =>
  c.filter(Boolean).join(" ");

function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return; // <<< ref null bo‘lishi mumkin
      if (el.contains(e.target as Node)) return;
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

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
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
        styles,
      )}
    >
      {children}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="border-t border-border/70">
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-28 rounded-lg bg-muted animate-pulse" />
          <div className="h-3 w-40 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-4 w-44 rounded-lg bg-muted animate-pulse" />
    </td>
    <td className="p-4">
      <div className="h-4 w-24 rounded-lg bg-muted animate-pulse" />
    </td>
    <td className="p-4 text-right">
      <div className="ml-auto h-9 w-28 rounded-2xl bg-muted animate-pulse" />
    </td>
  </tr>
);

const Teachers = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    course_id: STATIC_COURSES[0].id,
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("token");

  const { data: teachers = [], isLoading: loading } = useQuery({
    queryKey: ["teachers", filterStatus],
    queryFn: async () => {
      const url = filterStatus
        ? `${BASE_URL}/api/teacher/get-all-teachers?status=${filterStatus}`
        : `${BASE_URL}/api/teacher/get-all-teachers`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (newTeacher: typeof formData) => {
      return axios.post(`${BASE_URL}/api/teacher/create-teacher`, newTeacher, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setIsModalOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        course_id: STATIC_COURSES[0].id,
      });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Xatolik!");
    },
  });

  const fireMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${BASE_URL}/api/teacher/fire-teacher`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { _id: id },
      });
    },
    onSuccess: () => {
      alert("Ustoz ishdan bo'shatildi");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setActiveMenu(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "O'chirishda xatolik yuz berdi");
    },
  });

  const returnMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.post(
        `${BASE_URL}/api/teacher/return-teacher`,
        { _id: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      alert("Ustoz faoliyatga qaytarildi");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setActiveMenu(null);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Xatolik yuz berdi!");
    },
  });

  const filteredData = useMemo(() => {
    if (!Array.isArray(teachers)) return [];
    const s = searchTerm.trim().toLowerCase();
    if (!s) return teachers;
    return teachers.filter((t: Teacher) =>
      `${t.first_name} ${t.last_name} ${t.email}`
        .toLowerCase()
        .includes(s),
    );
  }, [searchTerm, teachers]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleFireTeacher = (id: string) => {
    if (confirm("Ustozni ishdan bo'shatmoqchimisiz?")) fireMutation.mutate(id);
  };

  const handleReturnTeacher = (id: string) => {
    returnMutation.mutate(id);
  };

  const statusTone = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "faol") return "green";
    if (s.includes("tatil")) return "amber";
    return "red";
  };

  const ActionMenu = ({
    teacher,
    onClose,
  }: {
    teacher: Teacher;
    onClose: () => void;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, onClose);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        className="absolute right-2 top-12 z-[120] w-44 overflow-hidden rounded-2xl border border-border bg-popover/85 text-popover-foreground shadow-xl backdrop-blur"
      >
        {teacher.status === "faol" ? (
          <button
            disabled={fireMutation.isPending}
            onClick={() => handleFireTeacher(teacher._id)}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition border-b border-border disabled:opacity-60"
          >
            {fireMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            Ishdan bo&apos;shatish
          </button>
        ) : (
          <button
            disabled={returnMutation.isPending}
            onClick={() => handleReturnTeacher(teacher._id)}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-emerald-500 hover:bg-emerald-500/10 transition border-b border-border disabled:opacity-60"
          >
            {returnMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RotateCcw size={16} />
            )}
            Faolga qaytarish
          </button>
        )}

        <button
          onClick={() => router.push(`/teachers/${teacher._id}`)}
          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold hover:bg-muted/60 transition"
        >
          <Info size={16} />
          Ma&apos;lumot
        </button>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-screen w-full p-4 sm:p-6 lg:p-8 text-foreground overflow-hidden">
      {/* accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <GraduationCap size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  Teachers
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
                Ustozlar ro&apos;yxati
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ustoz qo&apos;shish, status va profil ma&apos;lumotlari.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full xl:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-[320px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Qidiruv: ism, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background/60 py-3 pl-11 pr-11 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                />
                {!!searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-border bg-background/60 p-1.5 hover:bg-muted/60 transition"
                    aria-label="Clear"
                    title="Tozalash"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Add */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm"
              >
                <Plus size={16} />
                Ustoz qo&apos;shish
              </button>

              {/* Filter */}
              <div className="relative w-full sm:w-[170px]">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-border bg-background/60 py-3 pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                >
                  <option value="">Barchasi</option>
                  <option value="faol">Faol</option>
                  <option value="ishdan bo'shatilgan">Nofaol</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Users size={14} />
              Natija: <b className="text-foreground">{filteredData.length}</b>
            </span>
            <span className="font-mono">{loading ? "loading..." : "ready"}</span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-border">
                <tr className="text-[11px] uppercase text-muted-foreground font-black tracking-widest">
                  <th className="p-4">Ustoz</th>
                  <th className="p-4">Kontakt</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Holat</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : filteredData.length === 0 ? (
                  <tr className="border-t border-border">
                    <td colSpan={5} className="p-10 text-center text-muted-foreground">
                      Hech narsa topilmadi.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((t: Teacher) => {
                    const initials =
                      `${t.first_name?.[0] || ""}${t.last_name?.[0] || ""}`.toUpperCase();
                    return (
                      <tr
                        key={t._id}
                        className="border-t border-border hover:bg-muted/40 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl border border-border bg-background/60 flex items-center justify-center font-black">
                              {initials || "T"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold truncate max-w-[220px]">
                                {t.first_name} {t.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono truncate max-w-[220px]">
                                {t._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone size={14} />
                            <span className="font-mono text-xs">
                              {t.phone || "---"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail size={14} />
                            <span className="font-mono text-xs truncate max-w-[260px] block">
                              {t.email}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <Badge tone={statusTone(t.status)}>
                            <span
                              className={cx(
                                "h-2 w-2 rounded-full",
                                t.status === "faol" ? "bg-emerald-500" : "bg-rose-500",
                              )}
                            />
                            {t.status}
                          </Badge>
                        </td>

                        <td className="p-4 text-right relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === t._id ? null : t._id)}
                            className="inline-flex items-center justify-center rounded-2xl border border-border bg-background/50 px-3 py-2 hover:bg-muted/60 transition"
                            aria-label="Menu"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          <AnimatePresence>
                            {activeMenu === t._id && (
                              <ActionMenu
                                teacher={t}
                                onClose={() => setActiveMenu(null)}
                              />
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-black/45"
                onClick={() => setIsModalOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="relative w-full max-w-xl rounded-3xl border border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
                  <div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight">
                      Ustoz qo&apos;shish
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ma&apos;lumotlarni to&apos;ldiring va saqlang.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background/50 hover:bg-muted/60 transition"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Ism
                      </label>
                      <input
                        required
                        placeholder="Ali"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({ ...formData, first_name: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Familiya
                      </label>
                      <input
                        required
                        placeholder="Valiyev"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({ ...formData, last_name: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Telefon
                      </label>
                      <input
                        required
                        placeholder="+998 90 123 45 67"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Parol
                      </label>
                      <input
                        required
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Ustoz sohasi
                      </label>
                      <div className="relative">
                        <select
                          value={formData.course_id}
                          onChange={(e) =>
                            setFormData({ ...formData, course_id: e.target.value })
                          }
                          className="w-full appearance-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                        >
                          {STATIC_COURSES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                          size={16}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-bold hover:bg-muted/60 transition"
                    >
                      Bekor qilish
                    </button>

                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="flex-1 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {createMutation.isPending && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      Saqlash
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Teachers;