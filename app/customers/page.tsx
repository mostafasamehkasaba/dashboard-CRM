"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DashboardShell from "../components/DashboardShell";

const initialCustomers = [
  {
    id: "CUS-001",
    name: "شركة النور للتجارة",
    status: "نشط",
    email: "info@alnour.com",
    phone: "+966 50 123 4567",
    city: "الرياض، المملكة العربية السعودية",
    invoices: 15,
    sales: "125,000 ريال",
    paid: "110,000 ريال",
    due: "15,000 ريال",
  },
  {
    id: "CUS-002",
    name: "مؤسسة الأمل",
    status: "نشط",
    email: "contact@alamal.com",
    phone: "+966 50 765 4321",
    city: "جدة، المملكة العربية السعودية",
    invoices: 8,
    sales: "65,000 ريال",
    paid: "56,500 ريال",
    due: "8,500 ريال",
  },
  {
    id: "CUS-003",
    name: "شركة المستقبل",
    status: "نشط",
    email: "info@almustaqbal.com",
    phone: "+966 55 987 6543",
    city: "الدمام، المملكة العربية السعودية",
    invoices: 22,
    sales: "185,000 ريال",
    paid: "185,000 ريال",
    due: "0 ريال",
  },
  {
    id: "CUS-004",
    name: "مؤسسة التقدم",
    status: "غير نشط",
    email: "sales@altaqadum.com",
    phone: "+966 56 034 5678",
    city: "مكة المكرمة، المملكة العربية السعودية",
    invoices: 5,
    sales: "42,000 ريال",
    paid: "35,300 ريال",
    due: "6,700 ريال",
  },
];

const page = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof initialCustomers)[number] | null>(null);
  const [query, setQuery] = useState("");
  const formRef = useRef<HTMLElement | null>(null);
  const viewRef = useRef<HTMLElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    status: "نشط",
    invoices: "0",
    sales: "",
    paid: "",
    due: "",
  });

  const summary = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCount = customers.filter((item) => item.status === "نشط").length;
    return [
      { label: "إجمالي العملاء", value: `${totalCustomers}`, tone: "text-(--dash-text)" },
      { label: "العملاء النشطون", value: `${activeCount}`, tone: "text-(--dash-success)" },
      { label: "إجمالي المبيعات", value: "417,000 ريال", tone: "text-(--dash-text)" },
      { label: "المستحقات", value: "30,200 ريال", tone: "text-(--dash-warning)" },
    ];
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return customers;
    }
    return customers.filter((item) =>
      [
        item.name,
        item.email,
        item.phone,
        item.city,
        item.status,
        item.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [customers, query]);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomer = () => {
    const name = form.name.trim();
    if (!name) {
      return;
    }
    const nextCustomer = {
      id: editingId ?? `CUS-${String(customers.length + 1).padStart(3, "0")}`,
      name,
      status: form.status,
      email: form.email.trim() || "info@company.com",
      phone: form.phone.trim() || "+966 50 000 0000",
      city: form.city.trim() || "الرياض، المملكة العربية السعودية",
      invoices: Number.parseInt(form.invoices, 10) || 0,
      sales: form.sales.trim() || "0 ريال",
      paid: form.paid.trim() || "0 ريال",
      due: form.due.trim() || "0 ريال",
    };
    setCustomers((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? nextCustomer : item));
      }
      return [...prev, nextCustomer];
    });
    setForm({
      name: "",
      email: "",
      phone: "",
      city: "",
      status: "نشط",
      invoices: "0",
      sales: "",
      paid: "",
      due: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditCustomer = (customerId: string) => {
    const target = customers.find((item) => item.id === customerId);
    if (!target) {
      return;
    }
    setForm({
      name: target.name,
      email: target.email,
      phone: target.phone,
      city: target.city,
      status: target.status,
      invoices: String(target.invoices),
      sales: target.sales,
      paid: target.paid,
      due: target.due,
    });
    setEditingId(target.id);
    setShowForm(true);
  };

  const handleViewCustomer = (customerId: string) => {
    const target = customers.find((item) => item.id === customerId) ?? null;
    setSelectedCustomer(target);
  };

  const handleCloseView = () => {
    setSelectedCustomer(null);
  };

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  useEffect(() => {
    if (selectedCustomer && viewRef.current) {
      viewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedCustomer]);

  return (
    <DashboardShell
      title="العملاء"
      subtitle="إدارة قاعدة بيانات العملاء"
      exportData={{
        filename: "customers",
        headers: ["رقم العميل", "الاسم", "الحالة", "البريد الإلكتروني", "رقم الهاتف", "المدينة", "عدد الفواتير", "إجمالي المبيعات", "المدفوع", "المستحق"],
        rows: customers.map((item) => [
          item.id,
          item.name,
          item.status,
          item.email,
          item.phone,
          item.city,
          item.invoices,
          item.sales,
          item.paid,
          item.due,
        ]),
      }}

      headerAction={
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-(--dash-primary) px-4 py-2 text-sm font-semibold text-white shadow-(--dash-primary-soft)"
          onClick={() => setShowForm((prev) => !prev)}
        >
          <span className="text-lg">+</span>
          عميل جديد
        </button>
      }
    >
      {showForm ? (
        <section
          ref={formRef}
          className="mb-6 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)"
        >
          <h2 className="text-lg font-semibold">{editingId ? "تعديل بيانات العميل" : "إضافة عميل جديد"}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">اسم العميل</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                placeholder="اسم العميل"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">البريد الإلكتروني</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleFormChange("email", event.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">رقم الهاتف</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => handleFormChange("phone", event.target.value)}
                placeholder="+966 50 000 0000"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المدينة</span>
              <input
                type="text"
                value={form.city}
                onChange={(event) => handleFormChange("city", event.target.value)}
                placeholder="الرياض"
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
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
              </select>
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">عدد الفواتير</span>
              <input
                type="number"
                value={form.invoices}
                onChange={(event) => handleFormChange("invoices", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              />
            </label>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">إجمالي المبيعات</span>
              <input
                type="text"
                value={form.sales}
                onChange={(event) => handleFormChange("sales", event.target.value)}
                placeholder="0 ريال"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">إجمالي المدفوع</span>
              <input
                type="text"
                value={form.paid}
                onChange={(event) => handleFormChange("paid", event.target.value)}
                placeholder="0 ريال"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المستحقات</span>
              <input
                type="text"
                value={form.due}
                onChange={(event) => handleFormChange("due", event.target.value)}
                placeholder="0 ريال"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text)"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              إلغاء
            </button>
            <button
              type="button"
              className="rounded-xl bg-(--dash-primary) px-4 py-2 text-sm font-semibold text-white shadow-(--dash-primary-soft)"
              onClick={handleAddCustomer}
            >
              {editingId ? "حفظ التعديلات" : "حفظ العميل"}
            </button>
          </div>
        </section>
      ) : null}

      {selectedCustomer ? (
        <section
          ref={viewRef}
          className="mb-6 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{selectedCustomer.name}</h2>
              <p className="mt-1 text-xs text-(--dash-muted)">رقم العميل: {selectedCustomer.id}</p>
            </div>
            <button
              type="button"
              onClick={handleCloseView}
              className="rounded-xl border border-(--dash-border) px-4 py-2 text-sm text-(--dash-text)"
            >
              إغلاق
            </button>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 text-sm">
              <p className="font-semibold text-(--dash-text)">بيانات التواصل</p>
              <div className="mt-3 space-y-2 text-(--dash-muted)">
                <p>البريد: {selectedCustomer.email}</p>
                <p>الهاتف: {selectedCustomer.phone}</p>
                <p>المدينة: {selectedCustomer.city}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 text-sm">
              <p className="font-semibold text-(--dash-text)">الملخص المالي</p>
              <div className="mt-3 space-y-2 text-(--dash-muted)">
                <p>إجمالي الفواتير: {selectedCustomer.invoices}</p>
                <p>إجمالي المبيعات: {selectedCustomer.sales}</p>
                <p>إجمالي المدفوع: {selectedCustomer.paid}</p>
                <p>المستحقات: {selectedCustomer.due}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-5 shadow-(--dash-shadow)"
          >
            <p className="text-sm text-(--dash-muted)">{card.label}</p>
            <p className={`mt-3 text-xl font-semibold ${card.tone}`}>{card.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-4 shadow-(--dash-shadow)">
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
              placeholder="بحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
              className="w-full bg-transparent text-sm text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-5 shadow-(--dash-shadow)"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">{customer.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      customer.status === "نشط"
                        ? "bg-(--dash-primary) text-white"
                        : "bg-(--dash-panel-soft) text-(--dash-muted)"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-(--dash-muted)">
                  <p>{customer.email}</p>
                  <p>{customer.phone}</p>
                  <p>{customer.city}</p>
                </div>
              </div>
              <span className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-2 py-1 text-xs text-(--dash-muted)">
                {customer.id}
              </span>
            </div>

            <div className="my-4 border-t border-(--dash-border)" />

            <div className="grid grid-cols-3 gap-4 text-xs text-(--dash-muted)">
              <div>
                <p className="font-semibold text-(--dash-text)">{customer.invoices}</p>
                <p>إجمالي الفواتير</p>
              </div>
              <div>
                <p className="font-semibold text-(--dash-text)">{customer.sales}</p>
                <p>إجمالي المبيعات</p>
              </div>
              <div>
                <p className="font-semibold text-(--dash-warning)">{customer.due}</p>
                <p>المستحقات</p>
              </div>
              <div>
                <p className="font-semibold text-(--dash-success)">{customer.paid}</p>
                <p>إجمالي المدفوع</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl border border-(--dash-border) px-3 py-2 text-xs text-(--dash-text) hover:bg-(--dash-panel-soft)"
                onClick={() => handleViewCustomer(customer.id)}
              >
                عرض
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-(--dash-border) px-3 py-2 text-xs text-(--dash-text) hover:bg-(--dash-panel-soft)"
                onClick={() => handleEditCustomer(customer.id)}
              >
                تعديل
              </button>
            </div>
          </div>
        ))}
      </section>
    </DashboardShell>
  );
};

export default page;
