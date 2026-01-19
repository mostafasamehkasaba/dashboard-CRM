"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type InvoiceStatus = "مدفوعة" | "قيد الانتظار" | "متأخرة" | "مدفوعة جزئيا";

type Invoice = {
  id: string;
  client: string;
  amount: number;
  paid: number;
  due: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
};

const initialInvoices: Invoice[] = [
  {
    id: "INV-001",
    client: "شركة النور للتجارة",
    amount: 15000,
    paid: 15000,
    due: 0,
    status: "مدفوعة",
    date: "2026-01-15",
    dueDate: "2026-01-30",
  },
  {
    id: "INV-002",
    client: "مؤسسة الأمل",
    amount: 8500,
    paid: 0,
    due: 8500,
    status: "قيد الانتظار",
    date: "2026-01-14",
    dueDate: "2026-01-29",
  },
  {
    id: "INV-003",
    client: "شركة المستقبل",
    amount: 12000,
    paid: 12000,
    due: 0,
    status: "مدفوعة",
    date: "2026-01-14",
    dueDate: "2026-01-28",
  },
  {
    id: "INV-004",
    client: "مؤسسة التقدم",
    amount: 6700,
    paid: 0,
    due: 6700,
    status: "متأخرة",
    date: "2026-01-10",
    dueDate: "2026-01-14",
  },
  {
    id: "INV-005",
    client: "شركة الإبداع",
    amount: 9200,
    paid: 5000,
    due: 4200,
    status: "مدفوعة جزئيا",
    date: "2026-01-13",
    dueDate: "2026-01-27",
  },
];

const statusStyles: Record<InvoiceStatus, string> = {
  مدفوعة: "bg-(--dash-primary) text-white",
  "قيد الانتظار": "bg-(--dash-warning-soft) text-(--dash-warning)",
  متأخرة: "bg-(--dash-danger) text-white",
  "مدفوعة جزئيا": "border border-(--dash-border) bg-(--dash-panel-soft) text-(--dash-text)",
};

const formatCurrency = (value: number) => `${value.toLocaleString()} ريال`;

const page = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    client: "",
    amount: "",
    paid: "",
    due: "",
    status: "قيد الانتظار",
    date: "",
    dueDate: "",
  });

  useEffect(() => {
    const stored = window.localStorage.getItem("invoices-data");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setInvoices(parsed);
        }
      } catch {
        // Ignore invalid stored data.
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("invoices-data", JSON.stringify(invoices));
  }, [invoices]);

  const summaryCards = useMemo(() => {
    const totalAmount = invoices.reduce((sum, item) => sum + item.amount, 0);
    const totalPaid = invoices.reduce((sum, item) => sum + item.paid, 0);
    const totalPending = invoices
      .filter((item) => item.status === "قيد الانتظار")
      .reduce((sum, item) => sum + item.amount, 0);
    const totalOverdue = invoices
      .filter((item) => item.status === "متأخرة")
      .reduce((sum, item) => sum + item.amount, 0);

    return [
      { label: "إجمالي الفواتير", value: formatCurrency(totalAmount), tone: "text-(--dash-text)" },
      { label: "المدفوعة", value: formatCurrency(totalPaid), tone: "text-(--dash-success)" },
      { label: "قيد الانتظار", value: formatCurrency(totalPending), tone: "text-(--dash-warning)" },
      { label: "المتأخرة", value: formatCurrency(totalOverdue), tone: "text-(--dash-danger)" },
    ];
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return invoices.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      if (!matchesStatus) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [item.id, item.client, item.status, item.date, item.dueDate]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [invoices, query, statusFilter]);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddInvoice = () => {
    const client = form.client.trim();
    const amount = Number.parseFloat(form.amount);
    if (!client || Number.isNaN(amount)) {
      return;
    }
    const paid = Number.parseFloat(form.paid) || 0;
    const due = Number.parseFloat(form.due) || Math.max(amount - paid, 0);
    const nextInvoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      client,
      amount,
      paid,
      due,
      status: form.status as InvoiceStatus,
      date: form.date || new Date().toISOString().slice(0, 10),
      dueDate: form.dueDate || new Date().toISOString().slice(0, 10),
    };
    setInvoices((prev) => [nextInvoice, ...prev]);
    setForm({
      client: "",
      amount: "",
      paid: "",
      due: "",
      status: "قيد الانتظار",
      date: "",
      dueDate: "",
    });
    setShowForm(false);
  };

  return (
    <DashboardShell
      title="الفواتير"
      subtitle="إدارة فواتير المبيعات"
      exportData={{
        filename: "invoices",
        headers: ["رقم الفاتورة", "العميل", "الإجمالي", "المدفوع", "المستحق", "الحالة", "التاريخ", "تاريخ الاستحقاق"],
        rows: invoices.map((item) => [
          item.id,
          item.client,
          item.amount,
          item.paid,
          item.due,
          item.status,
          item.date,
          item.dueDate,
        ]),
      }}

      headerAction={
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-(--dash-primary) px-4 py-2 text-sm font-semibold text-white shadow-(--dash-primary-soft)"
          onClick={() => setShowForm((prev) => !prev)}
        >
          <span className="text-lg">+</span>
          فاتورة جديدة
        </button>
      }
    >
      {showForm ? (
        <section className="mb-6 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <h2 className="text-lg font-semibold">إنشاء فاتورة جديدة</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">اسم العميل</span>
              <input
                type="text"
                value={form.client}
                onChange={(event) => handleFormChange("client", event.target.value)}
                placeholder="اسم العميل"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المبلغ</span>
              <input
                type="number"
                value={form.amount}
                onChange={(event) => handleFormChange("amount", event.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المدفوع</span>
              <input
                type="number"
                value={form.paid}
                onChange={(event) => handleFormChange("paid", event.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المستحق</span>
              <input
                type="number"
                value={form.due}
                onChange={(event) => handleFormChange("due", event.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">الحالة</span>
              <select
                value={form.status}
                onChange={(event) => handleFormChange("status", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              >
                <option value="مدفوعة">مدفوعة</option>
                <option value="قيد الانتظار">قيد الانتظار</option>
                <option value="متأخرة">متأخرة</option>
                <option value="مدفوعة جزئيا">مدفوعة جزئيا</option>
              </select>
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">تاريخ الفاتورة</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => handleFormChange("date", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">تاريخ الاستحقاق</span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => handleFormChange("dueDate", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text)"
              onClick={() => setShowForm(false)}
            >
              إلغاء
            </button>
            <button
              type="button"
              className="rounded-xl bg-(--dash-primary) px-4 py-2 text-sm font-semibold text-white shadow-(--dash-primary-soft)"
              onClick={handleAddInvoice}
            >
              حفظ الفاتورة
            </button>
          </div>
        </section>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-5 shadow-(--dash-shadow)"
          >
            <p className="text-sm text-(--dash-muted)">{card.label}</p>
            <p className={`mt-3 text-xl font-semibold ${card.tone}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-4 shadow-(--dash-shadow)">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm text-(--dash-text)"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3a1 1 0 0 1 1 1v8.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1Z"
              />
            </svg>
            تصدير
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm text-(--dash-text)"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-6.8 9.06V20a1 1 0 0 1-1.45.9l-3-1.5a1 1 0 0 1-.55-.9v-4.84L3.2 5.6A1 1 0 0 1 3 5Z"
              />
            </svg>
            فلاتر
          </button>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="appearance-none rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text) focus:outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="مدفوعة">مدفوعة</option>
              <option value="قيد الانتظار">قيد الانتظار</option>
              <option value="متأخرة">متأخرة</option>
              <option value="مدفوعة جزئيا">مدفوعة جزئيا</option>
            </select>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--dash-muted-2)">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M7 10l5 5 5-5H7Z" />
              </svg>
            </span>
          </div>
          <div className="flex min-w-55 flex-1 items-center gap-2 rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm text-(--dash-text)">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-(--dash-muted-2)" aria-hidden="true">
              <path
                fill="currentColor"
                d="M10 2a8 8 0 1 0 5.29 14l4.7 4.7a1 1 0 0 0 1.42-1.4l-4.7-4.7A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="بحث برقم الفاتورة أو اسم العميل..."
              className="w-full bg-transparent text-sm text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-(--dash-border) bg-(--dash-panel) shadow-(--dash-shadow)">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-(--dash-panel-soft) text-(--dash-muted)">
              <tr>
                <th className="px-4 py-3 text-right font-semibold">رقم الفاتورة</th>
                <th className="px-4 py-3 text-right font-semibold">العميل</th>
                <th className="px-4 py-3 text-right font-semibold">المبلغ</th>
                <th className="px-4 py-3 text-right font-semibold">المدفوع</th>
                <th className="px-4 py-3 text-right font-semibold">المتبقي</th>
                <th className="px-4 py-3 text-right font-semibold">الحالة</th>
                <th className="px-4 py-3 text-right font-semibold">التاريخ</th>
                <th className="px-4 py-3 text-right font-semibold">الاستحقاق</th>
                <th className="px-4 py-3 text-right font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((row) => (
                <tr key={row.id} className="border-t border-(--dash-border) text-(--dash-text)">
                  <td className="px-4 py-3 font-semibold">{row.id}</td>
                  <td className="px-4 py-3">{row.client}</td>
                  <td className="px-4 py-3">{formatCurrency(row.amount)}</td>
                  <td className={`px-4 py-3 ${row.paid === 0 ? "text-(--dash-muted)" : "text-(--dash-success)"}`}>
                    {formatCurrency(row.paid)}
                  </td>
                  <td className={`px-4 py-3 ${row.due === 0 ? "text-(--dash-muted)" : "text-(--dash-warning)"}`}>
                    {formatCurrency(row.due)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.dueDate}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="rounded-lg border border-(--dash-border) px-3 py-1 text-xs text-(--dash-text) hover:bg-(--dash-panel-soft)"
                    >
                      إجراءات
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
};

export default page;
