"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Pencil,
  Trash2,
  UserPlus,
  Search,
  X,
  ChevronDown,
  RotateCcw,
  Shield,
  Users,
  Mail,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  role: string;
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
  tone?: "green" | "red" | "blue" | "amber" | "neutral";
  children: React.ReactNode;
}) => {
  const styles =
    tone === "green"
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      : tone === "red"
        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
        : tone === "blue"
          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
          : tone === "amber"
            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
            : "bg-muted/50 text-muted-foreground border-border";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-widest whitespace-nowrap",
        styles,
      )}
    >
      {children}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="border-t border-border/70">
    {Array.from({ length: 4 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 w-full max-w-[240px] rounded-lg bg-muted animate-pulse" />
      </td>
    ))}
    <td className="p-4 text-right">
      <div className="ml-auto h-9 w-28 rounded-2xl bg-muted animate-pulse" />
    </td>
  </tr>
);

export default function AdminPanel() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "admin",
    status: "faol",
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("token");

  // --- 1. FETCHING (GET) ---
  const { data: admins = [], isLoading: loading } = useQuery({
    queryKey: ["admins", filterStatus],
    queryFn: async () => {
      if (!token) return [];
      const res = await axios.get(
        `${BASE_URL}/api/staff/all-admins?status=${filterStatus}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data?.data || [];
    },
    enabled: !!token,
  });

  // --- 2. STATUS TOGGLE MUTATION ---
  const statusMutation = useMutation({
    mutationFn: async (admin: AdminUser) => {
      const isRestoring = admin.status === "ishdan bo'shatilgan";
      const newStatus = isRestoring ? "faol" : "ishdan bo'shatilgan";
      return axios.post(
        `${BASE_URL}/api/staff/edited-admin`,
        {
          _id: admin._id,
          first_name: admin.first_name,
          last_name: admin.last_name,
          email: admin.email,
          status: newStatus,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: () => alert("Xatolik yuz berdi"),
  });

  // --- 3. DELETE MUTATION ---
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${BASE_URL}/api/staff/deleted-admin`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { _id: id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      alert("Muvaffaqiyatli o'chirildi");
    },
    onError: (err: any) => {
      alert(
        err.response?.status === 403
          ? "Huquqingiz yetarli emas!"
          : "Xatolik yuz berdi",
      );
    },
  });

  // --- 4. SAVE (CREATE/EDIT) MUTATION ---
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const endpoint = editingAdmin
        ? "/api/staff/edited-admin"
        : "/api/staff/create-admin";
      return axios.post(`${BASE_URL}${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsModalOpen(false);
      alert("Muvaffaqiyatli saqlandi!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Xatolik yuz berdi");
    },
  });

  const filteredData = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    if (!s) return admins;
    return admins.filter((admin: AdminUser) =>
      `${admin.first_name} ${admin.last_name} ${admin.email}`
        .toLowerCase()
        .includes(s),
    );
  }, [searchTerm, admins]);

  const handleStatusToggle = (admin: AdminUser) => {
    const isRestoring = admin.status === "ishdan bo'shatilgan";
    if (
      confirm(
        isRestoring ? "Ishga qaytarmoqchimisiz?" : "Ishdan bo'shatmoqchimisiz?",
      )
    ) {
      statusMutation.mutate(admin);
    }
  };

  const handleDelete = (id: string) => {
    if (
      confirm("Haqiqatan ham ushbu adminni bazadan butunlay o'chirmoqchimisiz?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const openModal = (admin: AdminUser | null = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
        role: admin.role,
        status: admin.status || "faol",
        password: "",
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "admin",
        status: "faol",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload = editingAdmin
      ? {
          _id: editingAdmin._id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          status: formData.status,
        }
      : {
          ...formData,
          role: formData.role.toLowerCase(),
          work_date: new Date().toISOString().split("T")[0],
        };

    saveMutation.mutate(payload);
  };

  const roleTone = (role: string) => {
    const r = (role || "").toLowerCase();
    if (r.includes("super") || r.includes("owner")) return "amber";
    if (r.includes("admin")) return "blue";
    return "neutral";
  };

  const statusTone = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "faol") return "green";
    if (s === "tatilda") return "amber";
    if (s.includes("ishdan")) return "red";
    return "neutral";
  };

  return (
    <div className="relative min-h-screen w-full p-4 sm:p-6 lg:p-8 overflow-hidden text-foreground">
      {/* accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl space-y-5">
        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Shield size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  Admin Control
                </span>
              </div>

              <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
                Adminlar boshqaruvi
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Admin qo‘shish, tahrirlash, status va o‘chirish amallari.
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full lg:w-auto">
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
                  className="w-full rounded-2xl border border-border bg-background/60 py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring transition"
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
                onClick={() => openModal(null)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm"
              >
                <UserPlus size={16} />
                Qo&apos;shish
              </button>

              {/* Filter */}
              <div className="relative w-full sm:w-[150px]">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-border bg-background/60 py-3 pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                >
                  <option value="">Barchasi</option>
                  <option value="faol">Faol</option>
                  <option value="tatilda">Tatilda</option>
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
            <span className="font-mono">
              {loading ? "loading..." : "ready"}
            </span>
          </div>
        </motion.div>

        {/* Table card */}
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <BadgeCheck size={16} className="text-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                Admins
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Mail size={14} />
              <span>Ro‘yxat & amallar</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[880px] text-left">
              <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-border">
                <tr className="text-[11px] uppercase text-muted-foreground font-black tracking-widest">
                  <th className="p-4">Admin</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rol</th>
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
                    <td colSpan={5} className="p-10 text-center">
                      <div className="mx-auto max-w-md space-y-2">
                        <div className="mx-auto w-fit rounded-2xl border border-border bg-background/60 p-3">
                          <AlertTriangle className="text-muted-foreground" />
                        </div>
                        <p className="font-black">Hech narsa topilmadi</p>
                        <p className="text-sm text-muted-foreground">
                          Qidiruv so‘zini yoki status filtrini o‘zgartirib ko‘ring.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item: AdminUser) => (
                    <tr
                      key={item._id}
                      className="border-t border-border hover:bg-muted/40 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl border border-border bg-background/60 flex items-center justify-center font-black">
                            {(item.first_name?.[0] || "A").toUpperCase()}
                            {(item.last_name?.[0] || "").toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold truncate">
                              {item.first_name} {item.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[340px]">
                              ID: <span className="font-mono">{item._id}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-muted-foreground font-mono text-xs">
                          {item.email}
                        </span>
                      </td>

                      <td className="p-4">
                        <Badge tone={roleTone(item.role)}>{item.role}</Badge>
                      </td>

                      <td className="p-4">
                        <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openModal(item)}
                            className="inline-flex items-center justify-center rounded-2xl border border-border bg-background/50 px-3 py-2 hover:bg-muted/60 transition text-muted-foreground hover:text-foreground"
                            title="Tahrirlash"
                          >
                            <Pencil size={16} />
                          </button>

                          {item.status === "ishdan bo'shatilgan" ? (
                            <button
                              onClick={() => handleStatusToggle(item)}
                              disabled={statusMutation.isPending}
                              className="inline-flex items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 hover:opacity-90 transition text-emerald-500 disabled:opacity-60"
                              title="Ishga qaytarish"
                            >
                              <RotateCcw size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusToggle(item)}
                              disabled={statusMutation.isPending}
                              className="inline-flex items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 hover:opacity-90 transition text-rose-500 disabled:opacity-60"
                              title="Ishdan bo'shatish"
                            >
                              <X size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 hover:opacity-90 transition text-rose-500 disabled:opacity-60"
                            title="Butunlay o'chirish"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
                      {editingAdmin ? "Adminni tahrirlash" : "Yangi admin qo‘shish"}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ma’lumotlarni to‘ldiring va saqlang.
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

                <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Ism
                      </label>
                      <input
                        required
                        placeholder="Ism"
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
                        placeholder="Familiya"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({ ...formData, last_name: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                    />
                  </div>

                  {!editingAdmin && (
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Parol
                      </label>
                      <input
                        required
                        type="password"
                        placeholder="Parol"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>
                  )}

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
                      disabled={saveMutation.isPending}
                      className="flex-1 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm disabled:opacity-60"
                    >
                      {saveMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
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
}