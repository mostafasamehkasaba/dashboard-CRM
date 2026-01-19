"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type Expense = {
  id: string;
  description: string;
  category: string;
  amount: number;
  wallet: string;
  date: string;
  reference: string;
};

const categoryOptions = ["كل الفئات", "صيانة", "رواتب", "مصاريف تشغيل", "مستلزمات"];
const walletOptions = ["الصندوق النقدي", "البنك الأهلي", "بنك الراجحي"];

const initialExpenses: Expense[] = [
  {
    id: "EXP-001",
    description: "فاتورة الكهرباء",
    category: "مصاريف تشغيل",
    amount: 1500,
    wallet: "الصندوق النقدي",
    date: "2026-01-15",
    reference: "ELEC-123",
  },
  {
    id: "EXP-002",
    description: "صيانة المعدات",
    category: "صيانة",
    amount: 3200,
    wallet: "البنك الأهلي",
    date: "2026-01-14",
    reference: "MAINT-456",
  },
  {
    id: "EXP-003",
    description: "رواتب الموظفين",
    category: "رواتب",
    amount: 45000,
    wallet: "بنك الراجحي",
    date: "2026-01-01",
    reference: "SAL-789",
  },
  {
    id: "EXP-004",
    description: "مستلزمات مكتبية",
    category: "مستلزمات",
    amount: 850,
    wallet: "الصندوق النقدي",
    date: "2026-01-13",
    reference: "STAT-321",
  },
];

const formatCurrency = (value: number) => `${value.toLocaleString("en-US")} ريال`;

const getMonthKey = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth()}`;
};

const buildNextId = (expenses: Expense[]) => {
  const max = expenses.reduce((acc, item) => {
    const numeric = Number.parseInt(item.id.replace("EXP-", ""), 10);
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric);
  }, 0);
  return `EXP-${String(max + 1).padStart(3, "0")}`;
};

const page = () => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(categoryOptions[0]);
  const [modalMode, setModalMode] = useState<"new" | "edit" | "view" | null>(null);
  const [activeExpense, setActiveExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    category: "مصاريف تشغيل",
    amount: "",
    wallet: walletOptions[0],
    date: "2026-01-16",
    reference: "",
  });

  const monthKey = useMemo(() => {
    if (expenses.length === 0) {
      return "";
    }
    const latest = expenses.reduce((acc, item) => (item.date > acc.date ? item : acc), expenses[0]);
    return getMonthKey(latest.date);
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return expenses.filter((expense) => {
      const matchesQuery = normalizedQuery
        ? [
            expense.id,
            expense.description,
            expense.category,
            expense.wallet,
            expense.reference,
            expense.date,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      const matchesCategory =
        categoryFilter === "كل الفئات" || expense.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [expenses, query, categoryFilter]);

  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const monthlyExpenses = expenses
    .filter((item) => getMonthKey(item.date) === monthKey)
    .reduce((sum, item) => sum + item.amount, 0);

  const openModal = (mode: "new" | "edit" | "view", expense?: Expense) => {
    setModalMode(mode);
    setActiveExpense(expense ?? null);
    if (mode === "edit" && expense) {
      setFormData({
        description: expense.description,
        category: expense.category,
        amount: String(expense.amount),
        wallet: expense.wallet,
        date: expense.date,
        reference: expense.reference === "-" ? "" : expense.reference,
      });
    }
    if (mode === "new") {
      setFormData({
        description: "",
        category: "مصاريف تشغيل",
        amount: "",
        wallet: walletOptions[0],
        date: "2026-01-16",
        reference: "",
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveExpense(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amountValue = Number.parseFloat(formData.amount);
    if (!formData.description.trim() || Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }
    if (modalMode === "edit" && activeExpense) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === activeExpense.id
            ? {
                ...item,
                description: formData.description.trim(),
                category: formData.category,
                amount: amountValue,
                wallet: formData.wallet,
                date: formData.date,
                reference: formData.reference.trim() || "-",
              }
            : item
        )
      );
      closeModal();
      return;
    }
    const newExpense: Expense = {
      id: buildNextId(expenses),
      description: formData.description.trim(),
      category: formData.category,
      amount: amountValue,
      wallet: formData.wallet,
      date: formData.date,
      reference: formData.reference.trim() || "-",
    };
    setExpenses((prev) => [newExpense, ...prev]);
    closeModal();
  };

  return (
    <DashboardShell
      title="المصروفات"
      subtitle="إدارة وتتبع المصروفات"
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="بحث باسم المصروف أو الوصف..."
      headerAction={
        <button
          type="button"
          onClick={() => openModal("new")}
          className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
        >
          مصروف جديد +
        </button>
      }
      exportData={{
        filename: "expenses",
        headers: ["رقم المصروف", "الوصف", "الفئة", "المبلغ", "المحفظة", "التاريخ", "المرجع"],
        rows: filteredExpenses.map((expense) => [
          expense.id,
          expense.description,
          expense.category,
          formatCurrency(expense.amount),
          expense.wallet,
          expense.date,
          expense.reference,
        ]),
      }}
    >
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 shadow-(--dash-shadow)">
            <div>
              <p className="text-sm text-(--dash-muted)">عدد المصروفات</p>
              <p className="mt-2 text-2xl font-semibold text-(--dash-text)">{expenses.length}</p>
            </div>
            <span className="rounded-2xl bg-(--dash-panel-glass) p-3 text-(--dash-primary)">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
                />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 shadow-(--dash-shadow)">
            <div>
              <p className="text-sm text-(--dash-muted)">مصروفات الشهر</p>
              <p className="mt-2 text-2xl font-semibold text-(--dash-text)">
                {formatCurrency(monthlyExpenses)}
              </p>
            </div>
            <span className="rounded-2xl bg-(--dash-panel-glass) p-3 text-(--dash-warning)">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M7 2h10a2 2 0 0 1 2 2v2H5V4a2 2 0 0 1 2-2Zm-2 8h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10Z"
                />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 shadow-(--dash-shadow)">
            <div>
              <p className="text-sm text-(--dash-muted)">إجمالي المصروفات</p>
              <p className="mt-2 text-2xl font-semibold text-(--dash-text)">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <span className="rounded-2xl bg-(--dash-panel-glass) p-3 text-(--dash-danger)">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 3 2 21h20L12 3Zm0 5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Z"
                />
              </svg>
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-muted)"
              >
                فلتر
              </button>
              <button
                type="button"
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-muted)"
              >
                تصدير
              </button>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-(--dash-muted)">يتم عرض {filteredExpenses.length} مصروف</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-(--dash-border)">
            <div className="grid min-w-[980px] grid-cols-8 gap-4 border-b border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3 text-xs font-semibold text-(--dash-muted)">
              <span className="text-right">رقم المصروف</span>
              <span className="text-right">الوصف</span>
              <span className="text-right">الفئة</span>
              <span className="text-right">المبلغ</span>
              <span className="text-right">المحفظة</span>
              <span className="text-right">التاريخ</span>
              <span className="text-right">المرجع</span>
              <span className="text-right">الإجراءات</span>
            </div>
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="grid min-w-[980px] grid-cols-8 gap-4 border-b border-(--dash-border) px-4 py-3 text-sm text-(--dash-text) last:border-b-0"
              >
                <span className="font-semibold">{expense.id}</span>
                <span>{expense.description}</span>
                <span className="rounded-lg border border-(--dash-border) bg-(--dash-panel-glass) px-2 py-1 text-xs text-(--dash-muted)">
                  {expense.category}
                </span>
                <span className="text-(--dash-danger)">{formatCurrency(expense.amount)}</span>
                <span>{expense.wallet}</span>
                <span>{expense.date}</span>
                <span className="text-(--dash-muted)">{expense.reference}</span>
                <div className="flex items-center gap-3 text-(--dash-muted)">
                  <button
                    type="button"
                    onClick={() => openModal("view", expense)}
                    className="text-xs text-(--dash-primary) hover:underline"
                  >
                    عرض
                  </button>
                  <button
                    type="button"
                    onClick={() => openModal("edit", expense)}
                    className="text-xs text-(--dash-primary) hover:underline"
                  >
                    تعديل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalMode ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {modalMode === "view"
                  ? "تفاصيل المصروف"
                  : modalMode === "edit"
                  ? "تعديل مصروف"
                  : "إضافة مصروف جديد"}
              </h3>
              <button type="button" onClick={closeModal} className="text-sm text-(--dash-muted)">
                إغلاق
              </button>
            </div>

            {modalMode === "view" && activeExpense ? (
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">رقم المصروف</span>
                  <span className="font-semibold">{activeExpense.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">الوصف</span>
                  <span>{activeExpense.description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">الفئة</span>
                  <span>{activeExpense.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">المبلغ</span>
                  <span className="text-(--dash-danger)">{formatCurrency(activeExpense.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">المحفظة</span>
                  <span>{activeExpense.wallet}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">التاريخ</span>
                  <span>{activeExpense.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">المرجع</span>
                  <span>{activeExpense.reference}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-(--dash-muted)">الوصف</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(event) => handleFormChange("description", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-(--dash-muted)">الفئة</label>
                    <select
                      value={formData.category}
                      onChange={(event) => handleFormChange("category", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    >
                      {categoryOptions.slice(1).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-(--dash-muted)">المبلغ</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={formData.amount}
                      onChange={(event) => handleFormChange("amount", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-(--dash-muted)">المحفظة</label>
                    <select
                      value={formData.wallet}
                      onChange={(event) => handleFormChange("wallet", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    >
                      {walletOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-(--dash-muted)">التاريخ</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(event) => handleFormChange("date", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-(--dash-muted)">المرجع</label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(event) => handleFormChange("reference", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
                  >
                    حفظ المصروف
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
};

export default page;
