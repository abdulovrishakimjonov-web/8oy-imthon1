"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  Snowflake,
  Flame,
  Users,
  Clock,
  Search,
  Loader2,
  X,
  CheckCircle2,
  ChevronDown,
  Layers,
  BadgeDollarSign,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// --- Yordamchi funksiya ---
const safeStr = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return value?.name || value?.title || "";
};

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
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
        styles,
      )}
    >
      {children}
    </span>
  );
};

const ModalShell = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/45"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cx(
              "relative w-full rounded-3xl border border-border bg-card/85 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-2xl overflow-hidden",
              width,
            )}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {subtitle}
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background/50 hover:bg-muted/60 transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Courses() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFreeze, setFilterFreeze] = useState<string>("all");

  // --- MODAL STATES ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [editData, setEditData] = useState({ duration: "", price: "" });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [newCourse, setNewCourse] = useState({
    _id: "",
    name: "",
    description: "Yangi kurs",
    duration: "1 yil",
    price: "0",
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";
  const token = Cookies.get("token");

  // --- 1. GET COURSES (Query) ---
  const { data: courses = [], isLoading: loading } = useQuery({
    queryKey: ["courses", searchTerm, filterFreeze],
    queryFn: async () => {
      const queryParams: any = {
        ...(searchTerm && { search: searchTerm }),
        ...(filterFreeze !== "all" && { is_freeze: filterFreeze === "true" }),
      };

      const res = await axios.get(`${BASE_URL}/api/course/get-courses`, {
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams,
      });

      const rawData = Array.isArray(res.data?.data) ? res.data.data : [];
      return rawData.map((c: any) => ({
        ...c,
        _id: safeStr(c._id),
        name: safeStr(c.name),
        description: safeStr(c.description),
        duration: safeStr(c.duration),
        price: Number(c.price) || 0,
        students_count: Number(c.students_count) || 0,
        is_freeze: Boolean(c.is_freeze),
      }));
    },
    enabled: !!token,
  });

  // --- 2. CREATE CATEGORY (Mutation) ---
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      axios.post(
        `${BASE_URL}/api/course/create-category`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    onSuccess: (res) => {
      const createdId = res.data?.data?._id || res.data?._id;
      setNewCourse((prev) => ({ ...prev, _id: createdId }));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setAddStep(2);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Bunday nomli kategoriya mavjud!");
    },
  });

  // --- 3. SAVE / EDIT COURSE (Mutation) ---
  const saveCourseMutation = useMutation({
    mutationFn: (payload: any) =>
      axios.post(`${BASE_URL}/api/course/edit-course`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedCourse(null);
    },
    onError: () => alert("Xatolik yuz berdi!"),
  });

  // --- 4. TOGGLE FREEZE (Mutation) ---
  const toggleFreezeMutation = useMutation({
    mutationFn: (course: any) => {
      const endpoint = course.is_freeze ? "unfreeze-course" : "freeze-course";
      return axios.put(
        `${BASE_URL}/api/course/${endpoint}`,
        { course_id: course._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
  });

  // --- 5. DELETE COURSE (Mutation) ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`${BASE_URL}/api/course/delete-course`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { course_id: id },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["courses"] }),
    onError: () => alert("O'chirishda xatolik!"),
  });

  // --- HANDLERS ---
  const handleNextStep = () => {
    if (newCourse.name.trim()) createCategoryMutation.mutate(newCourse.name);
  };

  const handleCreateFinal = () => {
    saveCourseMutation.mutate({
      course_id: newCourse._id,
      name: newCourse.name,
      duration: newCourse.duration,
      price: Number(newCourse.price),
      description: newCourse.description,
    });
  };

  const handleUpdate = () => {
    if (!selectedCourse?._id) {
      alert("Kurs ma'lumotlari yuklanmadi!");
      return;
    }
    saveCourseMutation.mutate({
      course_id: selectedCourse._id,
      duration: editData.duration,
      price: Number(editData.price),
    });
  };

  const openEditModal = (course: any) => {
    setSelectedCourse(course);
    setEditData({ duration: course.duration, price: String(course.price) });
    setIsEditModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setNewCourse({
      _id: "",
      name: "",
      description: "Yangi kurs",
      duration: "1 yil",
      price: "0",
    });
    setAddStep(1);
    setIsAddModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full p-4 sm:p-6 lg:p-8 text-foreground overflow-hidden">
      {/* accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[220] rounded-2xl border border-border bg-card/85 backdrop-blur px-5 py-3 shadow-xl flex items-center gap-3"
          >
            <CheckCircle2 className="text-emerald-500" size={18} />
            <span className="text-sm font-bold">
              Kategoriya muvaffaqiyatli qo&apos;shildi
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-6xl space-y-5">
        {/* Header Card */}
        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Layers size={18} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                  Courses
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
                Kurslar
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Qidirish, muzlatilganlarni filtrlash va kurslarni boshqarish.
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
                  placeholder="Kurs qidirish..."
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

              {/* Freeze filter */}
              <div className="relative w-full sm:w-[180px]">
                <select
                  value={filterFreeze}
                  onChange={(e) => setFilterFreeze(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-border bg-background/60 py-3 pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                >
                  <option value="all">Barchasi</option>
                  <option value="false">Faol</option>
                  <option value="true">Muzlatilgan</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  size={16}
                />
              </div>

              {/* Add */}
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm"
              >
                <Plus size={16} />
                Kurs qo&apos;shish
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Users size={14} />
              Natija: <b className="text-foreground">{courses.length}</b>
            </span>
            <span className="font-mono">{loading ? "loading..." : "ready"}</span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-muted-foreground" size={36} />
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/70 p-10 text-center text-muted-foreground">
            Kurs topilmadi.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {courses.map((course: any) => {
              const freezeTone = course.is_freeze ? "blue" : "green";
              const isFreezePending =
                toggleFreezeMutation.isPending &&
                toggleFreezeMutation.variables?._id === course._id;

              const isDeletePending =
                deleteMutation.isPending && deleteMutation.variables === course._id;

              return (
                <div
                  key={course._id}
                  className={cx(
                    "relative rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-5 shadow-sm transition-all",
                    "hover:shadow-md hover:border-primary/25",
                  )}
                >
                  {/* top badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Kurs
                      </p>
                      <h3 className="mt-1 text-lg font-black tracking-tight truncate">
                        {course.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {course.description || "—"}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge tone="amber">
                        <BadgeDollarSign size={14} />
                        {Number(course.price).toLocaleString()} UZS
                      </Badge>

                      <Badge tone={freezeTone}>
                        {course.is_freeze ? (
                          <>
                            <Snowflake size={14} />
                            Muzlatilgan
                          </>
                        ) : (
                          <>
                            <Flame size={14} />
                            Faol
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border bg-background/50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Davomiylik
                      </p>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm font-bold">
                        <Clock size={16} className="text-primary" />
                        <span>{course.duration || "—"}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-background/50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        O&apos;quvchilar
                      </p>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm font-bold">
                        <Users size={16} className="text-primary" />
                        <span>{course.students_count || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-black hover:bg-muted/60 transition"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("O'chirmoqchimisiz?"))
                          deleteMutation.mutate(course._id);
                      }}
                      disabled={isDeletePending}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 text-white px-4 py-3 text-sm font-black hover:opacity-90 transition disabled:opacity-60"
                    >
                      {isDeletePending ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      O&apos;chirish
                    </button>

                    <button
                      onClick={() => toggleFreezeMutation.mutate(course)}
                      disabled={isFreezePending}
                      className={cx(
                        "col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition disabled:opacity-60",
                        course.is_freeze
                          ? "border border-border bg-background/50 hover:bg-muted/60"
                          : "bg-orange-600 text-white hover:bg-orange-700",
                      )}
                    >
                      {isFreezePending ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : course.is_freeze ? (
                        <>
                          <Flame size={16} />
                          Eritish
                        </>
                      ) : (
                        <>
                          <Snowflake size={16} />
                          Muzlatish
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD MODAL (2 steps) */}
      <ModalShell
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={addStep === 1 ? "Yangi kurs qo'shish" : "Kurs tafsilotlari"}
        subtitle={
          addStep === 1
            ? "Avval kategoriya (kurs nomi) yaratiladi."
            : "Duration, price va description kiriting."
        }
        width="max-w-xl"
      >
        {addStep === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Kurs nomi
              </label>
              <input
                autoFocus
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                placeholder="Frontend Dasturlash"
              />
              <p className="text-[11px] text-muted-foreground">
                Nom majburiy (unikal bo‘lishi kerak).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-black hover:bg-muted/60 transition"
              >
                Bekor qilish
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={createCategoryMutation.isPending || !newCourse.name.trim()}
                className="flex-1 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {createCategoryMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <Plus size={16} />
                    Yaratish
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-background/50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Kurs nomi
              </p>
              <p className="mt-1 text-sm font-black">{newCourse.name}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Description
              </label>
              <textarea
                rows={3}
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Duration
                </label>
                <input
                  value={newCourse.duration}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, duration: e.target.value })
                  }
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Price (UZS)
                </label>
                <input
                  type="number"
                  value={newCourse.price}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, price: e.target.value })
                  }
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-black hover:bg-muted/60 transition"
              >
                Bekor qilish
              </button>

              <button
                type="button"
                onClick={handleCreateFinal}
                disabled={saveCourseMutation.isPending}
                className="flex-1 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saveCourseMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Saqlash"
                )}
              </button>
            </div>
          </div>
        )}
      </ModalShell>

      {/* EDIT MODAL */}
      <ModalShell
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCourse(null);
        }}
        title="Kursni tahrirlash"
        subtitle={selectedCourse ? `Kurs: ${selectedCourse.name}` : undefined}
        width="max-w-lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Davomiylik
              </label>
              <input
                value={editData.duration}
                onChange={(e) =>
                  setEditData({ ...editData, duration: e.target.value })
                }
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Narx (UZS)
              </label>
              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCourse(null);
              }}
              className="flex-1 rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-black hover:bg-muted/60 transition"
            >
              Bekor qilish
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={saveCourseMutation.isPending || !selectedCourse}
              className="flex-1 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saveCourseMutation.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Saqlash"
              )}
            </button>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}