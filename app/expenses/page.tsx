import DashboardShell from "../components/DashboardShell";

const page = () => {
  return (
    <DashboardShell title="المصروفات" subtitle="تتبع المصروفات التشغيلية">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">أعلى المصروفات</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            اعرض الفئات الأعلى إنفاقاً خلال الشهر الحالي.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">إضافة مصروف</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            سجّل مصروفات جديدة وتابع حالة الاعتماد.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
};

export default page;
