"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

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
const profitSeries = salesSeries.map((value, index) => value - costSeries[index]);

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
  const [currency, setCurrency] = useState("ريال سعودي - SAR");
  const [activeTab, setActiveTab] = useState("تقرير المبيعات");
  const [reportViewKey, setReportViewKey] = useState(0);

  const stats = useMemo(
    () => [
      {
        label: "إجمالي المبيعات",
        value: "328,000 ريال",
        tone: "text-(--dash-primary)",
        iconTone: "bg-blue-100 text-blue-600",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 3a1 1 0 0 1 1 1v1.1a6.5 6.5 0 0 1 4.5 2.1l-1.4 1.4A4.5 4.5 0 0 0 13 6.1V9h2a1 1 0 1 1 0 2h-2v1.9a2.5 2.5 0 0 0 2.5 2.5H16a1 1 0 1 1 0 2h-.5A4.5 4.5 0 0 1 12 15.4V11H10a1 1 0 1 1 0-2h2V6.1a4.5 4.5 0 0 0-3.1 1.3L7.5 6A6.5 6.5 0 0 1 11 4.1V3a1 1 0 0 1 1-1Z"
            />
          </svg>
        ),
      },
      {
        label: "صافي الأرباح",
        value: "96,500 ريال",
        tone: "text-(--dash-success)",
        iconTone: "bg-emerald-100 text-emerald-600",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path fill="currentColor" d="M5 18h14v2H5v-2Zm1-6 4 4 4-6 4 3-1 1.7-3-2.2-4 6-5-5L6 12Z" />
          </svg>
        ),
      },
      {
        label: "عدد الفواتير",
        value: "156",
        tone: "text-(--dash-warning)",
        iconTone: "bg-amber-100 text-amber-600",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path fill="currentColor" d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1v5h5" />
          </svg>
        ),
      },
      {
        label: "عدد العملاء",
        value: "42",
        tone: "text-(--dash-info)",
        iconTone: "bg-emerald-100 text-emerald-600",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
            />
          </svg>
        ),
      },
    ],
    []
  );

  const salesTableRows = rows.map((row) => [
    row.month,
    formatCurrency(row.sales),
    formatCurrency(row.cost),
    formatCurrency(row.profit),
    row.margin,
  ]);

  const tabs = ["تقرير المبيعات", "تقرير الأرباح", "تقرير العملاء", "تقرير المنتجات"];
  const isSalesTab = activeTab === "تقرير المبيعات";
  const isProfitTab = activeTab === "تقرير الأرباح";
  const isCustomersTab = activeTab === "تقرير العملاء";
  const isProductsTab = activeTab === "تقرير المنتجات";

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setReportViewKey((prev) => prev + 1);
  };

  const sharedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { rtl: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "rgba(148,163,184,0.35)", borderDash: [4, 4] },
        ticks: { color: "#94a3b8" },
      },
    },
  } as const;

  const salesBarData = {
    labels: months,
    datasets: [
      {
        label: "مبيعات",
        data: salesSeries,
        backgroundColor: "#2563eb",
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  };

  const salesLineData = {
    labels: months,
    datasets: [
      {
        label: "مبيعات",
        data: salesSeries,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.18)",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#2563eb",
        pointRadius: 4,
        tension: 0.35,
      },
      {
        label: "تكلفة",
        data: costSeries,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.2)",
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#f59e0b",
        pointRadius: 4,
        tension: 0.35,
      },
    ],
  };

  const profitBarData = {
    labels: months,
    datasets: [
      {
        label: "مبيعات",
        data: salesSeries,
        backgroundColor: "#2563eb",
        borderRadius: 10,
      },
      {
        label: "تكلفة",
        data: costSeries,
        backgroundColor: "#f59e0b",
        borderRadius: 10,
      },
      {
        label: "أرباح",
        data: profitSeries,
        backgroundColor: "#22c55e",
        borderRadius: 10,
      },
    ],
  };

  const customerLabels = ["شركة النور", "مؤسسة الأمل", "شركة المستقبل", "مؤسسة التقدم", "آخرون"];
  const customerValues = [125000, 98000, 185000, 76000, 120000];
  const customerColors = ["#2563eb", "#16a34a", "#f59e0b", "#8b5cf6", "#ec4899"];
  const customersPieData = {
    labels: customerLabels,
    datasets: [
      {
        data: customerValues,
        backgroundColor: customerColors,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const productLabels = ["إلكترونيات (45%)", "أغذية (25%)", "ملابس (15%)", "أدوات منزلية (15%)"];
  const productValues = [45, 25, 15, 15];
  const productColors = ["#2563eb", "#16a34a", "#f59e0b", "#8b5cf6"];
  const productsPieData = {
    labels: productLabels,
    datasets: [
      {
        data: productValues,
        backgroundColor: productColors,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const customersPieOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 24,
    },
    animation: {
      duration: 1400,
      easing: "easeOutQuart",
    },
    animations: {
      numbers: {
        type: "number",
        properties: ["circumference", "endAngle", "startAngle"] as string[],
        duration: 1400,
        delay: (context: { dataIndex?: number }) => (context.dataIndex ?? 0) * 180,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: { rtl: true },
    },
  };

  const createPieLabelPlugin = (id: string) => ({
    id,
    afterDatasetsDraw: (chart: any) => {
      const { ctx, data } = chart;
      const dataset = data.datasets?.[0];
      const meta = chart.getDatasetMeta(0);
      if (!meta || !dataset) {
        return;
      }

      const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + height, r);
        ctx.arcTo(x + width, y + height, x, y + height, r);
        ctx.arcTo(x, y + height, x, y, r);
        ctx.arcTo(x, y, x + width, y, r);
        ctx.closePath();
      };

      ctx.save();
      ctx.font = "600 12px 'Segoe UI', Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      meta.data.forEach((arc: any, index: number) => {
        const angle = (arc.startAngle + arc.endAngle) / 2;
        const radius = arc.outerRadius + 22;
        const x = arc.x + Math.cos(angle) * radius;
        const y = arc.y + Math.sin(angle) * radius;
        const label = data.labels?.[index] ?? "";
        const color = dataset.backgroundColor?.[index] ?? "#111827";

        const metrics = ctx.measureText(label);
        const paddingX = 8;
        const paddingY = 4;
        const boxWidth = metrics.width + paddingX * 2;
        const boxHeight = 20;
        const boxX = x - boxWidth / 2;
        const boxY = y - boxHeight / 2;

        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.strokeStyle = "rgba(15,23,42,0.1)";
        drawRoundedRect(boxX, boxY, boxWidth, boxHeight, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillText(label, x, y + 1);
      });

      ctx.restore();
    },
  });

  const productLabelPlugin = createPieLabelPlugin("productPieLabels");
  const customerLabelPlugin = createPieLabelPlugin("customerPieLabels");

  return (
    <DashboardShell
      title="التقارير"
      subtitle="تقارير وتحليلات الأعمال"
      searchPlaceholder="بحث سريع عن العملاء، المنتجات، الفواتير..."
      hideHeaderFilters
      headerActionAlign="left"
      headerAction={
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text)"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm13 8H4v9h16v-9Z"
              />
            </svg>
            اختر الفترة
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text) hover:border-(--dash-primary) hover:bg-(--dash-panel)"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V7h3.5L14 3.5Z"
              />
            </svg>
            تصدير التقرير
          </button>
          <select
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
            className="dash-select rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) hover:border-(--dash-primary) hover:bg-(--dash-panel)"
          >
            <option>ريال سعودي - SAR</option>
            <option>دولار أمريكي - USD</option>
            <option>يورو - EUR</option>
          </select>
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="dash-select rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) hover:border-(--dash-primary) hover:bg-(--dash-panel)"
          >
            <option>هذا الشهر</option>
            <option>هذا الربع</option>
            <option>هذا العام</option>
          </select>
        </div>
      }
    >
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-5 shadow-sm"
          >
            <div>
              <p className="text-xs text-(--dash-muted)">{stat.label}</p>
              <p className={`mt-2 text-lg font-semibold ${stat.tone}`}>{stat.value}</p>
            </div>
            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${stat.iconTone}`}>
              {stat.icon}
            </span>
          </div>
        ))}
      </section>

      <section className="mb-6 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-3">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab
                  ? "border-(--dash-primary) bg-(--dash-primary) text-white"
                  : "border-(--dash-border) bg-(--dash-panel-soft) text-(--dash-muted) hover:border-(--dash-primary) hover:bg-(--dash-panel)"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {isSalesTab ? (
        <section key={`sales-${reportViewKey}`} className="grid gap-4 lg:grid-cols-2">
          <div className="dash-card animate-report-slide">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-(--dash-text)">المبيعات الشهرية</h3>
              <button
                type="button"
                onClick={() =>
                  exportCsv("monthly-sales.csv", ["الشهر", "المبيعات"], months.map((m, i) => [m, salesSeries[i]]))
                }
                className="dash-filter border border-(--dash-border) bg-(--dash-panel-soft) hover:border-(--dash-primary) hover:bg-(--dash-panel)"
              >
                PDF
              </button>
            </div>
            <div className="relative h-56 rounded-2xl bg-(--dash-panel-soft) p-4">
              <Bar data={salesBarData} options={sharedOptions} />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-(--dash-muted)">
              <span className="h-2 w-2 rounded-full bg-(--dash-primary)" />
              <span>مبيعات</span>
            </div>
          </div>

          <div className="dash-card animate-report-slide" style={{ animationDelay: "120ms" }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-(--dash-text)">المبيعات والتكاليف</h3>
              <button
                type="button"
                onClick={() =>
                  exportCsv(
                    "sales-costs.csv",
                    ["الشهر", "المبيعات", "التكاليف"],
                    months.map((m, i) => [m, salesSeries[i], costSeries[i]])
                  )
                }
                className="dash-filter border border-(--dash-border) bg-(--dash-panel-soft) hover:border-(--dash-primary) hover:bg-(--dash-panel)"
              >
                CSV
              </button>
            </div>
            <div className="relative h-56 rounded-2xl bg-(--dash-panel-soft) p-4">
              <Line data={salesLineData} options={sharedOptions} />
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
      ) : isProfitTab ? (
        <section key={`profit-${reportViewKey}`} className="dash-card animate-report-slide">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-(--dash-text)">تحليل الأرباح (WAC)</h3>
            <button
              type="button"
              onClick={() =>
                exportCsv(
                  "profit-analysis.csv",
                  ["الشهر", "المبيعات", "التكاليف", "الأرباح"],
                  months.map((m, i) => [m, salesSeries[i], costSeries[i], profitSeries[i]])
                )
              }
              className="dash-filter border border-(--dash-border) bg-(--dash-panel-soft) hover:border-(--dash-primary) hover:bg-(--dash-panel)"
            >
              تصدير
            </button>
          </div>
          <div className="relative h-56 rounded-2xl bg-(--dash-panel-soft) p-4">
            <Bar data={profitBarData} options={sharedOptions} />
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-(--dash-muted)">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>مبيعات</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>تكلفة</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>أرباح</span>
            </div>
          </div>
        </section>
      ) : isCustomersTab ? (
        <section key={`customers-${reportViewKey}`} className="grid gap-4 lg:grid-cols-2">
          <div className="dash-card animate-report-slide lg:order-2">
            <h3 className="mb-4 text-sm font-semibold text-(--dash-text)">أفضل العملاء</h3>
            <div className="flex h-72 items-center justify-center">
              <Pie
                key={`customers-pie-${reportViewKey}`}
                data={customersPieData}
                options={customersPieOptions}
                plugins={[customerLabelPlugin]}
              />
            </div>
          </div>
          <div className="dash-card animate-report-slide lg:order-1" style={{ animationDelay: "120ms" }}>
            <h3 className="mb-4 text-sm font-semibold text-(--dash-text)">قائمة أفضل العملاء</h3>
            <div className="space-y-4">
              {customerLabels.map((label, index) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: customerColors[index] }}>
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-(--dash-text)">
                    {customerValues[index].toLocaleString("en-US")} ريال
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : isProductsTab ? (
        <section key={`products-${reportViewKey}`} className="grid gap-4 lg:grid-cols-2">
          <div className="dash-card animate-report-slide lg:order-2">
            <h3 className="mb-4 text-sm font-semibold text-(--dash-text)">توزيع المبيعات حسب الفئات</h3>
            <div className="flex h-72 items-center justify-center">
              <Pie
                key={`products-pie-${reportViewKey}`}
                data={productsPieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  layout: {
                    padding: 24,
                  },
                  animation: {
                    duration: 1400,
                    easing: "easeOutQuart",
                  },
                  animations: {
                    numbers: {
                      type: "number",
                      properties: ["circumference", "endAngle", "startAngle"],
                      duration: 1400,
                      delay: (context: { dataIndex?: number }) => (context.dataIndex ?? 0) * 160,
                    },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: { rtl: true },
                  },
                }}
                plugins={[productLabelPlugin]}
              />
            </div>
          </div>
          <div className="dash-card animate-report-slide lg:order-1" style={{ animationDelay: "120ms" }}>
            <h3 className="mb-4 text-sm font-semibold text-(--dash-text)">إحصائيات المنتجات</h3>
            <div className="space-y-4">
              <div className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4">
                <p className="text-sm text-(--dash-muted)">إجمالي المنتجات</p>
                <p className="mt-2 text-2xl font-semibold text-(--dash-text)">248</p>
              </div>
              <div className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4">
                <p className="text-sm text-(--dash-muted)">الأكثر مبيعاً</p>
                <p className="mt-2 text-base font-semibold text-(--dash-text)">لابتوب HP EliteBook</p>
                <p className="mt-1 text-sm text-(--dash-muted)">125 وحدة</p>
              </div>
              <div className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4">
                <p className="text-sm text-(--dash-muted)">الأكثر ربحية</p>
                <p className="mt-2 text-base font-semibold text-(--dash-text)">شاشة Dell 27 بوصة</p>
                <p className="mt-1 text-sm text-emerald-600">هامش ربح 35%</p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="dash-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-(--dash-text)">{activeTab}</h3>
            <button type="button" onClick={() => handleTabClick("تقرير المبيعات")} className="dash-filter">
              عرض تقرير المبيعات
            </button>
          </div>
          <p className="mt-3 text-sm text-(--dash-muted)">لا يوجد بيانات لهذا التقرير حالياً.</p>
        </section>
      )}

      {isSalesTab && (
        <section className="dash-card mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-(--dash-text)">ملخص تقرير المبيعات</h3>
            <button
              type="button"
              onClick={() =>
                exportCsv(
                  "sales-report.csv",
                  ["الشهر", "المبيعات", "التكاليف", "الأرباح", "الهامش"],
                  salesTableRows
                )
              }
              className="dash-filter"
            >
              تحميل CSV
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-(--dash-border)">
            <div className="grid grid-cols-5 gap-2 bg-(--dash-panel-soft) px-4 py-3 text-xs text-(--dash-muted)">
              <span>الشهر</span>
              <span>المبيعات</span>
              <span>التكاليف</span>
              <span>الأرباح</span>
              <span>الهامش</span>
            </div>
            {rows.map((row) => (
              <div
                key={row.month}
                className="grid grid-cols-5 gap-2 border-t border-(--dash-border) px-4 py-3 text-sm"
              >
                <span>{row.month}</span>
                <span>{formatCurrency(row.sales)}</span>
                <span>{formatCurrency(row.cost)}</span>
                <span>{formatCurrency(row.profit)}</span>
                <span>{row.margin}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </DashboardShell>
  );
};

export default page;
