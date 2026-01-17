import DashboardShell from "../components/DashboardShell";

const page = () => {
  return (
    <DashboardShell title="المحافظ المالية" subtitle="إدارة المحافظ والتدفقات النقدية">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">الأرصدة الحالية</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            راقب الأرصدة والتدفقات الداخلة والخارجة.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">تحويلات سريعة</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            قم بتحويل بين المحافظ أو أضف مصدر تمويل جديد.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
};

export default page;
