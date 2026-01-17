import DashboardShell from "../components/DashboardShell";

const page = () => {
  return (
    <DashboardShell title="سجل الأنشطة" subtitle="متابعة أحدث الأنشطة والتحديثات">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">آخر الأنشطة</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            استعرض أحدث التغييرات التي تمت داخل النظام.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">سجل الدخول</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            تتبّع عمليات تسجيل الدخول والتنبيهات الأمنية.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
};

export default page;
