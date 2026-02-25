"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  X,
  Loader2,
  Search,
  Shield,
  UserCog,
  Mail,
  Users,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface Manager {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string; // "active" | "inactive" | ...
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

const SkeletonRow = () => (
  <tr className="border-t border-border/70">
    {Array.from({ length: 4 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 w-full max-w-[220px] rounded-lg bg-muted animate-pulse" />
      </td>
    ))}
    <td className="p-4 text-right">
      <div className="ml-auto h-9 w-24 rounded-xl bg-muted animate-pulse" />
    </td>
  </tr>
);

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
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-widest",
        styles,
      )}
    >
      {children}
    </span>
  );
};

const MenuButton = ({
  onEdit,
  onDelete,
  onClose,
}: {
  onEdit: () => void;
  onDelete: () => void;
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
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-2 top-12 z-50 w-44 overflow-hidden rounded-2xl border border-border bg-popover/80 text-popover-foreground shadow-xl backdrop-blur"
    >
      <button
        onClick={onEdit}
        className="w-full px-4 py-3 text-sm font-bold flex items-center gap-2 hover:bg-muted/60 transition border-b border-border"
      >
        <Pencil size={16} />
        Tahrirlash
      </button>
      <button
        onClick={onDelete}
        className="w-full px-4 py-3 text-sm font-bold flex items-center gap-2 hover:bg-destructive/10 text-destructive transition"
      >
        <Trash2 size={16} />
        O&apos;chirish
      </button>
    </motion.div>
  );
};

const Menagers = () => {
  const queryClient = useQueryClient();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [q, setQ] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const token = Cookies.get("token");

  const { data: managers = [], isLoading } = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      if (!BASE_URL || !token) return [];
      const response = await axios.get(`${BASE_URL}/api/staff/all-managers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resData = response.data;
      return Array.isArray(resData) ? resData : resData?.data || [];
    },
    enabled: !!token && !!BASE_URL,
  });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return managers;
    return managers.filter((m: Manager) => {
      const full = `${m.first_name} ${m.last_name}`.toLowerCase();
      return (
        full.includes(s) ||
        (m.email || "").toLowerCase().includes(s) ||
        (m.role || "").toLowerCase().includes(s) ||
        (m.status || "").toLowerCase().includes(s)
      );
    });
  }, [q, managers]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      return axios.post(`${BASE_URL}/api/staff/edited-manager`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      setIsEditModalOpen(false);
      setActiveMenu(null);
      alert("Muvaffaqiyatli saqlandi!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Tahrirlashda xatolik");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axios.delete(`${BASE_URL}/api/staff/deleted-admin`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { _id: id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      setActiveMenu(null);
    },
    onError: () => {
      alert("Xatolik yuz berdi");
    },
  });

  const handleEditClick = (manager: Manager) => {
    setSelectedManager(manager);
    setEditFormData({
      first_name: manager.first_name,
      last_name: manager.last_name,
      email: manager.email,
    });
    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  const handleUpdateManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManager) return;

    updateMutation.mutate({
      _id: selectedManager._id,
      first_name: editFormData.first_name,
      last_name: editFormData.last_name,
      email: editFormData.email,
      status: selectedManager.status,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("O'chirmoqchimisiz?")) deleteMutation.mutate(id);
  };

  const roleBadgeTone = (role: string) => {
    const r = (role || "").toLowerCase();
    if (r.includes("super") || r.includes("owner")) return "amber";
    if (r.includes("admin")) return "blue";
    return "neutral";
  };

  const statusTone = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("active") || s.includes("on")) return "green";
    if (s.includes("inactive") || s.includes("off") || s.includes("block"))
      return "red";
    return "neutral";
  };

  return (
    <div className="relative min-h-screen w-full p-4 sm:p-6 lg:p-8 text-foreground overflow-hidden">
      {/* background accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl space-y-5">
        {/* Header */}
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Users size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  Staff Management
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
                Menejerlar ro&apos;yxati
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Qidirish, tahrirlash va o&apos;chirish amallari shu yerda.
              </p>
            </div>

            {/* Search */}
            <div className="w-full sm:w-[380px]">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 py-3">
                <Search size={16} className="text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ism, email, role yoki status bo‘yicha qidirish..."
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Natija: <b className="text-foreground">{filtered.length}</b>
                </span>
                <span className="font-mono">
                  {isLoading ? "loading..." : "ready"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
          {/* Table header line */}
          <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <h2 className="text-sm font-black uppercase tracking-widest">
                Managers
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <UserCog size={14} />
              <span>Admin panel</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-border">
                <tr className="text-[11px] uppercase text-muted-foreground font-black tracking-widest">
                  <th className="p-4">Menejer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : filtered.length === 0 ? (
                  <tr className="border-t border-border">
                    <td className="p-8 text-center text-muted-foreground" colSpan={5}>
                      Hech narsa topilmadi.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item: Manager) => (
                    <tr
                      key={item._id}
                      className="border-t border-border hover:bg-muted/40 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl border border-border bg-background/60 flex items-center justify-center font-black">
                            {(item.first_name?.[0] || "M").toUpperCase()}
                            {(item.last_name?.[0] || "").toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold truncate">
                              {item.first_name} {item.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail size={12} />
                              <span className="truncate max-w-[260px]">
                                {item.email}
                              </span>
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
                        <Badge tone={roleBadgeTone(item.role)}>
                          {item.role || "manager"}
                        </Badge>
                      </td>

                      <td className="p-4">
                        <Badge tone={statusTone(item.status)}>
                          {item.status || "unknown"}
                        </Badge>
                      </td>

                      <td className="p-4 text-right relative">
                        <button
                          onClick={() =>
                            setActiveMenu(activeMenu === item._id ? null : item._id)
                          }
                          className="inline-flex items-center justify-center rounded-2xl border border-border bg-background/50 px-3 py-2 hover:bg-muted/60 transition"
                          aria-label="Menu"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        <AnimatePresence>
                          {activeMenu === item._id && (
                            <MenuButton
                              onClose={() => setActiveMenu(null)}
                              onEdit={() => handleEditClick(item)}
                              onDelete={() => handleDelete(item._id)}
                            />
                          )}
                        </AnimatePresence>
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
          {isEditModalOpen && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsEditModalOpen(false)}
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
                      Menejerni tahrirlash
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Faqat ism/familiya o&apos;zgartiriladi. Email bloklangan.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background/50 hover:bg-muted/60 transition"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleUpdateManager} className="p-5 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Ism
                      </label>
                      <input
                        required
                        value={editFormData.first_name}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, first_name: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                        placeholder="Ism"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Familiya
                      </label>
                      <input
                        required
                        value={editFormData.last_name}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, last_name: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                        placeholder="Familiya"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={editFormData.email}
                      className="w-full rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm outline-none opacity-60 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-bold hover:bg-muted/60 transition"
                    >
                      Bekor qilish
                    </button>

                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="flex-1 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {updateMutation.isPending && (
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

export default Menagers;