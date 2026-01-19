"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

const summaryCards = [
  {
    label: "إجمالي المنتجات",
    value: "5",
    tone: "text-(--dash-primary)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 7h18l-2 10a2 2 0 0 1-2 1.6H7a2 2 0 0 1-2-1.6L3 7Zm2-3h14a1 1 0 0 1 1 1v2H4V5a1 1 0 0 1 1-1Z"
        />
      </svg>
    ),
  },
  {
    label: "مخزون منخفض",
    value: "1",
    tone: "text-(--dash-warning)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3 2 21h20L12 3Zm0 5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Zm0 10a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 12 18Z"
        />
      </svg>
    ),
  },
  {
    label: "نفاد من المخزون",
    value: "1",
    tone: "text-(--dash-danger)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 6h-2V6h2v2Zm0 8h-2v-6h2v6Z"
        />
      </svg>
    ),
  },
  {
    label: "قارب على الانتهاء",
    value: "1",
    tone: "text-(--dash-info)",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm1 4v5h4a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1V7a1 1 0 0 1 2 0Z"
        />
      </svg>
    ),
  },
];

const alerts = [
  {
    title: "كيبورد ميكانيكي",
    description: "المخزون منخفض - متبقٍ 3 وحدات فقط (الحد الأدنى 10)",
    tone: "border-(--dash-warning) bg-(--dash-warning-soft)",
  },
  {
    title: "شاشة Dell 27 بوصة",
    description: "نفاد من المخزون - يحتاج إلى إعادة طلب",
    tone: "border-(--dash-danger) bg-(--dash-danger-soft)",
  },
  {
    title: "دواء ABC",
    description: "ينتهي في 22-01-2026",
    tone: "border-(--dash-info) bg-(--dash-info-soft)",
  },
];

const stockRows = [
  {
    name: "لابتوب HP EliteBook",
    sku: "PROD-001",
    current: 15,
    min: 5,
    max: 50,
    percent: 30,
    status: "طبيعي",
    statusTone: "bg-(--dash-primary-soft) text-(--dash-primary)",
    date: "2026-01-15",
  },
  {
    name: "ماوس Logitech لاسلكي",
    sku: "PROD-002",
    current: 45,
    min: 20,
    max: 100,
    percent: 45,
    status: "طبيعي",
    statusTone: "bg-(--dash-primary-soft) text-(--dash-primary)",
    date: "2026-01-14",
  },
  {
    name: "كيبورد ميكانيكي",
    sku: "PROD-003",
    current: 3,
    min: 10,
    max: 30,
    percent: 10,
    status: "منخفض",
    statusTone: "bg-(--dash-warning-soft) text-(--dash-warning)",
    date: "2026-01-13",
  },
  {
    name: "شاشة Dell 27 بوصة",
    sku: "PROD-004",
    current: 0,
    min: 5,
    max: 20,
    percent: 0,
    status: "نفد",
    statusTone: "bg-(--dash-danger-soft) text-(--dash-danger)",
    date: "2026-01-10",
  },
  {
    name: "دواء ABC",
    sku: "PROD-005",
    current: 25,
    min: 10,
    max: 50,
    percent: 50,
    status: "قارب على الانتهاء",
    statusTone: "bg-(--dash-panel-glass) text-(--dash-muted)",
    date: "2026-01-15",
  },
];

const tabOptions = ["الملخص", "حركة المخزون", "مستويات المخزون"];

const getPercent = (current: number, max: number) => (max > 0 ? Math.round((current / max) * 100) : 0);

const page = () => {
  const [tab, setTab] = useState(tabOptions[0]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("الكل");
  const [rows, setRows] = useState(stockRows);
  const [editMode, setEditMode] = useState(false);

  const updateRow = (sku: string, field: "current" | "min" | "max", value: number) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.sku !== sku) {
          return row;
        }
        const next = { ...row, [field]: value };
        if (field === "current" || field === "max") {
          next.percent = getPercent(next.current, next.max);
        }
        return next;
      })
    );
  };

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = normalizedQuery
        ? [row.name, row.sku, row.status, row.date]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      const matchesFilter =
        filter === "الكل" ||
        (filter === "منخفض" && row.status === "منخفض") ||
        (filter === "نفد" && row.status === "نفد") ||
        (filter === "قارب على الانتهاء" && row.status === "قارب على الانتهاء");
      return matchesQuery && matchesFilter;
    });
  }, [query, filter, rows]);

  return (
    <DashboardShell
      title="إدارة المخزون"
      subtitle="متابعة مستويات وحركة المخزون"
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="بحث سريع عن اسم المنتج أو الكود..."
      headerAction={
        <button
          type="button"
          onClick={() => setEditMode((prev) => !prev)}
          className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
        >
          {editMode ? "حفظ" : "تعديل"}
        </button>
      }
      exportData={{
        filename: "inventory-stock",
        headers: [
          "المنتج",
          "رقم المنتج",
          "المخزون الحالي",
          "الحد الأدنى",
          "الحد الأقصى",
          "النسبة",
          "الحالة",
          "آخر تحديث",
        ],
        rows: filteredRows.map((row) => [
          row.name,
          row.sku,
          `${row.current} وحدة`,
          `${row.min} وحدة`,
          `${row.max} وحدة`,
          `${row.percent}%`,
          row.status,
          row.date,
        ]),
      }}
    >
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">التنبيهات</h2>
            </div>
            <span className="rounded-full bg-(--dash-warning-soft) p-2 text-(--dash-warning)">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 3 2 21h20L12 3Zm0 5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Zm0 10a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 12 18Z"
                />
              </svg>
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 text-sm ${alert.tone}`}
              >
                <div>
                  <p className="font-semibold text-(--dash-text)">{alert.title}</p>
                  <p className="mt-1 text-xs text-(--dash-muted)">{alert.description}</p>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-(--dash-border) bg-(--dash-panel-glass) px-4 py-2 text-xs text-(--dash-text)"
                >
                  طلب الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap gap-2">
          {tabOptions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                tab === item ? "bg-(--dash-primary) text-white" : "bg-(--dash-panel-soft) text-(--dash-muted)"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
              >
                <option value="الكل">كل الأصناف</option>
                <option value="منخفض">منخفضة المخزون</option>
                <option value="نفد">نفاد المخزون</option>
                <option value="قارب على الانتهاء">قارب على الانتهاء</option>
              </select>
              <span className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-muted)">
                فلتر متقدم
              </span>
            </div>
            <span className="text-xs text-(--dash-muted)">{tab}</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-(--dash-border)">
            <div className="grid min-w-[840px] grid-cols-8 gap-4 border-b border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3 text-xs font-semibold text-(--dash-muted)">
              <span className="text-right">المنتج</span>
              <span className="text-right">رقم المنتج</span>
              <span className="text-right">المخزون الحالي</span>
              <span className="text-right">الحد الأدنى</span>
              <span className="text-right">الحد الأقصى</span>
              <span className="text-right">النسبة</span>
              <span className="text-right">الحالة</span>
              <span className="text-right">آخر تحديث</span>
            </div>
            {filteredRows.map((row) => (
              <div
                key={row.sku}
                className="grid min-w-[840px] grid-cols-8 gap-4 border-b border-(--dash-border) px-4 py-3 text-sm text-(--dash-text) last:border-b-0"
              >
                <span>{row.name}</span>
                <span>{row.sku}</span>
                <span className="flex items-center gap-2">
                  {editMode ? (
                    <>
                      <input
                        type="number"
                        min={0}
                        value={row.current}
                        onChange={(event) =>
                          updateRow(row.sku, "current", Number.parseInt(event.target.value || "0", 10))
                        }
                        className="w-20 rounded-lg border border-(--dash-border) bg-(--dash-panel-soft) px-2 py-1 text-xs"
                      />
                      <span className="text-xs text-(--dash-muted)">وحدة</span>
                    </>
                  ) : (
                    `${row.current} وحدة`
                  )}
                </span>
                <span className="flex items-center gap-2">
                  {editMode ? (
                    <>
                      <input
                        type="number"
                        min={0}
                        value={row.min}
                        onChange={(event) =>
                          updateRow(row.sku, "min", Number.parseInt(event.target.value || "0", 10))
                        }
                        className="w-20 rounded-lg border border-(--dash-border) bg-(--dash-panel-soft) px-2 py-1 text-xs"
                      />
                      <span className="text-xs text-(--dash-muted)">وحدة</span>
                    </>
                  ) : (
                    `${row.min} وحدة`
                  )}
                </span>
                <span className="flex items-center gap-2">
                  {editMode ? (
                    <>
                      <input
                        type="number"
                        min={0}
                        value={row.max}
                        onChange={(event) =>
                          updateRow(row.sku, "max", Number.parseInt(event.target.value || "0", 10))
                        }
                        className="w-20 rounded-lg border border-(--dash-border) bg-(--dash-panel-soft) px-2 py-1 text-xs"
                      />
                      <span className="text-xs text-(--dash-muted)">وحدة</span>
                    </>
                  ) : (
                    `${row.max} وحدة`
                  )}
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-24 rounded-full bg-(--dash-panel-soft)">
                    <span
                      className="block h-1.5 rounded-full bg-(--dash-primary)"
                      style={{ width: `${row.percent}%` }}
                    />
                  </span>
                  <span className="text-xs text-(--dash-muted)">{row.percent}%</span>
                </span>
                <span className="flex">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.statusTone}`}>
                    {row.status}
                  </span>
                </span>
                <span className="text-(--dash-muted)">{row.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default page;
