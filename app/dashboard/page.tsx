"use client";

import React, { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

const stats = [
  {
    title: "إجمالي المبيعات",
    value: "328,500 ريال",
    change: "+12.5%",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 1a1 1 0 0 1 1 1v2.08c1.72.2 3.26 1.02 4.41 2.28l-1.5 1.3A5.49 5.49 0 0 0 13 6.1V10h2.5a1 1 0 1 1 0 2H13v1.9c0 1.08.88 1.96 1.96 1.96h.54a1 1 0 1 1 0 2h-.54A3.97 3.97 0 0 1 11 13.9V12H8.5a1 1 0 1 1 0-2H11V6.1a5.5 5.5 0 0 0-3.91 1.58L5.6 6.38A7.5 7.5 0 0 1 11 4.08V2a1 1 0 0 1 1-1Z"
        />
      </svg>
    ),
  },
  {
    title: "إجمالي المشتريات",
    value: "232,000 ريال",
    change: "+8.2%",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 6h15a1 1 0 0 1 .98 1.2l-1.5 7A1 1 0 0 1 19.5 15H8a1 1 0 0 1-.96-.72L4.4 4H2a1 1 0 0 1 0-2h3a1 1 0 0 1 .96.72L6.7 6ZM9 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm9 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
        />
      </svg>
    ),
  },
  {
    title: "صافي الأرباح",
    value: "96,500 ريال",
    change: "+15.3%",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M5 18h12a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2Zm1-4 4-4 3 3 5-6a1 1 0 0 1 1.52 1.3l-5.7 6.84a1 1 0 0 1-1.47.1l-3.04-3.03-3.28 3.28A1 1 0 1 1 6 14Z"
        />
      </svg>
    ),
  },
  {
    title: "المستحقات",
    value: "45,300 ريال",
    change: "-3.1%",
    positive: false,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7 4a5 5 0 0 1 10 0v2h2a1 1 0 1 1 0 2h-1.1a6.5 6.5 0 0 1-12.8 0H4a1 1 0 0 1 0-2h2V4Zm2 2h6V4a3 3 0 0 0-6 0v2Zm-2.9 6a4.5 4.5 0 0 0 8.82 0H6.1Z"
        />
      </svg>
    ),
  },
];

const notifications = [
  {
    text: "منتج XYZ - المخزون أقل من الحد الأدنى (5 وحدات متبقية)",
    tone: "border-(--dash-danger) bg-(--dash-danger-soft)",
  },
  {
    text: "منتج ABC - تنتهي صلاحيتها خلال 7 أيام",
    tone: "border-(--dash-warning) bg-(--dash-warning-soft)",
  },
  {
    text: "عميل رقم 1240 - موعد استحقاق فاتورة بعد 14 يوم",
    tone: "border-(--dash-info) bg-(--dash-info-soft)",
  },
];

const topProducts = [
  { label: "منتج A", value: 60000 },
  { label: "منتج B", value: 48000 },
  { label: "منتج C", value: 41000 },
  { label: "منتج D", value: 36000 },
  { label: "منتج E", value: 32000 },
];

const revenuePoints = [
  { month: "يناير", sales: 42000, profit: 12000 },
  { month: "فبراير", sales: 50000, profit: 14000 },
  { month: "مارس", sales: 47000, profit: 13000 },
  { month: "ابريل", sales: 61000, profit: 18000 },
  { month: "مايو", sales: 54000, profit: 15000 },
  { month: "يونيو", sales: 68000, profit: 21000 },
];

const invoices = [
  {
    id: "INV-001",
    client: "شركة النور للتجارة",
    amount: "15,000 ريال",
    status: "مدفوعة",
    statusTone: "bg-(--dash-info-soft) text-(--dash-info)",
    date: "2026-01-15",
  },
  {
    id: "INV-002",
    client: "مؤسسة الأمل",
    amount: "8,500 ريال",
    status: "قيد الانتظار",
    statusTone: "bg-(--dash-warning-soft) text-(--dash-warning)",
    date: "2026-01-14",
  },
  {
    id: "INV-003",
    client: "شركة المستقبل",
    amount: "12,000 ريال",
    status: "مدفوعة",
    statusTone: "bg-(--dash-info-soft) text-(--dash-info)",
    date: "2026-01-14",
  },
  {
    id: "INV-004",
    client: "مؤسسة التقدم",
    amount: "6,700 ريال",
    status: "متأخرة",
    statusTone: "bg-(--dash-danger-soft) text-(--dash-danger)",
    date: "2026-01-10",
  },
  {
    id: "INV-005",
    client: "شركة الإبداع",
    amount: "9,200 ريال",
    status: "مدفوعة جزئيا",
    statusTone: "bg-(--dash-panel-glass) text-(--dash-muted)",
    date: "2026-01-13",
  },
];

const page = () => {
  const [invoiceQuery, setInvoiceQuery] = useState("");
  const maxProduct = Math.max(...topProducts.map((item) => item.value));
  const maxSales = Math.max(...revenuePoints.map((item) => item.sales));
  const chartWidth = 320;
  const chartHeight = 160;
  const chartPaddingY = 16;
  const chartPlotHeight = chartHeight - chartPaddingY * 2;

  const buildSmoothPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) {
      return "";
    }
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }
    const path = [`M ${points[0].x} ${points[0].y}`];
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const current = points[i];
      const midX = (prev.x + current.x) / 2;
      path.push(`Q ${midX} ${prev.y} ${current.x} ${current.y}`);
    }
    return path.join(" ");
  };

  const salesPoints = revenuePoints.map((point, index) => {
    const x = (index / (revenuePoints.length - 1)) * chartWidth;
    const y = chartHeight - chartPaddingY - (point.sales / maxSales) * chartPlotHeight;
    return { x, y };
  });

  const profitPoints = revenuePoints.map((point, index) => {
    const x = (index / (revenuePoints.length - 1)) * chartWidth;
    const y = chartHeight - chartPaddingY - (point.profit / maxSales) * chartPlotHeight;
    return { x, y };
  });

  const filteredInvoices = useMemo(() => {
    const query = invoiceQuery.trim().toLowerCase();
    if (!query) {
      return invoices;
    }
    return invoices.filter((item) => {
      const haystack = [
        item.id,
        item.client,
        item.amount,
        item.status,
        item.date,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [invoiceQuery]);

  return (
    <DashboardShell
      title="لوحة التحكم"
      subtitle="نظرة عامة على أداء الأعمال"
      searchValue={invoiceQuery}
      onSearchChange={setInvoiceQuery}
      searchPlaceholder="بحث في الفواتير بالرقم أو العميل أو الحالة..."
      exportData={{
        filename: "dashboard-invoices",
        headers: ["رقم الفاتورة", "العميل", "المبلغ", "الحالة", "التاريخ"],
        rows: filteredInvoices.map((item) => [item.id, item.client, item.amount, item.status, item.date]),
      }}
    >
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-6 shadow-(--dash-shadow)"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-2xl bg-(--dash-panel-glass) p-3 text-(--dash-primary)">
                  {item.icon}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    item.positive ? "text-(--dash-success)" : "text-(--dash-danger)"
                  }`}
                >
                  {item.change}
                </span>
              </div>
              <p className="mt-6 text-sm text-(--dash-muted)">{item.title}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-6 shadow-(--dash-shadow)">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-(--dash-danger-soft) px-3 py-1 text-sm font-semibold text-(--dash-danger)">
                3
              </span>
              <h2 className="text-lg font-semibold">التنبيهات الهامة</h2>
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
            {notifications.map((note) => (
              <div
                key={note.text}
                className={`flex items-center justify-between rounded-2xl border p-4 text-sm text-(--dash-text) ${note.tone}`}
              >
                <p>{note.text}</p>
                <button
                  type="button"
                  className="rounded-xl border border-(--dash-border) bg-(--dash-panel-glass) px-4 py-2 text-xs text-(--dash-text)"
                >
                  عرض
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">أفضل المنتجات مبيعا</h2>
            <span className="text-xs text-(--dash-muted)">آخر 6 أشهر</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-4">
            {topProducts.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end rounded-2xl bg-(--dash-panel-soft) px-3 py-4">
                  <div
                    className="h-full w-full rounded-xl bg-linear-to-t from-(--dash-primary-strong) to-(--dash-primary) shadow-(--dash-primary-soft)"
                    style={{ height: `${(item.value / maxProduct) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-(--dash-muted)">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">إجمالي الإيرادات (آخر 6 أشهر)</h2>
            <span className="text-xs text-(--dash-muted)">تم التحديث</span>
          </div>
          <div className="mt-6">
            <div className="relative rounded-2xl bg-(--dash-panel-soft) px-6 py-4">
              <div className="absolute left-5 top-4 flex h-40 flex-col justify-between text-[10px] text-(--dash-muted-2)">
                {[maxSales, Math.round(maxSales * 0.75), Math.round(maxSales * 0.5), Math.round(maxSales * 0.25), 0].map(
                  (value) => (
                    <span key={value}>{value.toLocaleString()}</span>
                  )
                )}
              </div>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-48 w-full">
                <defs>
                  <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--dash-primary)" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="var(--dash-primary)" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="profitFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--dash-success)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--dash-success)" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((line) => {
                  const y = chartHeight - chartPaddingY - (line / 4) * chartPlotHeight;
                  return (
                    <line
                      key={line}
                      x1="0"
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="var(--dash-border)"
                      strokeDasharray="4 6"
                    />
                  );
                })}
                <path
                  d={`${buildSmoothPath(salesPoints)} L ${chartWidth} ${chartHeight - chartPaddingY} L 0 ${
                    chartHeight - chartPaddingY
                  } Z`}
                  fill="url(#salesFill)"
                />
                <path
                  d={`${buildSmoothPath(profitPoints)} L ${chartWidth} ${chartHeight - chartPaddingY} L 0 ${
                    chartHeight - chartPaddingY
                  } Z`}
                  fill="url(#profitFill)"
                />
                <path d={buildSmoothPath(salesPoints)} fill="none" stroke="var(--dash-primary)" strokeWidth="3" />
                <path d={buildSmoothPath(profitPoints)} fill="none" stroke="var(--dash-success)" strokeWidth="3" />
                {salesPoints.map((point, index) => (
                  <circle key={`sales-${index}`} cx={point.x} cy={point.y} r="3" fill="var(--dash-primary)" />
                ))}
                {profitPoints.map((point, index) => (
                  <circle key={`profit-${index}`} cx={point.x} cy={point.y} r="3" fill="var(--dash-success)" />
                ))}
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-(--dash-muted)">
              {revenuePoints.map((point) => (
                <span key={point.month}>{point.month}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">أحدث الفواتير</h2>
            <button
              type="button"
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
            >
              عرض التقرير
            </button>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-(--dash-border)">
            <div className="grid grid-cols-6 gap-4 border-b border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3 text-xs font-semibold text-(--dash-muted)">
              <span className="text-right">رقم الفاتورة</span>
              <span className="text-right">العميل</span>
              <span className="text-right">المبلغ</span>
              <span className="text-right">الحالة</span>
              <span className="text-right">التاريخ</span>
              <span className="text-right">الإجراءات</span>
            </div>
            {filteredInvoices.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-6 gap-4 border-b border-(--dash-border) px-4 py-3 text-sm text-(--dash-text) last:border-b-0"
              >
                <span>{item.id}</span>
                <span>{item.client}</span>
                <span>{item.amount}</span>
                <span className="flex">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.statusTone}`}>
                    {item.status}
                  </span>
                </span>
                <span className="text-(--dash-muted)">{item.date}</span>
                <button type="button" className="text-xs text-(--dash-primary) hover:underline">
                  عرض
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default page;
