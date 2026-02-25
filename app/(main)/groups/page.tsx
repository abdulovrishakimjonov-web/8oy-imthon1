"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Search,
  Plus,
  MoreHorizontal,
  X,
  Loader2,
  ChevronDown,
  Users,
  GraduationCap,
  Calendar,
  User,
  Layers,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface Group {
  _id: string;
  name: string;
  teacher?: {
    first_name: string;
    last_name: string;
  };
  students?: any[];
  started_group: string;
  end_group: string;
  status?: string;
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

const statusTone = (status?: string, end_group?: string) => {
  const s = (status || "").toLowerCase();
  if (s.includes("yakun") || s.includes("tugat")) return "blue";
  if (s.includes("to'xt") || s.includes("nofaol")) return "red";
  // end_group bo‘lmasa “Faol” deb turibdi sizda
  if (!end_group) return "green";
  return "neutral";
};

const formatDate = (d?: string) => {
  if (!d) return "---";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "---";
  return dt.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const SkeletonRow = () => (
  <tr className="border-t border-border/70">
    <td className="p-4">
      <div className="h-4 w-8 rounded-lg bg-muted animate-pulse mx-auto" />
    </td>
    <td className="p-4">
      <div className="h-4 w-40 rounded-lg bg-muted animate-pulse" />
    </td>
    <td className="p-4">
      <div className="h-4 w-48 rounded-lg bg-muted animate-pulse" />
    </td>
    <td className="p-4">
      <div className="h-7 w-14 rounded-full bg-muted animate-pulse mx-auto" />
    </td>
    <td className="p-4">
      <div className="h-4 w-24 rounded-lg bg-muted animate-pulse" />
    </td>
    <td className="p-4">
      <div className="h-4 w-24 rounded-lg bg-muted animate-pulse" />
    </td>
    <td className="p-4 text-right">
      <div className="ml-auto h-10 w-12 rounded-2xl bg-muted animate-pulse" />
    </td>
  </tr>
);

const Groups = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    teacher_id: "",
    course_id: "",
    start_date: "",
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";
  const token = Cookies.get("token");

  // 1) Groups list
  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ["groups", searchTerm, filterStatus],
    queryFn: async () => {
      let response;

      if (searchTerm.trim()) {
        response = await axios.get(`${BASE_URL}/api/group/search-teacher`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { name: searchTerm.trim() },
        });
      } else {
        const url = filterStatus
          ? `${BASE_URL}/api/group/get-all-group?status=${filterStatus}`
          : `${BASE_URL}/api/group/get-all-group`;

        response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      return response.data?.data || [];
    },
    enabled: !!token,
  });

  // 2) Teachers select (only when modal open)
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers-select"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/teacher/get-all-teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.data || [];
    },
    enabled: !!token && isAddModalOpen,
  });

  // 3) Courses select (only when modal open)
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses-select"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/course/get-all-courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.data || [];
    },
    enabled: !!token && isAddModalOpen,
  });

  // 4) Group detail
  const { data: selectedGroup, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["group-detail", selectedGroupId],
    queryFn: async () => {
      const res = await axios.get(
        `${BASE_URL}/api/group/one-group/${selectedGroupId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data?.data || res.data;
    },
    enabled: !!selectedGroupId && isDetailsOpen,
  });

  // 5) Add group
  const addGroupMutation = useMutation({
    mutationFn: (newGroup: typeof formData) =>
      axios.post(`${BASE_URL}/api/group/create-group`, newGroup, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setIsAddModalOpen(false);
      setFormData({ name: "", teacher_id: "", course_id: "", start_date: "" });
    },
    onError: () => alert("Guruh qo'shishda xatolik yuz berdi"),
  });

  const filtered = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    const arr = Array.isArray(groups) ? groups : [];
    if (!s) return arr;
    // search endpoint bo‘lsa ham, qo‘shimcha client filter (fallback)
    return arr.filter((g: Group) =>
      `${g.name} ${g.teacher?.first_name || ""} ${g.teacher?.last_name || ""}`
        .toLowerCase()
        .includes(s),
    );
  }, [groups, searchTerm]);

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    addGroupMutation.mutate(formData);
  };

  const handleViewGroup = (id: string) => {
    setSelectedGroupId(id);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedGroupId(null);
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
                <Layers size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  Groups
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
                Guruhlar
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Qidirish, filtr va guruh qo&apos;shish.
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
                  placeholder="Guruh yoki ustoz nomi..."
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

              {/* Filter */}
              <div className="relative w-full sm:w-[170px]">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-border bg-background/60 py-3 pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                >
                  <option value="">Barchasi</option>
                  <option value="faol">Faol</option>
                  <option value="yakunladi">Yakunladi</option>
                  <option value="to'xtatilgan">To&apos;xtatilgan</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  size={16}
                />
              </div>

              {/* Add */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm"
              >
                <Plus size={16} />
                Qo&apos;shish
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Users size={14} />
              Natija: <b className="text-foreground">{filtered.length}</b>
            </span>
            <span className="font-mono">
              {isGroupsLoading ? "loading..." : "ready"}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-border">
                <tr className="text-[11px] uppercase text-muted-foreground font-black tracking-widest">
                  <th className="p-4 w-16 text-center">No</th>
                  <th className="p-4">Guruh</th>
                  <th className="p-4">Ustoz</th>
                  <th className="p-4 text-center">O&apos;quvchilar</th>
                  <th className="p-4">Boshlanish</th>
                  <th className="p-4">Tugash</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {isGroupsLoading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : filtered.length === 0 ? (
                  <tr className="border-t border-border">
                    <td colSpan={7} className="p-12 text-center text-muted-foreground">
                      Hech qanday guruh topilmadi.
                    </td>
                  </tr>
                ) : (
                  filtered.map((group: Group, index: number) => {
                    const teacherName = group.teacher
                      ? `${group.teacher.first_name} ${group.teacher.last_name}`
                      : "Tayinlanmagan";

                    const studentsCount = group.students?.length || 0;

                    const tone = statusTone(group.status, group.end_group);

                    return (
                      <tr
                        key={group._id}
                        className="border-t border-border hover:bg-muted/40 transition-colors"
                      >
                        <td className="p-4 text-center text-muted-foreground font-mono">
                          {index + 1}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl border border-border bg-background/60 flex items-center justify-center">
                              <GraduationCap size={18} className="text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-black truncate max-w-[260px]">
                                {group.name}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono truncate max-w-[260px]">
                                {group._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="inline-flex items-center gap-2 text-muted-foreground">
                            <User size={14} />
                            <span className="font-medium text-foreground/90">
                              {teacherName}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-black">
                            {studentsCount}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="inline-flex items-center gap-2 text-muted-foreground">
                            <Calendar size={14} />
                            <span className="text-sm">{formatDate(group.started_group)}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          {group.end_group ? (
                            <div className="inline-flex items-center gap-2 text-muted-foreground">
                              <Calendar size={14} />
                              <span className="text-sm">{formatDate(group.end_group)}</span>
                            </div>
                          ) : (
                            <Badge tone="green">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Faol
                            </Badge>
                          )}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleViewGroup(group._id)}
                            className="inline-flex items-center justify-center rounded-2xl border border-border bg-background/50 px-3 py-2 hover:bg-muted/60 transition"
                            aria-label="More"
                            title="Tafsilot"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD MODAL */}
        <AnimatePresence>
          {isAddModalOpen && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-black/45"
                onClick={() => setIsAddModalOpen(false)}
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
                      Guruh qo&apos;shish
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Guruh nomi, ustoz, kurs va boshlanish sanasini kiriting.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background/50 hover:bg-muted/60 transition"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addGroupMutation.mutate(formData);
                  }}
                  className="p-5 sm:p-6 space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Guruh nomi
                      </label>
                      <input
                        required
                        placeholder="Frontend 01"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Ustoz
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.teacher_id}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              teacher_id: e.target.value,
                            })
                          }
                          className="w-full appearance-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                        >
                          <option value="">
                            {teachersLoading ? "Yuklanmoqda..." : "Ustozni tanlang"}
                          </option>
                          {teachers.map((t: any) => (
                            <option key={t._id} value={t._id}>
                              {t.first_name} {t.last_name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                          size={16}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Kurs
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={formData.course_id}
                          onChange={(e) =>
                            setFormData({ ...formData, course_id: e.target.value })
                          }
                          className="w-full appearance-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                        >
                          <option value="">
                            {coursesLoading ? "Yuklanmoqda..." : "Kursni tanlang"}
                          </option>
                          {courses.map((c: any) => (
                            <option key={c._id} value={c._id}>
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

                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                        Boshlanish sanasi
                      </label>
                      <input
                        required
                        type="date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData({ ...formData, start_date: e.target.value })
                        }
                        className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-bold hover:bg-muted/60 transition"
                    >
                      Bekor qilish
                    </button>

                    <button
                      type="submit"
                      disabled={addGroupMutation.isPending}
                      className="flex-1 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {addGroupMutation.isPending && (
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

        {/* DETAILS MODAL */}
        <AnimatePresence>
          {isDetailsOpen && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/45" onClick={closeDetails} />

              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="relative w-full max-w-2xl rounded-3xl border border-border bg-card/85 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
                  <div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight">
                      Guruh tafsilotlari
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Guruh ma&apos;lumotlari va holati.
                    </p>
                  </div>

                  <button
                    onClick={closeDetails}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background/50 hover:bg-muted/60 transition"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-5 sm:p-6">
                  {isDetailsLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <Loader2 className="animate-spin text-primary" size={36} />
                      <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
                    </div>
                  ) : selectedGroup ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Guruh
                          </p>
                          <h3 className="mt-1 text-xl sm:text-2xl font-black tracking-tight">
                            {selectedGroup.name}
                          </h3>
                        </div>

                        <Badge tone={statusTone(selectedGroup.status, selectedGroup.end_group)}>
                          <span
                            className={cx(
                              "h-2 w-2 rounded-full",
                              statusTone(selectedGroup.status, selectedGroup.end_group) === "green"
                                ? "bg-emerald-500"
                                : statusTone(selectedGroup.status, selectedGroup.end_group) === "blue"
                                  ? "bg-blue-500"
                                  : statusTone(selectedGroup.status, selectedGroup.end_group) === "red"
                                    ? "bg-rose-500"
                                    : "bg-zinc-400",
                            )}
                          />
                          {selectedGroup.status || (selectedGroup.end_group ? "—" : "Faol")}
                        </Badge>
                      </div>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-3xl border border-border bg-background/50 p-5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            O&apos;qituvchi
                          </p>
                          <p className="mt-2 text-sm font-bold">
                            {selectedGroup.teacher
                              ? `${selectedGroup.teacher.first_name} ${selectedGroup.teacher.last_name}`
                              : "Tayinlanmagan"}
                          </p>
                        </div>

                        <div className="rounded-3xl border border-border bg-background/50 p-5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Talabalar soni
                          </p>
                          <p className="mt-2 text-2xl font-black">
                            {selectedGroup.students?.length || 0}
                          </p>
                        </div>

                        <div className="rounded-3xl border border-border bg-background/50 p-5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Boshlanish
                          </p>
                          <p className="mt-2 text-sm font-bold">
                            {formatDate(selectedGroup.started_group)}
                          </p>
                        </div>

                        <div className="rounded-3xl border border-border bg-background/50 p-5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Tugash
                          </p>
                          <p className="mt-2 text-sm font-bold">
                            {selectedGroup.end_group ? formatDate(selectedGroup.end_group) : "—"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={closeDetails}
                        className="mt-6 w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-black hover:bg-muted/60 transition"
                      >
                        Yopish
                      </button>
                    </>
                  ) : (
                    <div className="py-10 text-center text-muted-foreground">
                      Ma&apos;lumot topilmadi.
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Groups;