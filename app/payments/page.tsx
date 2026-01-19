"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type Payment = {
  id: string;
  invoice: string;
  client: string;
  amount: number;
  method: string;
  wallet: string;
  status: "مكتملة" | "قيد المعالجة";
  date: string;
  reference: string;
};

const initialPayments: Payment[] = [
  {
    id: "PAY-001",
    invoice: "INV-001",
    client: "شركة النور للتجارة",
    amount: 15000,
    method: "تحويل بنكي",
    wallet: "البنك الأهلي",
    status: "مكتملة",
    date: "2026-01-15",
    reference: "TRX-123456",
  },
  {
    id: "PAY-002",
    invoice: "INV-005",
    client: "شركة الإبداع",
    amount: 5000,
    method: "نقدا",
    wallet: "الصندوق النقدي",
    status: "مكتملة",
    date: "2026-01-15",
    reference: "CASH-789",
  },
  {
    id: "PAY-003",
    invoice: "INV-002",
    client: "مؤسسة الأمل",
    amount: 8500,
    method: "شيك",
    wallet: "بنك الراجحي",
    status: "قيد المعالجة",
    date: "2026-01-14",
    reference: "CHK-456789",
  },
  {
    id: "PAY-004",
    invoice: "INV-003",
    client: "شركة المستقبل",
    amount: 12000,
    method: "بطاقة ائتمان",
    wallet: "نقاط البيع",
    status: "مكتملة",
    date: "2026-01-14",
    reference: "CC-987654",
  },
];

const statusStyles: Record<Payment["status"], string> = {
  مكتملة: "bg-(--dash-primary) text-white",
  "قيد المعالجة": "bg-(--dash-panel-glass) text-(--dash-muted)",
};

const formatCurrency = (value: number) => `${value.toLocaleString()} ريال`;

const page = () => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [notice, setNotice] = useState<{ message: string; paymentId: string } | null>(null);
  const [form, setForm] = useState({
    invoice: "",
    client: "",
    amount: "",
    method: "تحويل بنكي",
    wallet: "",
    status: "مكتملة",
    date: "",
    reference: "",
  });

  useEffect(() => {
    const stored = window.localStorage.getItem("payments-data");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPayments(parsed);
        }
      } catch {
        // Ignore invalid stored data.
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("payments-data", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = window.setTimeout(() => setNotice(null), 2500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const summaryCards = useMemo(() => {
    const totalCount = payments.length;
    const totalAmount = payments.reduce((sum, item) => sum + item.amount, 0);
    const completedAmount = payments
      .filter((item) => item.status === "مكتملة")
      .reduce((sum, item) => sum + item.amount, 0);
    const processingAmount = payments
      .filter((item) => item.status === "قيد المعالجة")
      .reduce((sum, item) => sum + item.amount, 0);
    return [
      { label: "إجمالي الدفعات", value: `${totalCount}`, tone: "text-(--dash-text)" },
      { label: "المبلغ الإجمالي", value: formatCurrency(totalAmount), tone: "text-(--dash-text)" },
      { label: "المدفوعات المكتملة", value: formatCurrency(completedAmount), tone: "text-(--dash-success)" },
      { label: "قيد المعالجة", value: formatCurrency(processingAmount), tone: "text-(--dash-warning)" },
    ];
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return payments.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      if (!matchesStatus) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [
        item.id,
        item.invoice,
        item.client,
        item.method,
        item.wallet,
        item.status,
        item.reference,
        item.date,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [payments, query, statusFilter]);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPayment = () => {
    const client = form.client.trim();
    const amount = Number.parseFloat(form.amount);
    if (!client || Number.isNaN(amount)) {
      return;
    }
    const nextPayment: Payment = {
      id: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
      invoice: form.invoice.trim() || "INV-000",
      client,
      amount,
      method: form.method,
      wallet: form.wallet.trim() || "المحفظة الرئيسية",
      status: form.status as Payment["status"],
      date: form.date || new Date().toISOString().slice(0, 10),
      reference: form.reference.trim() || "REF-000",
    };
    setPayments((prev) => [nextPayment, ...prev]);
    setForm({
      invoice: "",
      client: "",
      amount: "",
      method: "تحويل بنكي",
      wallet: "",
      status: "مكتملة",
      date: "",
      reference: "",
    });
    setShowForm(false);
  };

  const handleViewPayment = (paymentId: string) => {
    const target = payments.find((item) => item.id === paymentId) ?? null;
    setSelectedPayment(target);
  };

  const handleNotifyPayment = (payment: Payment) => {
    setNotice({
      paymentId: payment.id,
      message: `تم إرسال إشعار دفعة ${payment.id} إلى ${payment.client}.`,
    });
  };

  return (
    <DashboardShell
      title="الدفعات"
      subtitle="إدارة المدفوعات المستلمة"
      exportData={{
        filename: "payments",
        headers: ["رقم الدفعة", "رقم الفاتورة", "العميل", "المبلغ", "طريقة الدفع", "المحفظة", "الحالة", "التاريخ", "المرجع"],
        rows: payments.map((item) => [
          item.id,
          item.invoice,
          item.client,
          item.amount,
          item.method,
          item.wallet,
          item.status,
          item.date,
          item.reference,
        ]),
      }}

      headerAction={
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-(--dash-primary) px-4 py-2 text-sm font-semibold text-white shadow-(--dash-primary-soft)"
          onClick={() => setShowForm((prev) => !prev)}
        >
          <span className="text-lg">+</span>
          دفعة جديدة
        </button>
      }
    >
      {notice ? (
        <div className="mb-6 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3 text-sm text-(--dash-text)">
          <div className="flex items-center justify-between gap-3">
            <span>{notice.message}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="rounded-lg border border-(--dash-border) px-3 py-1 text-xs text-(--dash-text)"
            >
              إغلاق
            </button>
          </div>
        </div>
      ) : null}

      {showForm ? (
        <section className="mb-6 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <h2 className="text-lg font-semibold">إضافة دفعة جديدة</h2>
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
              <span className="mb-2 block font-semibold text-(--dash-text)">رقم الفاتورة</span>
              <input
                type="text"
                value={form.invoice}
                onChange={(event) => handleFormChange("invoice", event.target.value)}
                placeholder="INV-000"
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
              <span className="mb-2 block font-semibold text-(--dash-text)">طريقة الدفع</span>
              <select
                value={form.method}
                onChange={(event) => handleFormChange("method", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              >
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="نقدا">نقدا</option>
                <option value="شيك">شيك</option>
                <option value="بطاقة ائتمان">بطاقة ائتمان</option>
              </select>
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المحفظة</span>
              <input
                type="text"
                value={form.wallet}
                onChange={(event) => handleFormChange("wallet", event.target.value)}
                placeholder="المحفظة الرئيسية"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">الحالة</span>
              <select
                value={form.status}
                onChange={(event) => handleFormChange("status", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              >
                <option value="مكتملة">مكتملة</option>
                <option value="قيد المعالجة">قيد المعالجة</option>
              </select>
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">التاريخ</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => handleFormChange("date", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المرجع</span>
              <input
                type="text"
                value={form.reference}
                onChange={(event) => handleFormChange("reference", event.target.value)}
                placeholder="REF-000"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
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
              onClick={handleAddPayment}
            >
              حفظ الدفعة
            </button>
          </div>
        </section>
      ) : null}

      {selectedPayment ? (
        <section className="mb-6 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">تفاصيل الدفعة {selectedPayment.id}</h2>
              <p className="mt-1 text-xs text-(--dash-muted)">
                العميل: {selectedPayment.client} - الفاتورة {selectedPayment.invoice}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPayment(null)}
              className="rounded-xl border border-(--dash-border) px-4 py-2 text-sm text-(--dash-text)"
            >
              إغلاق
            </button>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 text-sm text-(--dash-muted)">
              <p className="font-semibold text-(--dash-text)">بيانات الدفع</p>
              <div className="mt-3 space-y-2">
                <p>المبلغ: {formatCurrency(selectedPayment.amount)}</p>
                <p>الحالة: {selectedPayment.status}</p>
                <p>التاريخ: {selectedPayment.date}</p>
                <p>المرجع: {selectedPayment.reference}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 text-sm text-(--dash-muted)">
              <p className="font-semibold text-(--dash-text)">وسائل الدفع</p>
              <div className="mt-3 space-y-2">
                <p>طريقة الدفع: {selectedPayment.method}</p>
                <p>المحفظة: {selectedPayment.wallet}</p>
                <p>رقم الفاتورة: {selectedPayment.invoice}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
              <option value="مكتملة">مكتملة</option>
              <option value="قيد المعالجة">قيد المعالجة</option>
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
              placeholder="بحث برقم الدفعة، العميل، أو المرجع..."
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
                <th className="px-4 py-3 text-right font-semibold">رقم الدفعة</th>
                <th className="px-4 py-3 text-right font-semibold">الفاتورة</th>
                <th className="px-4 py-3 text-right font-semibold">العميل</th>
                <th className="px-4 py-3 text-right font-semibold">المبلغ</th>
                <th className="px-4 py-3 text-right font-semibold">طريقة الدفع</th>
                <th className="px-4 py-3 text-right font-semibold">المحفظة</th>
                <th className="px-4 py-3 text-right font-semibold">الحالة</th>
                <th className="px-4 py-3 text-right font-semibold">التاريخ</th>
                <th className="px-4 py-3 text-right font-semibold">المرجع</th>
                <th className="px-4 py-3 text-right font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((row) => (
                <tr key={row.id} className="border-t border-(--dash-border) text-(--dash-text)">
                  <td className="px-4 py-3 font-semibold">{row.id}</td>
                  <td className="px-4 py-3">{row.invoice}</td>
                  <td className="px-4 py-3">{row.client}</td>
                  <td className="px-4 py-3">{formatCurrency(row.amount)}</td>
                  <td className="px-4 py-3">{row.method}</td>
                  <td className="px-4 py-3 text-(--dash-muted)">{row.wallet}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[row.status]
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3 text-(--dash-muted)">{row.reference}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        className="rounded-lg border border-(--dash-border) px-3 py-1 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                        onClick={() => handleViewPayment(row.id)}
                      >
                        عرض
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-(--dash-border) px-3 py-1 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                        onClick={() => handleNotifyPayment(row)}
                      >
                        إشعار
                      </button>
                    </div>
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
