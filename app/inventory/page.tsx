import DashboardShell from "../components/DashboardShell";

const page = () => {
  return (
    <DashboardShell title="المخزون" subtitle="حالة المخزون والتنبيهات الحرجة">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">مستويات المخزون</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            اعرض المنتجات التي اقتربت من الحد الأدنى.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">تنبيهات فورية</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            جهّز طلبات إعادة التوريد بوقت كافٍ.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
};

export default page;
