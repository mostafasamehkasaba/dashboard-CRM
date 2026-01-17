import DashboardShell from "../components/DashboardShell";

const page = () => {
  return (
    <DashboardShell title="التقارير" subtitle="تقارير الأداء والإيرادات">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">تقارير جاهزة</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            اختر من التقارير المخصصة للأداء والمبيعات.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">تحليل مخصص</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            أنشئ تقريراً مخصصاً للفترات والفرق المختلفة.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
};

export default page;
