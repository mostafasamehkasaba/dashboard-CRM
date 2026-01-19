"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type Purchase = {
  id: string;
  supplier: string;
  manager: string;
  date: string;
  itemsCount: number;
  total: number;
  paid: number;
};

const statusOptions = ["كل الحالات", "مدفوع", "جزئي", "آجلة"];

const initialPurchases: Purchase[] = [
  {
    id: "PUR-001",
    supplier: "مورد المواد الإلكترونية",
    manager: "المستودع الرئيسي",
    date: "2026-01-16",
    itemsCount: 15,
    total: 45000,
    paid: 45000,
  },
  {
    id: "PUR-002",
    supplier: "شركة التوريدات الغذائية",
    manager: "المستودع الرئيسي",
    date: "2026-01-15",
    itemsCount: 28,
    total: 32000,
    paid: 20000,
  },
  {
    id: "PUR-003",
    supplier: "مورد الأثاث المكتبي",
    manager: "مستودع جدة",
    date: "2026-01-14",
    itemsCount: 8,
    total: 18500,
    paid: 0,
  },
  {
    id: "PUR-004",
    supplier: "مورد المواد الإلكترونية",
    manager: "المستودع الرئيسي",
    date: "2026-01-12",
    itemsCount: 22,
    total: 52000,
    paid: 52000,
  },
  {
    id: "PUR-005",
    supplier: "شركة التوريدات الغذائية",
    manager: "المستودع الرئيسي",
    date: "2026-01-10",
    itemsCount: 35,
    total: 28000,
    paid: 28000,
  },
];

const formatCurrency = (value: number) => `${value.toLocaleString("en-US")} ريال`;

const getStatus = (total: number, paid: number) => {
  if (paid >= total) {
    return "مدفوع";
  }
  if (paid <= 0) {
    return "آجلة";
  }
  return "جزئي";
};

const statusTone: Record<string, string> = {
  مدفوع: "bg-(--dash-primary) text-white flex items-center justify-center h-6",
  جزئي: "bg-(--dash-panel-glass) text-(--dash-muted) flex items-center justify-center h-6",
  آجلة: "bg-(--dash-danger) text-white flex items-center justify-center h-6",
};

const buildNextId = (purchases: Purchase[]) => {
  const max = purchases.reduce((acc, item) => {
    const numeric = Number.parseInt(item.id.replace("PUR-", ""), 10);
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric);
  }, 0);
  return `PUR-${String(max + 1).padStart(3, "0")}`;
};

const page = () => {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(statusOptions[0]);
  const [modalMode, setModalMode] = useState<"new" | "edit" | "view" | null>(null);
  const [activePurchase, setActivePurchase] = useState<Purchase | null>(null);
  const [formData, setFormData] = useState({
    supplier: "",
    manager: "المستودع الرئيسي",
    date: "2026-01-16",
    itemsCount: "1",
    total: "",
    paid: "",
  });

  const stats = useMemo(() => {
    const total = purchases.reduce((sum, item) => sum + item.total, 0);
    const paid = purchases.reduce((sum, item) => sum + item.paid, 0);
    const remaining = Math.max(total - paid, 0);
    return [
      {
        label: "إجمالي المشتريات",
        value: formatCurrency(total),
        tone: "text-(--dash-primary)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M6 6h15a1 1 0 0 1 .98 1.2l-1.5 7A1 1 0 0 1 19.5 15H8a1 1 0 0 1-.96-.72L4.4 4H2a1 1 0 1 1 0-2h3a1 1 0 0 1 .96.72L6.7 6Z"
            />
          </svg>
        ),
      },
      {
        label: "المدفوع",
        value: formatCurrency(paid),
        tone: "text-(--dash-success)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M5 4h14a2 2 0 0 1 2 2v2H3V6a2 2 0 0 1 2-2Zm-2 8h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Zm4 3h6a1 1 0 0 0 0-2H7a1 1 0 1 0 0 2Z"
            />
          </svg>
        ),
      },
      {
        label: "المتبقي",
        value: formatCurrency(remaining),
        tone: "text-(--dash-danger)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3 2 21h20L12 3Zm0 5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Z"
            />
          </svg>
        ),
      },
      {
        label: "عدد الطلبات",
        value: String(purchases.length),
        tone: "text-(--dash-info)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5Z"
            />
          </svg>
        ),
      },
    ];
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return purchases.filter((purchase) => {
      const matchesQuery = normalizedQuery
        ? [
            purchase.id,
            purchase.supplier,
            purchase.manager,
            purchase.date,
            purchase.itemsCount,
            purchase.total,
            purchase.paid,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      const status = getStatus(purchase.total, purchase.paid);
      const matchesStatus = statusFilter === "كل الحالات" || status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, purchases]);

  const openModal = (mode: "new" | "edit" | "view", purchase?: Purchase) => {
    setModalMode(mode);
    setActivePurchase(purchase ?? null);
    if (mode === "edit" && purchase) {
      setFormData({
        supplier: purchase.supplier,
        manager: purchase.manager,
        date: purchase.date,
        itemsCount: String(purchase.itemsCount),
        total: String(purchase.total),
        paid: String(purchase.paid),
      });
    }
    if (mode === "new") {
      setFormData({
        supplier: "",
        manager: "المستودع الرئيسي",
        date: "2026-01-16",
        itemsCount: "1",
        total: "",
        paid: "",
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setActivePurchase(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const totalValue = Number.parseFloat(formData.total);
    const paidValue = Number.parseFloat(formData.paid || "0");
    const itemsValue = Number.parseInt(formData.itemsCount || "0", 10);
    if (!formData.supplier.trim() || Number.isNaN(totalValue) || totalValue <= 0) {
      return;
    }
    if (modalMode === "edit" && activePurchase) {
      setPurchases((prev) =>
        prev.map((item) =>
          item.id === activePurchase.id
            ? {
                ...item,
                supplier: formData.supplier.trim(),
                manager: formData.manager.trim(),
                date: formData.date,
                itemsCount: Number.isNaN(itemsValue) ? item.itemsCount : itemsValue,
                total: totalValue,
                paid: Number.isNaN(paidValue) ? 0 : paidValue,
              }
            : item
        )
      );
      closeModal();
      return;
    }
    const newPurchase: Purchase = {
      id: buildNextId(purchases),
      supplier: formData.supplier.trim(),
      manager: formData.manager.trim(),
      date: formData.date,
      itemsCount: Number.isNaN(itemsValue) ? 0 : itemsValue,
      total: totalValue,
      paid: Number.isNaN(paidValue) ? 0 : paidValue,
    };
    setPurchases((prev) => [newPurchase, ...prev]);
    closeModal();
  };

  return (
    <DashboardShell
      title="المشتريات"
      subtitle="إدارة وتتبع طلبات الشراء من الموردين"
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="بحث باسم الطلب أو المورد..."
      headerAction={
        <button
          type="button"
          onClick={() => openModal("new")}
          className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
        >
          إنشاء طلب شراء جديد +
        </button>
      }
      exportData={{
        filename: "purchases",
        headers: [
          "رقم الطلب",
          "المورد",
          "التاريخ",
          "العناصر",
          "الإجمالي",
          "المدفوع",
          "المتبقي",
          "الحالة",
        ],
        rows: filteredPurchases.map((purchase) => {
          const status = getStatus(purchase.total, purchase.paid);
          return [
            purchase.id,
            purchase.supplier,
            purchase.date,
            `${purchase.itemsCount} عنصر`,
            formatCurrency(purchase.total),
            formatCurrency(purchase.paid),
            formatCurrency(Math.max(purchase.total - purchase.paid, 0)),
            status,
          ];
        }),
      }}
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
                <p className="mt-2 text-2xl font-semibold text-(--dash-text)">{item.value}</p>
              </div>
              <span className={`rounded-2xl bg-(--dash-panel-glass) p-3 ${item.tone}`}>{item.icon}</span>
            </div>
          ))}
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
                تصفية
              </button>
              <button
                type="button"
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-muted)"
              >
                تصدير
              </button>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-(--dash-muted)">يتم عرض {filteredPurchases.length} طلب</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-(--dash-border)">
            <div className="grid min-w-[980px] grid-cols-9 gap-4 border-b border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3 text-xs font-semibold text-(--dash-muted)">
              <span className="text-right">رقم الطلب</span>
              <span className="text-right">المورد</span>
              <span className="text-right">التاريخ</span>
              <span className="text-right">العناصر</span>
              <span className="text-right">الإجمالي</span>
              <span className="text-right">المدفوع</span>
              <span className="text-right">المتبقي</span>
              <span className="text-right">الحالة</span>
              <span className="text-right">الإجراءات</span>
            </div>
            {filteredPurchases.map((purchase) => {
              const status = getStatus(purchase.total, purchase.paid);
              return (
                <div
                  key={purchase.id}
                  className="grid min-w-[980px] grid-cols-9 gap-4 border-b border-(--dash-border) px-4 py-3 text-sm text-(--dash-text) last:border-b-0"
                >
                  <span className="font-semibold">{purchase.id}</span>
                  <div>
                    <p className="font-semibold">{purchase.supplier}</p>
                    <p className="text-xs text-(--dash-muted)">{purchase.manager}</p>
                  </div>
                  <span>{purchase.date}</span>
                  <span className="rounded-lg border border-(--dash-border) bg-(--dash-panel-glass) px-2 py-1 text-xs text-(--dash-muted)">
                    {purchase.itemsCount} عنصر
                  </span>
                  <span className="font-semibold text-(--dash-text)">{formatCurrency(purchase.total)}</span>
                  <span className="text-(--dash-success)">{formatCurrency(purchase.paid)}</span>
                  <span className="text-(--dash-danger)">
                    {formatCurrency(Math.max(purchase.total - purchase.paid, 0))}
                  </span>
                  <span className="flex">
                    <span
                      className={`min-w-[72px] rounded-full px-3 py-1 text-center text-xs font-semibold ${statusTone[status]}`}
                    >
                      {status}
                    </span>
                  </span>
                  <div className="flex items-center gap-3 text-(--dash-muted)">
                    <button type="button" onClick={() => openModal("edit", purchase)} className="hover:text-(--dash-primary)">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M4 21h4l11-11-4-4L4 17v4Zm14.7-12.3L17 7l2-2 1.7 1.7-2 2Z"
                        />
                      </svg>
                    </button>
                    <button type="button" onClick={() => openModal("view", purchase)} className="hover:text-(--dash-primary)">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M12 5c4.4 0 8 2.7 9.5 6.5a1 1 0 0 1 0 .9C20 16.3 16.4 19 12 19S4 16.3 2.5 12.4a1 1 0 0 1 0-.9C4 7.7 7.6 5 12 5Zm0 3.5A3.5 3.5 0 1 0 15.5 12 3.5 3.5 0 0 0 12 8.5Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {modalMode ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {modalMode === "view"
                  ? "تفاصيل طلب الشراء"
                  : modalMode === "edit"
                  ? "تعديل طلب شراء"
                  : "إنشاء طلب شراء جديد"}
              </h3>
              <button type="button" onClick={closeModal} className="text-sm text-(--dash-muted)">
                إغلاق
              </button>
            </div>

            {modalMode === "view" && activePurchase ? (
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">رقم الطلب</span>
                  <span className="font-semibold">{activePurchase.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">المورد</span>
                  <span>{activePurchase.supplier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">المستودع</span>
                  <span>{activePurchase.manager}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">التاريخ</span>
                  <span>{activePurchase.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">العناصر</span>
                  <span>{activePurchase.itemsCount} عنصر</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">الإجمالي</span>
                  <span className="font-semibold">{formatCurrency(activePurchase.total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">المدفوع</span>
                  <span className="text-(--dash-success)">{formatCurrency(activePurchase.paid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">المتبقي</span>
                  <span className="text-(--dash-danger)">
                    {formatCurrency(Math.max(activePurchase.total - activePurchase.paid, 0))}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-(--dash-muted)">المورد</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(event) => handleFormChange("supplier", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-(--dash-muted)">المستودع</label>
                    <input
                      type="text"
                      value={formData.manager}
                      onChange={(event) => handleFormChange("manager", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    />
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
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-xs text-(--dash-muted)">العناصر</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.itemsCount}
                      onChange={(event) => handleFormChange("itemsCount", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-(--dash-muted)">الإجمالي</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={formData.total}
                      onChange={(event) => handleFormChange("total", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-(--dash-muted)">المدفوع</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={formData.paid}
                      onChange={(event) => handleFormChange("paid", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    />
                  </div>
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
                    حفظ الطلب
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
