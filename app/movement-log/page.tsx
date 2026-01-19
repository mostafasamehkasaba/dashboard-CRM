
"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type MovementRecord = {
  id: string;
  date: string;
  time: string;
  account: string;
  type: "إيداع" | "سحب";
  amount: number;
  beforeBalance: number;
  afterBalance: number;
  description: string;
  category: "مبيعات" | "مشتريات" | "مصروفات";
};

const accounts = ["الخزنة الرئيسية", "البنك الأهلي - حساب جاري", "خزنة الفرع الشمالي", "HSBC - حساب بالدولار"];
const categories = ["كل التصنيفات", "مبيعات", "مشتريات", "مصروفات"];
const types = ["كل الحركات", "إيداع", "سحب"];

const movements: MovementRecord[] = [
  {
    id: "MOV-001",
    date: "2026-01-16",
    time: "14:30",
    account: "الخزنة الرئيسية",
    type: "إيداع",
    amount: 50000,
    beforeBalance: 75450.75,
    afterBalance: 125450.75,
    description: "تحصيل من عميل - فاتورة INV-1234",
    category: "مبيعات",
  },
  {
    id: "MOV-002",
    date: "2026-01-16",
    time: "11:30",
    account: "البنك الأهلي - حساب جاري",
    type: "إيداع",
    amount: 50000,
    beforeBalance: 408920.5,
    afterBalance: 458920.5,
    description: "تحويل بنكي من عميل - فاتورة INV-2345",
    category: "مبيعات",
  },
  {
    id: "MOV-003",
    date: "2026-01-16",
    time: "10:00",
    account: "البنك الأهلي - حساب جاري",
    type: "سحب",
    amount: 25000,
    beforeBalance: 433920.5,
    afterBalance: 408920.5,
    description: "دفع مورد - فاتورة شراء PUR-456",
    category: "مشتريات",
  },
  {
    id: "MOV-004",
    date: "2026-01-16",
    time: "09:15",
    account: "الخزنة الرئيسية",
    type: "سحب",
    amount: 5000,
    beforeBalance: 80450.75,
    afterBalance: 75450.75,
    description: "دفع مصروف - فاتورة الكهرباء",
    category: "مصروفات",
  },
  {
    id: "MOV-005",
    date: "2026-01-15",
    time: "14:20",
    account: "خزنة الفرع الشمالي",
    type: "إيداع",
    amount: 8500,
    beforeBalance: 36700.5,
    afterBalance: 45200.5,
    description: "تحصيل نقدي من عميل",
    category: "مبيعات",
  },
];

const formatCurrency = (value: number, currency: string) =>
  `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;

const page = () => {
  const [query, setQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState("كل الحسابات");
  const [typeFilter, setTypeFilter] = useState(types[0]);
  const [categoryFilter, setCategoryFilter] = useState(categories[0]);
  const [showView, setShowView] = useState(false);
  const [activeMovement, setActiveMovement] = useState<MovementRecord | null>(null);

  const filteredMovements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return movements.filter((item) => {
      const matchesAccount = accountFilter === "كل الحسابات" || item.account === accountFilter;
      const matchesType = typeFilter === "كل الحركات" || item.type === typeFilter;
      const matchesCategory = categoryFilter === "كل التصنيفات" || item.category === categoryFilter;
      const matchesQuery = normalizedQuery
        ? [item.account, item.description, item.category, item.date]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      return matchesAccount && matchesType && matchesCategory && matchesQuery;
    });
  }, [query, accountFilter, typeFilter, categoryFilter]);

  const stats = useMemo(() => {
    const deposits = movements.filter((item) => item.type === "إيداع").reduce((sum, item) => sum + item.amount, 0);
    const withdrawals = movements.filter((item) => item.type === "سحب").reduce((sum, item) => sum + item.amount, 0);
    const net = deposits - withdrawals;
    return [
      { label: "إجمالي الحركات", value: movements.length.toString(), tone: "text-(--dash-primary)" },
      { label: "إجمالي الإيداعات", value: formatCurrency(deposits, "ر.س"), tone: "text-(--dash-success)" },
      { label: "إجمالي السحوبات", value: formatCurrency(withdrawals, "ر.س"), tone: "text-(--dash-danger)" },
      { label: "صافي التدفق النقدي", value: formatCurrency(net, "ر.س"), tone: "text-(--dash-primary)" },
    ];
  }, []);

  const openView = (movement: MovementRecord) => {
    setActiveMovement(movement);
    setShowView(true);
  };

  const closeView = () => {
    setActiveMovement(null);
    setShowView(false);
  };
  return (
    <DashboardShell
      title="سجل الحركات المالية"
      subtitle="سجل شامل لجميع الحركات المالية في الخزن والبنوك"
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="بحث في الحركات..."
      headerAction={
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
          >
            تصدير Excel
          </button>
          <button
            type="button"
            className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
          >
            كل الفترات
          </button>
        </div>
      }
    >
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 shadow-(--dash-shadow)"
            >
              <div>
                <p className="text-sm text-(--dash-muted)">{item.label}</p>
                <p className={`mt-2 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
              </div>
              <span className={`rounded-2xl bg-(--dash-panel-glass) p-3 ${item.tone}`}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M4 6h16a2 2 0 0 1 2 2v2H2V8a2 2 0 0 1 2-2Zm-2 8h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4Zm5 2h6a1 1 0 0 0 0-2H7a1 1 0 0 0 0 2Z"
                  />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
            >
              {types.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={accountFilter}
              onChange={(event) => setAccountFilter(event.target.value)}
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
            >
              <option value="كل الحسابات">كل الحسابات</option>
              {accounts.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="ms-auto text-xs text-(--dash-muted)">تفاصيل الحركات</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-(--dash-border)">
            <div className="grid min-w-[1040px] grid-cols-9 gap-4 border-b border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3 text-xs font-semibold text-(--dash-muted)">
              <span className="text-right">التاريخ والوقت</span>
              <span className="text-right">الحساب</span>
              <span className="text-right">النوع</span>
              <span className="text-right">المبلغ</span>
              <span className="text-right">الرصيد قبل</span>
              <span className="text-right">الرصيد بعد</span>
              <span className="text-right">الوصف</span>
              <span className="text-right">التصنيف</span>
              <span className="text-right">الإجراءات</span>
            </div>
            {filteredMovements.map((item) => (
              <div
                key={item.id}
                className="grid min-w-[1040px] grid-cols-9 gap-4 border-b border-(--dash-border) px-4 py-3 text-sm text-(--dash-text) last:border-b-0"
              >
                <span>
                  <span className="block">{item.date}</span>
                  <span className="text-xs text-(--dash-muted)">{item.time}</span>
                </span>
                <span>{item.account}</span>
                <span className="flex">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      item.type === "إيداع" ? "bg-(--dash-success) text-white" : "bg-(--dash-danger) text-white"
                    }`}
                  >
                    {item.type === "إيداع" ? (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path fill="currentColor" d="M12 4 5 11h4v9h6v-9h4l-7-7Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path fill="currentColor" d="M12 20 5 13h4V4h6v9h4l-7 7Z" />
                      </svg>
                    )}
                    {item.type}
                  </span>
                </span>
                <span className={item.type === "إيداع" ? "text-(--dash-success)" : "text-(--dash-danger)"}>
                  {formatCurrency(item.amount, "SAR")}
                </span>
                <span className="text-(--dash-muted)">{item.beforeBalance.toLocaleString("en-US")}</span>
                <span className="text-(--dash-muted)">{item.afterBalance.toLocaleString("en-US")}</span>
                <span>{item.description}</span>
                <span className="rounded-full bg-(--dash-panel-glass) px-3 py-1 text-xs text-(--dash-muted)">
                  {item.category}
                </span>
                <div className="flex items-center gap-3 text-(--dash-muted)">
                  <button type="button" onClick={() => openView(item)} className="text-xs text-(--dash-primary) hover:underline">
                    عرض
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {showView && activeMovement ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">عرض الحركة</h3>
                <p className="text-xs text-(--dash-muted)">رقم الحركة: {activeMovement.id}</p>
              </div>
              <button type="button" onClick={closeView} className="text-sm text-(--dash-muted)">
                إغلاق
              </button>
            </div>
            <div className="mt-6 space-y-3 text-sm text-(--dash-muted)">
              <div className="flex items-center justify-between">
                <span>الحساب</span>
                <span className="font-semibold text-(--dash-text)">{activeMovement.account}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>النوع</span>
                <span className="font-semibold text-(--dash-text)">{activeMovement.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>المبلغ</span>
                <span className="font-semibold text-(--dash-text)">{formatCurrency(activeMovement.amount, "SAR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>الرصيد قبل</span>
                <span className="font-semibold text-(--dash-text)">
                  {activeMovement.beforeBalance.toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>الرصيد بعد</span>
                <span className="font-semibold text-(--dash-text)">
                  {activeMovement.afterBalance.toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>الوصف</span>
                <span className="font-semibold text-(--dash-text)">{activeMovement.description}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>التصنيف</span>
                <span className="font-semibold text-(--dash-text)">{activeMovement.category}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
};

export default page;




