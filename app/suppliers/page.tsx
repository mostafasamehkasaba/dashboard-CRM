"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type SupplierStatus = "نشط" | "غير نشط";

type Supplier = {
  id: string;
  name: string;
  status: SupplierStatus;
  email: string;
  phone: string;
  city: string;
  orders: number;
  purchases: number;
  outstanding: number;
};

const initialSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "مورد الأثاث المكتبي",
    status: "نشط",
    email: "info@furniture.com",
    phone: "+966 55 123 4567",
    city: "الدمام، المملكة العربية السعودية",
    orders: 12,
    purchases: 95000,
    outstanding: 15000,
  },
  {
    id: "SUP-002",
    name: "شركة التوريدات الغذائية",
    status: "نشط",
    email: "contact@food.com",
    phone: "+966 56 507 6543",
    city: "جدة، المملكة العربية السعودية",
    orders: 18,
    purchases: 180000,
    outstanding: 0,
  },
  {
    id: "SUP-003",
    name: "مورد المواد الإلكترونية",
    status: "نشط",
    email: "info@electronics.com",
    phone: "+966 50 123 4567",
    city: "الرياض، المملكة العربية السعودية",
    orders: 22,
    purchases: 250000,
    outstanding: 45000,
  },
  {
    id: "SUP-004",
    name: "حلول المستلزمات الطبية",
    status: "غير نشط",
    email: "sales@medical.com",
    phone: "+966 54 334 2211",
    city: "مكة المكرمة، المملكة العربية السعودية",
    orders: 6,
    purchases: 60000,
    outstanding: 12000,
  },
];

const formatCurrency = (value: number) => `${value.toLocaleString()} ريال`;

const page = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [query, setQuery] = useState("");
  const formRef = useRef<HTMLElement | null>(null);
  const viewRef = useRef<HTMLElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    status: "نشط" as SupplierStatus,
    orders: "0",
    purchases: "",
    outstanding: "",
  });

  const summary = useMemo(() => {
    const totalSuppliers = suppliers.length;
    const activeCount = suppliers.filter((item) => item.status === "نشط").length;
    const totalPurchases = suppliers.reduce((sum, item) => sum + item.purchases, 0);
    const totalOutstanding = suppliers.reduce((sum, item) => sum + item.outstanding, 0);
    return [
      { label: "إجمالي الموردين", value: `${totalSuppliers}`, tone: "text-(--dash-text)" },
      { label: "الموردون النشطون", value: `${activeCount}`, tone: "text-(--dash-success)" },
      { label: "إجمالي المشتريات", value: formatCurrency(totalPurchases), tone: "text-(--dash-text)" },
      { label: "المستحقات", value: formatCurrency(totalOutstanding), tone: "text-(--dash-warning)" },
    ];
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return suppliers;
    }
    return suppliers.filter((item) =>
      [item.name, item.email, item.phone, item.city, item.status, item.id]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [suppliers, query]);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSupplier = () => {
    const name = form.name.trim();
    if (!name) {
      return;
    }
    const nextSupplier: Supplier = {
      id: editingId ?? `SUP-${String(suppliers.length + 1).padStart(3, "0")}`,
      name,
      status: form.status,
      email: form.email.trim() || "info@company.com",
      phone: form.phone.trim() || "+966 50 000 0000",
      city: form.city.trim() || "الرياض، المملكة العربية السعودية",
      orders: Number.parseInt(form.orders, 10) || 0,
      purchases: Number.parseFloat(form.purchases) || 0,
      outstanding: Number.parseFloat(form.outstanding) || 0,
    };
    setSuppliers((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? nextSupplier : item));
      }
      return [nextSupplier, ...prev];
    });
    setForm({
      name: "",
      email: "",
      phone: "",
      city: "",
      status: "نشط",
      orders: "0",
      purchases: "",
      outstanding: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditSupplier = (supplierId: string) => {
    const target = suppliers.find((item) => item.id === supplierId);
    if (!target) {
      return;
    }
    setForm({
      name: target.name,
      email: target.email,
      phone: target.phone,
      city: target.city,
      status: target.status,
      orders: String(target.orders),
      purchases: String(target.purchases),
      outstanding: String(target.outstanding),
    });
    setEditingId(target.id);
    setShowForm(true);
  };

  const handleViewSupplier = (supplierId: string) => {
    const target = suppliers.find((item) => item.id === supplierId) ?? null;
    setSelectedSupplier(target);
  };

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  useEffect(() => {
    if (selectedSupplier && viewRef.current) {
      viewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSupplier]);

  return (
    <DashboardShell
      title="الموردين"
      subtitle="إدارة قاعدة بيانات الموردين"
      exportData={{
        filename: "suppliers",
        headers: ["رقم المورد", "الاسم", "الحالة", "البريد الإلكتروني", "رقم الهاتف", "المدينة", "عدد الطلبات", "إجمالي المشتريات", "المستحقات"],
        rows: suppliers.map((item) => [
          item.id,
          item.name,
          item.status,
          item.email,
          item.phone,
          item.city,
          item.orders,
          item.purchases,
          item.outstanding,
        ]),
      }}

      headerAction={
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-(--dash-primary) px-4 py-2 text-sm font-semibold text-white shadow-(--dash-primary-soft)"
          onClick={() => setShowForm((prev) => !prev)}
        >
          <span className="text-lg">+</span>
          مورد جديد
        </button>
      }
    >
      {showForm ? (
        <section
          ref={formRef}
          className="mb-6 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)"
        >
          <h2 className="text-lg font-semibold">{editingId ? "تعديل بيانات المورد" : "إضافة مورد جديد"}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">اسم المورد</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                placeholder="اسم المورد"
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
              <span className="mb-2 block font-semibold text-(--dash-text)">عدد الطلبات</span>
              <input
                type="number"
                value={form.orders}
                onChange={(event) => handleFormChange("orders", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              />
            </label>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">إجمالي المشتريات</span>
              <input
                type="number"
                value={form.purchases}
                onChange={(event) => handleFormChange("purchases", event.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المستحقات</span>
              <input
                type="number"
                value={form.outstanding}
                onChange={(event) => handleFormChange("outstanding", event.target.value)}
                placeholder="0"
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
              onClick={handleAddSupplier}
            >
              {editingId ? "حفظ التعديلات" : "إضافة المورد"}
            </button>
          </div>
        </section>
      ) : null}

      {selectedSupplier ? (
        <section
          ref={viewRef}
          className="mb-6 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{selectedSupplier.name}</h2>
              <p className="mt-1 text-xs text-(--dash-muted)">رقم المورد: {selectedSupplier.id}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSupplier(null)}
              className="rounded-xl border border-(--dash-border) px-4 py-2 text-sm text-(--dash-text)"
            >
              إغلاق
            </button>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 text-sm">
              <p className="font-semibold text-(--dash-text)">بيانات المورد</p>
              <div className="mt-3 space-y-2 text-(--dash-muted)">
                <p>البريد الإلكتروني: {selectedSupplier.email}</p>
                <p>رقم الهاتف: {selectedSupplier.phone}</p>
                <p>المدينة: {selectedSupplier.city}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 text-sm">
              <p className="font-semibold text-(--dash-text)">الملخص المالي</p>
              <div className="mt-3 space-y-2 text-(--dash-muted)">
                <p>عدد الطلبات: {selectedSupplier.orders}</p>
                <p>إجمالي المشتريات: {formatCurrency(selectedSupplier.purchases)}</p>
                <p>المستحقات: {formatCurrency(selectedSupplier.outstanding)}</p>
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
            فلتر
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
              placeholder="بحث بالاسم أو البريد الإلكتروني..."
              className="w-full bg-transparent text-sm text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-5 shadow-(--dash-shadow)"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">{supplier.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      supplier.status === "نشط"
                        ? "bg-(--dash-primary) text-white"
                        : "bg-(--dash-panel-soft) text-(--dash-muted)"
                    }`}
                  >
                    {supplier.status}
                  </span>
                </div>
                <div className="mt-3 space-y-1 text-xs text-(--dash-muted)">
                  <p>{supplier.email}</p>
                  <p>{supplier.phone}</p>
                  <p>{supplier.city}</p>
                </div>
              </div>
              <span className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-2 py-1 text-xs text-(--dash-muted)">
                {supplier.id}
              </span>
            </div>

            <div className="my-4 border-t border-(--dash-border)" />

            <div className="grid grid-cols-2 gap-4 text-xs text-(--dash-muted)">
              <div>
                <p className="font-semibold text-(--dash-text)">{supplier.orders}</p>
                <p>عدد الطلبات</p>
              </div>
              <div>
                <p className="font-semibold text-(--dash-text)">{formatCurrency(supplier.purchases)}</p>
                <p>إجمالي المشتريات</p>
              </div>
              <div>
                <p className="font-semibold text-(--dash-warning)">{formatCurrency(supplier.outstanding)}</p>
                <p>المستحقات</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl border border-(--dash-border) px-3 py-2 text-xs text-(--dash-text) hover:bg-(--dash-panel-soft)"
                onClick={() => handleViewSupplier(supplier.id)}
              >
                عرض
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-(--dash-border) px-3 py-2 text-xs text-(--dash-text) hover:bg-(--dash-panel-soft)"
                onClick={() => handleEditSupplier(supplier.id)}
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
