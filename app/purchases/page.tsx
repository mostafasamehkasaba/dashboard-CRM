import DashboardShell from "../components/DashboardShell";

const page = () => {
  return (
    <DashboardShell title="المشتريات" subtitle="طلبات الشراء والموافقات">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">طلبات معلّقة</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            راجع طلبات الشراء التي تحتاج موافقة سريعة.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">فواتير الموردين</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            تابع فواتير الموردين القادمة ومواعيد السداد.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
};

export default page;
