"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Search,
  Plus,
  MoreHorizontal,
  X,
  ChevronDown,
  Loader2,
  Users,
  GraduationCap,
  Phone,
  BadgeCheck,
  AlertTriangle,
  Calendar,
  Trash2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: "faol" | "ta'tilda" | "yakunladi" | string;
}

const cx = (...c: Array<string | false | undefined | null>) =>
  c.filter(Boolean).join(" ");

function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void,
) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains(e.target as Node)) return;
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

const statusTone = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s === "faol") return "green";
  if (s.includes("ta'til")) return "amber";
  if (s.includes("yakun")) return "blue";
  return "neutral";
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
      <div className="h-4 w-28 rounded-lg bg-muted animate-pulse" />
    </td>
    <td className="p-4">
      <div className="h-4 w-28 rounded-lg bg-muted animate-pulse" />
    </td>
    <td className="p-4">
      <div className="h-7 w-28 rounded-full bg-muted animate-pulse" />
    </td>
    <td className="p-4 text-right">
      <div className="ml-auto h-9 w-12 rounded-2xl bg-muted animate-pulse" />
    </td>
  </tr>
);

const Students = () => {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";
  const token = Cookies.get("token");

  // Fetch Students
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students", filterStatus],
    queryFn: async () => {
      const url = filterStatus
        ? `${BASE_URL}/api/student/get-all-students?status=${filterStatus}`
        : `${BASE_URL}/api/student/get-all-students`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    },
    enabled: !!token,
  });

  // Create Student
  const createMutation = useMutation({
    mutationFn: async (newStudent: typeof formData) => {
      return axios.post(`${BASE_URL}/api/student/create-student`, newStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsModalOpen(false);
      setFormData({ first_name: "", last_name: "", phone: "" });
    },
    onError: () => alert("Qo'shishda xatolik"),
  });

  // Delete Student
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${BASE_URL}/api/student/delete-student`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { _id: id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setActiveMenu(null);
    },
    onError: () => alert("Xatolik"),
  });

  // Leave/Return Student
  const statusMutation = useMutation({
    mutationFn: async ({ action, payload }: any) => {
      const endpoint = action === "return" ? "return-student" : "leave-student";
      return axios.post(`${BASE_URL}/api/student/${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setActiveMenu(null);
      alert("Muvaffaqiyatli bajarildi!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Amalda xatolik yuz berdi");
    },
  });

  const filtered = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    const arr = Array.isArray(students) ? students : [];
    if (!s) return arr;
    return arr.filter((st: Student) =>
      `${st.first_name} ${st.last_name} ${st.phone}`.toLowerCase().includes(s),
    );
  }, [students, searchTerm]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tasdiqlaysizmi?")) deleteMutation.mutate(id);
  };

  const handleLeaveReturn = (student: Student) => {
    if (student.status === "ta'tilda" || student.status === "yakunladi") {
      if (!confirm("O'quvchini faol holatga qaytarishni tasdiqlaysizmi?")) return;
      statusMutation.mutate({
        action: "return",
        payload: { _id: student._id },
      });
    } else if (student.status === "faol") {
      const days = prompt("Necha kunlik ta'til? (Masalan: 4)", "4");
      const reason = prompt("Sababi?", "Tobi yo'q");
      if (!days || !reason) return;
      statusMutation.mutate({
        action: "leave",
        payload: {
          student_id: student._id,
          leave_days: days,
          reason,
        },
      });
    }
  };

  const ActionMenu = ({
    student,
    onClose,
  }: {
    student: Student;
    onClose: () => void;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, onClose);

    const isReturnable = student.status === "ta'tilda" || student.status === "yakunladi";
    const pendingForThis =
      statusMutation.isPending &&
      (statusMutation.variables?.payload?._id === student._id ||
        statusMutation.variables?.payload?.student_id === student._id);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
        className="absolute right-2 top-12 z-[120] w-56 overflow-hidden rounded-2xl border border-border bg-popover/85 text-popover-foreground shadow-xl backdrop-blur"
      >
        <button
          disabled={statusMutation.isPending}
          onClick={() => handleLeaveReturn(student)}
          className={cx(
            "w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-bold transition border-b border-border disabled:opacity-60",
            isReturnable ? "text-emerald-500 hover:bg-emerald-500/10" : "text-amber-500 hover:bg-amber-500/10",
          )}
        >
          <span className="inline-flex items-center gap-2">
            <Calendar size={16} />
            {isReturnable ? "Faolga qaytarish" : "Ta'tilga chiqarish"}
          </span>
          {pendingForThis && <Loader2 size={16} className="animate-spin" />}
        </button>

        <button
          disabled={deleteMutation.isPending && deleteMutation.variables === student._id}
          onClick={() => handleDelete(student._id)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition disabled:opacity-60"
        >
          <span className="inline-flex items-center gap-2">
            <Trash2 size={16} />
            O&apos;chirish
          </span>
          {deleteMutation.isPending && deleteMutation.variables === student._id && (
            <Loader2 size={16} className="animate-spin" />
          )}
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <GraduationCap size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  Students
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
                Studentlar ro&apos;yxati
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Qidirish, filtr, qo&apos;shish va status amallari.
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full lg:w-auto">
              {/* Filter */}
              <div className="relative w-full sm:w-[170px]">
                <select
                  className="w-full appearance-none rounded-2xl border border-border bg-background/60 py-3 pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Barchasi</option>
                  <option value="faol">Faol</option>
                  <option value="ta'tilda">Ta&apos;tilda</option>
                  <option value="yakunladi">Yakunladi</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  size={16}
                />
              </div>

              {/* Search */}
              <div className="relative flex-1 sm:w-[320px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Qidiruv: ism, tel..."
                  className="w-full rounded-2xl border border-border bg-background/60 py-3 pl-11 pr-11 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                Student qo&apos;shish
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Users size={14} />
              Natija: <b className="text-foreground">{filtered.length}</b>
            </span>
            <span className="font-mono">{isLoading ? "loading..." : "ready"}</span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-border">
                <tr className="text-[11px] uppercase text-muted-foreground font-black tracking-widest">
                  <th className="p-4">Student</th>
                  <th className="p-4">Familiya</th>
                  <th className="p-4">Telefon</th>
                  <th className="p-4">Holat</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                ) : filtered.length === 0 ? (
                  <tr className="border-t border-border">
                    <td colSpan={5} className="p-10 text-center">
                      <div className="mx-auto max-w-md space-y-2">
                        <div className="mx-auto w-fit rounded-2xl border border-border bg-background/60 p-3">
                          <AlertTriangle className="text-muted-foreground" />
                        </div>
                        <p className="font-black">Hech narsa topilmadi</p>
                        <p className="text-sm text-muted-foreground">
                          Qidiruv yoki filtrni o‘zgartirib ko‘ring.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((student: Student) => {
                    const initials =
                      `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`.toUpperCase();

                    return (
                      <tr
                        key={student._id}
                        className="border-t border-border hover:bg-muted/40 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl border border-border bg-background/60 flex items-center justify-center font-black">
                              {initials || "S"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold truncate max-w-[220px]">
                                {student.first_name}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono truncate max-w-[220px]">
                                {student._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <p className="font-medium text-muted-foreground">
                            {student.last_name}
                          </p>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone size={14} />
                            <span className="font-mono text-xs">
                              {student.phone || "---"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <Badge tone={statusTone(student.status)}>
                            <span
                              className={cx(
                                "h-2 w-2 rounded-full",
                                student.status === "faol"
                                  ? "bg-emerald-500"
                                  : student.status === "ta'tilda"
                                    ? "bg-amber-500"
                                    : student.status === "yakunladi"
                                      ? "bg-blue-500"
                                      : "bg-zinc-400",
                              )}
                            />
                            {student.status}
                          </Badge>
                        </td>

                        <td className="p-4 text-right relative">
                          <button
                            onClick={() =>
                              setActiveMenu(activeMenu === student._id ? null : student._id)
                            }
                            className="inline-flex items-center justify-center rounded-2xl border border-border bg-background/50 px-3 py-2 hover:bg-muted/60 transition"
                            aria-label="Menu"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          <AnimatePresence>
                            {activeMenu === student._id && (
                              <ActionMenu
                                student={student}
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
                className="relative w-full max-w-lg rounded-3xl border border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
                  <div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight">
                      Student qo&apos;shish
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ism, familiya va telefon raqamini kiriting.
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

                <form onSubmit={handleAddStudent} className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Ism
                      </label>
                      <input
                        required
                        placeholder="Ali"
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({ ...formData, first_name: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Familiya
                      </label>
                      <input
                        required
                        placeholder="Valiyev"
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({ ...formData, last_name: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Telefon
                      </label>
                      <input
                        required
                        placeholder="+998 90 123 45 67"
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
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

export default Students;