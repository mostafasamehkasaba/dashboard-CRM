import DashboardShell from "../components/DashboardShell";

const page = () => {
  return (
    <DashboardShell title="المستخدمون" subtitle="إدارة الصلاحيات والحسابات">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">الحسابات النشطة</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            اطّلع على المستخدمين النشطين وأدوارهم الحالية.
          </p>
        </div>
        <div className="rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-panel-soft)] p-6 shadow-lg shadow-[var(--dash-shadow)]">
          <h2 className="text-lg font-semibold">إضافة مستخدم</h2>
          <p className="mt-2 text-sm text-[var(--dash-muted)]">
            أنشئ حساباً جديداً وحدد الصلاحيات المناسبة.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
};

export default page;
