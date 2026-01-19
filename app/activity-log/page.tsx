"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type ActivityAction = "إضافة" | "تعديل" | "حذف" | "تسجيل دخول";
type ActivitySection = "المستخدمين" | "العملاء" | "الفواتير" | "المدفوعات" | "المشتريات" | "المحافظ";

type ActivityRecord = {
  id: string;
  user: string;
  section: ActivitySection;
  action: ActivityAction;
  description: string;
  date: string;
  time: string;
  ip: string;
};

const sections: Array<ActivitySection | "الكل"> = [
  "الكل",
  "المستخدمين",
  "العملاء",
  "الفواتير",
  "المدفوعات",
  "المشتريات",
  "المحافظ",
];

const actions: Array<ActivityAction | "الكل"> = ["الكل", "إضافة", "تعديل", "حذف", "تسجيل دخول"];

const users = ["الكل", "أحمد محمد", "سارة علي", "خالد حسن", "ريم عمر"];

const activityRecords: ActivityRecord[] = [
  {
    id: "ACT-001",
    user: "أحمد محمد",
    section: "المستخدمين",
    action: "إضافة",
    description: "إضافة مستخدم جديد باسم عبدالرحمن الغامدي",
    date: "2026-01-16",
    time: "10:15",
    ip: "192.168.1.100",
  },
  {
    id: "ACT-002",
    user: "سارة علي",
    section: "الفواتير",
    action: "تعديل",
    description: "تعديل فاتورة INV-209 وتحديث طريقة الدفع",
    date: "2026-01-16",
    time: "11:05",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-003",
    user: "خالد حسن",
    section: "المدفوعات",
    action: "حذف",
    description: "حذف عملية دفع PAY-332 بسبب تكرار الإدخال",
    date: "2026-01-16",
    time: "11:40",
    ip: "192.168.1.88",
  },
  {
    id: "ACT-004",
    user: "أحمد محمد",
    section: "المشتريات",
    action: "إضافة",
    description: "إضافة طلب شراء PUR-104 بقيمة 24,500 ر.س",
    date: "2026-01-16",
    time: "12:10",
    ip: "192.168.1.100",
  },
  {
    id: "ACT-005",
    user: "ريم عمر",
    section: "المحافظ",
    action: "تعديل",
    description: "تحديث رصيد محفظة البنك الأهلي بعد إيداع جديد",
    date: "2026-01-16",
    time: "12:55",
    ip: "192.168.1.112",
  },
  {
    id: "ACT-006",
    user: "سارة علي",
    section: "العملاء",
    action: "إضافة",
    description: "إضافة عميل جديد باسم مؤسسة مدار التقنية",
    date: "2026-01-16",
    time: "13:20",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-007",
    user: "خالد حسن",
    section: "المدفوعات",
    action: "تعديل",
    description: "تعديل حالة السداد لدفعة PAY-228",
    date: "2026-01-16",
    time: "14:05",
    ip: "192.168.1.88",
  },
  {
    id: "ACT-008",
    user: "أحمد محمد",
    section: "المستخدمين",
    action: "إضافة",
    description: "إضافة صلاحية جديدة لمدير النظام",
    date: "2026-01-16",
    time: "14:30",
    ip: "192.168.1.100",
  },
];

const actionBadge = (action: ActivityAction) => {
  if (action === "إضافة") {
    return "bg-(--dash-success) text-white";
  }
  if (action === "تعديل") {
    return "bg-(--dash-warning) text-white";
  }
  if (action === "حذف") {
    return "bg-(--dash-danger) text-white";
  }
  return "bg-(--dash-primary) text-white";
};

const page = () => {
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<ActivitySection | "الكل">("الكل");
  const [actionFilter, setActionFilter] = useState<ActivityAction | "الكل">("الكل");
  const [userFilter, setUserFilter] = useState("الكل");
  const [timeFilter, setTimeFilter] = useState("اليوم");

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return activityRecords.filter((record) => {
      const matchesSection = sectionFilter === "الكل" || record.section === sectionFilter;
      const matchesAction = actionFilter === "الكل" || record.action === actionFilter;
      const matchesUser = userFilter === "الكل" || record.user === userFilter;
      const matchesQuery = normalizedQuery
        ? [record.user, record.section, record.action, record.description, record.ip]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      return matchesSection && matchesAction && matchesUser && matchesQuery;
    });
  }, [query, sectionFilter, actionFilter, userFilter]);

  const stats = useMemo(() => {
    const total = activityRecords.length;
    const added = activityRecords.filter((record) => record.action === "إضافة").length;
    const edited = activityRecords.filter((record) => record.action === "تعديل").length;
    const deleted = activityRecords.filter((record) => record.action === "حذف").length;
    return [
      { label: "إجمالي الأنشطة", value: total.toString(), tone: "text-(--dash-primary)" },
      { label: "عمليات الإضافة", value: added.toString(), tone: "text-(--dash-success)" },
      { label: "عمليات التعديل", value: edited.toString(), tone: "text-(--dash-warning)" },
      { label: "عمليات الحذف", value: deleted.toString(), tone: "text-(--dash-danger)" },
    ];
  }, []);

  return (
    <DashboardShell
      title="سجل الأنشطة"
      subtitle="عرض كل الحركات الخاصة بالحساب في لوحة التحكم"
      headerAction={
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
          >
            تحميل التقرير
          </button>
          <button
            type="button"
            className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
          >
            طباعة
          </button>
        </div>
      }
    >
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 shadow-(--dash-shadow)"
            >
              <div>
                <p className="text-sm text-(--dash-muted)">{item.label}</p>
                <p className={`mt-2 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
              </div>
              <span className={`rounded-2xl bg-(--dash-panel-glass) p-3 ${item.tone}`}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M4 6h16a2 2 0 0 1 2 2v2H2V8a2 2 0 0 1 2-2Zm-2 8h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4Zm5 2h6a1 1 0 0 0 0-2H7a1 1 0 0 0 0 2Z"
                  />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sectionFilter}
              onChange={(event) => setSectionFilter(event.target.value as ActivitySection | "الكل")}
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
            >
              {sections.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value as ActivityAction | "الكل")}
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
            >
              {actions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={userFilter}
              onChange={(event) => setUserFilter(event.target.value)}
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
            >
              {users.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="relative flex-1 min-w-[240px]">
              <svg viewBox="0 0 24 24" className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--dash-muted)">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 10-.7.7l.3.3v.8l4.5 4.5 1.3-1.3zM10.5 15a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"
                />
              </svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="بحث عن المستخدم أو العملية..."
                className="dash-input w-full rounded-xl border border-(--dash-border) pr-9"
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-(--dash-border)">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-(--dash-text)">السجل اليومي للنشاط</p>
                <p className="text-xs text-(--dash-muted)">تم تسجيل {filteredRecords.length} حركة</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={timeFilter}
                  onChange={(event) => setTimeFilter(event.target.value)}
                  className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-1.5 text-xs text-(--dash-text)"
                >
                  <option value="اليوم">اليوم</option>
                  <option value="هذا الأسبوع">هذا الأسبوع</option>
                  <option value="هذا الشهر">هذا الشهر</option>
                </select>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--dash-border) bg-(--dash-panel) text-(--dash-success)"
                  aria-label="إضافة فلتر سريع"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path fill="currentColor" d="M11 5h2v14h-2zM5 11h14v2H5z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="divide-y divide-(--dash-border)">
              {filteredRecords.map((record) => (
                <div key={record.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
                  <div className="min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-(--dash-text)">{record.user}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${actionBadge(record.action)}`}>
                        {record.action}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-(--dash-muted)">{record.description}</p>
                  </div>
                  <div className="min-w-[200px] text-xs text-(--dash-muted)">
                    <p className="font-semibold text-(--dash-text)">{record.section}</p>
                    <p className="mt-2">
                      {record.date} - {record.time}
                    </p>
                    <p className="mt-1">IP: {record.ip}</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-(--dash-border) px-3 py-1 text-xs text-(--dash-primary) hover:underline"
                  >
                    عرض
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default page;
