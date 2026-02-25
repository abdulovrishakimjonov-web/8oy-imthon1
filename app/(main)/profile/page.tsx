"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Camera, User, Loader2, Calendar, Shield, Mail, AtSign } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

const cx = (...c: Array<string | false | undefined | null>) =>
  c.filter(Boolean).join(" ");

const Field = ({
  label,
  icon,
  children,
  hint,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-muted-foreground flex items-center">{icon}</span>
        )}
        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          {label}
        </label>
      </div>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
};

const Card = ({
  title,
  desc,
  icon,
  children,
}: {
  title: string;
  desc?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55 shadow-sm overflow-hidden">
      <div className="flex items-start gap-3 p-5 sm:p-6 border-b border-border">
        <div className="h-11 w-11 rounded-2xl border border-border bg-background/40 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-black tracking-tight">
            {title}
          </h3>
          {desc && <p className="text-xs text-muted-foreground mt-1">{desc}</p>}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
};

const Profile = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    current_password: "",
    new_password: "",
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";
  const token = Cookies.get("token");

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      const savedUser = Cookies.get("user") || localStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.data ? parsed.data : parsed;
      }
      return null;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "manager",
      }));
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await axios.post(
        `${BASE_URL}/api/auth/edit-profile`,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.current_password && data.new_password) {
        await axios.post(
          `${BASE_URL}/api/auth/edit-password`,
          {
            current_password: data.current_password,
            new_password: data.new_password,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
    },
    onSuccess: () => {
      const updatedUser = { ...user, ...formData };
      Cookies.set("user", JSON.stringify(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      queryClient.setQueryData(["profile"], updatedUser);

      toast.success("Muvaffaqiyatli yangilandi");
      setFormData((prev) => ({
        ...prev,
        current_password: "",
        new_password: "",
      }));
    },
    onError: () => {
      toast.error("Yangilashda xatolik");
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append("image", file);

      const response = await axios.post(
        `${BASE_URL}/api/auth/edit-profile-img`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data?.image || response.data?.data?.image;
    },
    onSuccess: (newImagePath) => {
      const updatedUser = {
        ...user,
        image: newImagePath || user?.image,
      };

      Cookies.set("user", JSON.stringify(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      queryClient.setQueryData(["profile"], updatedUser);

      toast.success("Rasm muvaffaqiyatli yangilandi");
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Rasmni yuklashda xatolik");
    },
  });

  const getProfileImg = () => {
    if (!user?.image) return null;
    return user.image.startsWith("http") ? user.image : `${BASE_URL}/${user.image}`;
  };

  const initials = useMemo(() => {
    const a = (user?.first_name || "U")[0] || "U";
    const b = (user?.last_name || "S")[0] || "";
    return (a + b).toUpperCase();
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="relative w-full p-4 sm:p-6 min-h-screen text-foreground overflow-hidden">
      <Toaster position="top-center" />

      {/* accents */}
      <div className="pointer-events-none absolute -top-24 left-1/3 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="max-w-6xl mx-auto space-y-5">
        {/* Header */}
        <div className="relative rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-3xl border border-border bg-background/40 overflow-hidden shadow-sm">
                  {getProfileImg() ? (
                    <img
                      src={getProfileImg() as string}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-black text-2xl bg-primary/10">
                      {initials}
                    </div>
                  )}

                  {/* Upload overlay */}
                  <AnimatePresence>
                    {uploadImageMutation.isPending && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/70 flex items-center justify-center"
                      >
                        <Loader2 className="animate-spin text-primary" size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  disabled={uploadImageMutation.isPending}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 h-11 w-11 rounded-2xl border border-border bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition active:scale-95 disabled:opacity-50"
                  title="Rasmni o'zgartirish"
                >
                  <Camera size={18} />
                </button>

                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) uploadImageMutation.mutate(e.target.files[0]);
                  }}
                />
              </div>

              {/* Meta */}
              <div className="min-w-0">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight truncate">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-muted-foreground text-sm truncate mt-1">
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground text-xs mt-2">
                  <Calendar size={12} />
                  Qo&apos;shilgan: {user?.createdAt?.split("T")[0] || "2025-06-04"}
                </div>
              </div>
            </div>

            {/* Role badge */}
            <div className="inline-flex items-center justify-center self-start md:self-auto rounded-2xl border border-border bg-background/40 px-4 py-2">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                role
              </span>
              <span className="ml-3 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-primary">
                {user?.role || "manager"}
              </span>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left - profile details */}
          <div className="lg:col-span-2 space-y-5">
            <Card
              title="Profil ma'lumotlari"
              desc="Ism, familiya va emailni yangilang."
              icon={<User size={18} />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Ism" icon={<User size={14} />}>
                  <input
                    className="w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </Field>

                <Field label="Familiya" icon={<User size={14} />}>
                  <input
                    className="w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </Field>

                <Field label="Email" icon={<Mail size={14} />}>
                  <input
                    className="w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Field>

                <Field label="Rol" icon={<AtSign size={14} />} hint="Rolni faqat admin o'zgartiradi.">
                  <input
                    className="w-full rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm outline-none opacity-60 cursor-not-allowed"
                    value={formData.role}
                    disabled
                  />
                </Field>
              </div>
            </Card>

            <Card
              title="Xavfsizlik"
              desc="Parolni yangilash uchun joriy va yangi parolni kiriting."
              icon={<Shield size={18} />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Joriy parol">
                  <input
                    type="password"
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                    value={formData.current_password}
                    onChange={(e) =>
                      setFormData({ ...formData, current_password: e.target.value })
                    }
                  />
                </Field>

                <Field label="Yangi parol" hint="Ikki maydon ham to'ldirilsa parol yangilanadi.">
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-border bg-background/55 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                  />
                </Field>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, current_password: "", new_password: "" }))
                  }
                  className="sm:w-auto w-full rounded-2xl border border-border bg-background/45 px-5 py-3 text-sm font-black hover:bg-muted/50 transition"
                >
                  Tozalash
                </button>

                <button
                  type="button"
                  onClick={() => updateProfileMutation.mutate(formData)}
                  disabled={updateProfileMutation.isPending}
                  className={cx(
                    "sm:w-auto w-full rounded-2xl bg-primary text-primary-foreground px-7 py-3 text-sm font-black hover:opacity-90 transition shadow-sm",
                    "active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed",
                  )}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {updateProfileMutation.isPending && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    O&apos;zgartirish
                  </span>
                </button>
              </div>
            </Card>
          </div>

          {/* Right - small info card */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/55 shadow-sm p-5 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                Profil holati
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4">
                  <span className="text-xs text-muted-foreground">Rasm</span>
                  <span className="text-xs font-black">
                    {getProfileImg() ? "Bor" : "Yo‘q"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <span className="text-xs font-black truncate max-w-[160px]">
                    {user?.email || "---"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-border bg-background/40 p-4">
                  <span className="text-xs text-muted-foreground">Qo‘shilgan</span>
                  <span className="text-xs font-black">
                    {user?.createdAt?.split("T")[0] || "2025-06-04"}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Eslatma: Profil ma’lumoti cookie/localStorage’da saqlanmoqda.
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-primary/10 p-5 sm:p-6">
              <p className="text-sm font-black tracking-tight text-primary">
                Tip
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Agar rasm yuklanmayotgan bo‘lsa, backend’da static file serve (uploads)
                yoqilganini tekshiring.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;