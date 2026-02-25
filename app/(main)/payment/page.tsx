"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Search,
  Plus,
  Calendar,
  CreditCard,
  X,
  Filter,
  Loader2,
  BadgeDollarSign,
  Activity,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DebtorStudent {
  _id: string;
  student_name: string;
  student_surname: string;
  group_name: string;
  amount: number;
  month: string;
  payment_method?: string;
  date?: string;
}

const cx = (...c: Array<string | false | undefined | null>) =>
  c.filter(Boolean).join(" ");

const ModalShell = ({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
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
            className="absolute inset-0 bg-black/55"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-lg rounded-3xl border border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/55 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground">
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background/40 hover:bg-muted/50 transition"
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

const Payment = () => {
  const [debtors, setDebtors] = useState<DebtorStudent[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2025-05");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    student: "",
    group: "",
    amount: "",
    month: "2026-02",
    method: "Naqd",
    date: new Date().toISOString().split("T")[0],
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";
  const token = Cookies.get("token");

  const totalDebt = useMemo(() => {
    return (debtors || []).reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
  }, [debtors]);

  const fetchDebtors = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/payment/get-debtors-student`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { month: selectedMonth },
        },
      );
      const data = response.data;
      setDebtors(Array.isArray(data) ? data : data?.data || []);
    } catch (error: any) {
      console.error("Qarzdorlarni yuklashda xato:", error);
      setDebtors([]);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, selectedMonth, token]);

  const handleSearch = async (val: string) => {
    setSearchTerm(val);

    // 0 bo‘lsa: qayta default list
    if (val.length === 0) {
      fetchDebtors();
      return;
    }

    // 3 dan kichik bo‘lsa, API chaqirmaymiz
    if (val.length < 3) return;

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/payment/search-student`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { name: val },
      });
      const data = response.data;
      setDebtors(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Qidiruvda xato:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Yuborilayotgan ma'lumot:", formData);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchDebtors();
  }, [fetchDebtors]);

  return (
    <div className="relative w-full p-4 sm:p-6 min-h-screen text-foreground overflow-hidden">
      {/* accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />

      {/* Header Card */}
      <div className="relative rounded-3xl border border-border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Activity size={18} />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                Payments
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
              To&apos;lovlar
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Qarzdorlar monitoringi va oy bo‘yicha filtrlash.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            {/* Month */}
            <div className="relative w-full sm:w-[190px]">
              <Calendar
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background/60 py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
              />
            </div>

            {/* Add */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm"
            >
              <Plus size={16} />
              To&apos;lov qo&apos;shish
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <BadgeDollarSign size={14} />
            Jami qarzdorlik:{" "}
            <b className="text-foreground">{totalDebt.toLocaleString()} UZS</b>
          </span>

          <span className="font-mono">
            {loading ? "loading..." : "ready"} · {debtors.length} ta
          </span>
        </div>
      </div>

      {/* Search row */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            placeholder="Talaba ismi bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card/60 backdrop-blur py-3 pl-11 pr-11 text-sm outline-none focus:ring-2 focus:ring-ring transition"
          />
          {!!searchTerm && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-border bg-background/50 p-1.5 hover:bg-muted/60 transition"
              aria-label="Clear"
              title="Tozalash"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/60 backdrop-blur px-4 py-3 text-sm font-black text-muted-foreground hover:text-foreground hover:bg-muted/30 transition"
          title="Filter (keyin qo'shasiz)"
        >
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-3xl border border-border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/45 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead className="bg-background/30">
              <tr className="border-b border-border">
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Talaba
                </th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Guruh
                </th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Miqdor
                </th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Oy
                </th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Usul
                </th>
                <th className="p-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground text-right">
                  Amallar
                </th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10">
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <Loader2 className="animate-spin" size={18} />
                      Yuklanmoqda...
                    </div>
                  </td>
                </tr>
              ) : debtors.length > 0 ? (
                debtors.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl border border-border bg-background/40 flex items-center justify-center font-black uppercase text-[12px]">
                          {item.student_name?.[0]}
                          {item.student_surname?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate">
                            {item.student_name} {item.student_surname}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            ID: {item._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full border border-border bg-background/30 px-3 py-1 text-[11px] font-bold text-muted-foreground">
                        {item.group_name || "Guruhsiz"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-[11px] font-black text-rose-400">
                        {Number(item.amount || 0).toLocaleString()} UZS
                      </span>
                    </td>

                    <td className="p-4 text-muted-foreground font-mono text-[12px]">
                      {item.month}
                    </td>

                    <td className="p-4">
                      <div className="inline-flex items-center gap-2 text-muted-foreground">
                        <CreditCard size={14} />
                        <span className="text-[12px]">
                          {item.payment_method || "Noma'lum"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        className="inline-flex items-center justify-center rounded-2xl border border-border bg-background/40 h-10 w-10 hover:bg-muted/40 transition"
                        title="To'lov qo'shish (keyin action qo'shasiz)"
                      >
                        <Plus size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-muted-foreground italic text-sm"
                  >
                    Qarzdorlar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <ModalShell
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi to'lov qo'shish"
        subtitle="Hozircha faqat forma (API yuborishni keyin ulab beramiz)."
      >
        <form onSubmit={handleAddPayment} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Talaba
            </label>
            <input
              type="text"
              placeholder="Talaba ismi bilan qidiring..."
              className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
              value={formData.student}
              onChange={(e) =>
                setFormData({ ...formData, student: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Guruh
            </label>
            <input
              type="text"
              placeholder="Guruh nomi bilan qidiring..."
              className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
              value={formData.group}
              onChange={(e) =>
                setFormData({ ...formData, group: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                To&apos;lov miqdori
              </label>
              <input
                type="number"
                placeholder="Masalan: 500000"
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Oy
              </label>
              <input
                type="month"
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                value={formData.month}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                To&apos;lov usuli
              </label>
              <select
                className="w-full appearance-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                value={formData.method}
                onChange={(e) =>
                  setFormData({ ...formData, method: e.target.value })
                }
              >
                <option value="Naqd">Naqd</option>
                <option value="Karta">Karta</option>
                <option value="P2P">P2P</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Sana
              </label>
              <input
                type="date"
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition cursor-pointer"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm font-black hover:bg-muted/60 transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm font-black hover:opacity-90 transition shadow-sm"
            >
              Saqlash
            </button>
          </div>
        </form>
      </ModalShell>
    </div>
  );
};

export default Payment;