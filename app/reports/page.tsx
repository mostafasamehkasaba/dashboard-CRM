"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type MonthlyRow = {
  month: string;
  sales: number;
  cost: number;
  profit: number;
  margin: string;
};

const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"];
const salesSeries = [45000, 52000, 48000, 61000, 55000, 67000];
const costSeries = [32000, 38000, 35000, 42000, 40000, 45000];

const rows: MonthlyRow[] = months.map((month, index) => {
  const sales = salesSeries[index];
  const cost = costSeries[index];
  const profit = sales - cost;
  const margin = `${((profit / sales) * 100).toFixed(1)}%`;
  return { month, sales, cost, profit, margin };
});

const formatCurrency = (value: number) => `${value.toLocaleString("en-US")} ريال`;

const exportCsv = (filename: string, headers: string[], dataRows: (string | number)[][]) => {
  const csvLines = [headers.join(","), ...dataRows.map((row) => row.join(","))].join("\n");
  const blob = new Blob(["\ufeff", csvLines], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const page = () => {
  const [period, setPeriod] = useState("هذا الشهر");
  const [currency, setCurrency] = useState("ريال - SAR");
  const [activeTab, setActiveTab] = useState("تقارير المبيعات");

  const stats = useMemo(() => {
    const totalSales = salesSeries.reduce((sum, value) => sum + value, 0);
    const totalCost = costSeries.reduce((sum, value) => sum + value, 0);
    const totalProfit = totalSales - totalCost;
    return [
      {
        label: "إجمالي المبيعات",
        value: formatCurrency(totalSales),
        tone: "text-(--dash-primary)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M12 3a1 1 0 0 1 1 1v1.1a6.5 6.5 0 0 1 4.5 2.1l-1.4 1.4A4.5 4.5 0 0 0 13 6.1V9h2a1 1 0 1 1 0 2h-2v1.9a2.5 2.5 0 0 0 2.5 2.5H16a1 1 0 1 1 0 2h-.5A4.5 4.5 0 0 1 12 15.4V11H10a1 1 0 1 1 0-2h2V6.1a4.5 4.5 0 0 0-3.1 1.3L7.5 6A6.5 6.5 0 0 1 11 4.1V3a1 1 0 0 1 1-1Z"
            />
          </svg>
        ),
      },
      {
        label: "صافي الأرباح",
        value: formatCurrency(totalProfit),
        tone: "text-(--dash-success)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M7 13.5 10.5 17 17 8.5l-1.4-1.4-5.1 6.6-2.1-2.3Z" />
          </svg>
        ),
      },
      {
        label: "عدد الفواتير",
        value: "156",
        tone: "text-(--dash-info)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1v5h5" />
          </svg>
        ),
      },
      {
        label: "عدد العملاء",
        value: "42",
        tone: "text-(--dash-warning)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-11 9a7 7 0 0 1 14 0H5Z" />
          </svg>
        ),
      },
    ];
  }, []);

  const salesTableRows = rows.map((row) => [
    row.month,
    formatCurrency(row.sales),
    formatCurrency(row.cost),
    formatCurrency(row.profit),
    row.margin,
  ]);

  const isSalesTab = activeTab === "تقارير المبيعات";

  return (
    <DashboardShell
      title="التقارير"
      subtitle="تقارير وتحليلات الأعمال"
      searchPlaceholder="بحث سريع عن العملاء، المنتجات، الفواتير..."
      headerAction={
        <div className="flex items-center gap-2">
          <select value={period} onChange={(event) => setPeriod(event.target.value)} className="dash-select">
            <option>هذا الشهر</option>
            <option>هذا الربع</option>
            <option>هذا العام</option>
          </select>
          <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="dash-select">
            <option>ريال - SAR</option>
            <option>دولار - USD</option>
          </select>
          <button type="button" className="dash-filter">
            اختر الفترة
          </button>
        </div>
      }
    >
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="dash-card flex items-center justify-between">
            <div>
              <p className="text-xs text-(--dash-muted)">{stat.label}</p>
              <p className={`mt-2 text-lg font-semibold ${stat.tone}`}>{stat.value}</p>
            </div>
            <span className={`dash-icon ${stat.tone}`}>{stat.icon}</span>
          </div>
        ))}
      </section>

      <section className="mb-6 flex flex-wrap items-center gap-2">
        {["تقارير المبيعات", "تقارير المنتجات", "تقارير العملاء", "تقارير المصروفات"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              activeTab === tab
                ? "bg-(--dash-primary) text-white"
                : "border border-(--dash-border) bg-(--dash-panel-soft) text-(--dash-muted)"
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      {isSalesTab ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="dash-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-(--dash-text)">المبيعات الشهرية</h3>
              <button
                type="button"
                onClick={() =>
                  exportCsv("monthly-sales.csv", ["الشهر", "المبيعات"], months.map((m, i) => [m, salesSeries[i]]))
                }
                className="dash-filter"
              >
                PDF
              </button>
            </div>
            <div className="flex h-52 items-end gap-4">
              {salesSeries.map((value, index) => (
                <div key={months[index]} className="flex-1">
                  <div
                    className="rounded-t-xl bg-(--dash-primary)"
                    style={{ height: `${(value / 70000) * 100}%` }}
                  />
                  <p className="mt-2 text-center text-[11px] text-(--dash-muted)">{months[index]}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-(--dash-muted)">
              <span className="h-2 w-2 rounded-full bg-(--dash-primary)" />
              <span>مبيعات</span>
            </div>
          </div>

          <div className="dash-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-(--dash-text)">المبيعات والتكاليف</h3>
              <button
                type="button"
                onClick={() =>
                  exportCsv(
                    "sales-costs.csv",
                    ["الشهر", "المبيعات", "التكلفة"],
                    months.map((m, i) => [m, salesSeries[i], costSeries[i]])
                  )
                }
                className="dash-filter"
              >
                CSV
              </button>
            </div>
            <div className="relative h-52">
              <svg viewBox="0 0 300 160" className="h-full w-full">
                <polyline
                  points="10,110 60,98 110,105 160,85 210,95 260,75"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
                <polyline
                  points="10,125 60,118 110,120 160,110 210,112 260,102"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                {[10, 60, 110, 160, 210, 260].map((x) => (
                  <circle
                    key={x}
                    cx={x}
                    cy={x === 260 ? 75 : x === 210 ? 95 : x === 160 ? 85 : x === 110 ? 105 : x === 60 ? 98 : 110}
                    r="3"
                    fill="#2563eb"
                  />
                ))}
              </svg>
              <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2 text-[11px] text-(--dash-muted)">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-(--dash-muted)">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-(--dash-primary)" />
                <span>مبيعات</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-(--dash-warning)" />
                <span>تكلفة</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="dash-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-(--dash-text)">{activeTab}</h3>
            <button type="button" onClick={() => setActiveTab("تقارير المبيعات")} className="dash-filter">
              عرض المبيعات
            </button>
          </div>
          <p className="mt-3 text-sm text-(--dash-muted)">لا توجد بيانات مفصلة لهذا القسم حتى الآن.</p>
        </section>
      )}

      {isSalesTab && (
        <section className="dash-card mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-(--dash-text)">ملخص المبيعات الشهرية</h3>
            <button
              type="button"
              onClick={() =>
                exportCsv(
                  "sales-summary.csv",
                  ["الشهر", "المبيعات", "التكلفة", "الربح", "هامش الربح"],
                  rows.map((row) => [row.month, row.sales, row.cost, row.profit, row.margin])
                )
              }
              className="dash-filter"
            >
              تصدير
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-(--dash-muted)">
                <tr>
                  <th className="px-3 py-3 text-right">الشهر</th>
                  <th className="px-3 py-3 text-right">المبيعات</th>
                  <th className="px-3 py-3 text-right">التكلفة</th>
                  <th className="px-3 py-3 text-right">الربح</th>
                  <th className="px-3 py-3 text-right">هامش الربح</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.month} className="border-t border-(--dash-border)">
                    <td className="px-3 py-4 text-(--dash-text)">{row.month}</td>
                    <td className="px-3 py-4 text-(--dash-muted)">{formatCurrency(row.sales)}</td>
                    <td className="px-3 py-4 text-(--dash-muted)">{formatCurrency(row.cost)}</td>
                    <td className="px-3 py-4 text-(--dash-success)">{formatCurrency(row.profit)}</td>
                    <td className="px-3 py-4 text-(--dash-text)">{row.margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </DashboardShell>
  );
};

export default page;
