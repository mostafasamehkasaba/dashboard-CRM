"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type UserRole = "مدير النظام" | "مشرف" | "محاسب" | "مشاهد";

type UserStatus = "نشط" | "غير نشط";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
};

const usersData: UserRow[] = [
  {
    id: "USR-001",
    name: "أحمد محمد",
    email: "ahmed@company.com",
    role: "مدير النظام",
    status: "نشط",
    lastLogin: "2026-01-15 14:30",
  },
  {
    id: "USR-002",
    name: "فاطمة علي",
    email: "fatima@company.com",
    role: "مشرف",
    status: "نشط",
    lastLogin: "2026-01-15 10:15",
  },
  {
    id: "USR-003",
    name: "محمد سعيد",
    email: "mohammed@company.com",
    role: "مشاهد",
    status: "نشط",
    lastLogin: "2026-01-14 16:45",
  },
  {
    id: "USR-004",
    name: "سارة أحمد",
    email: "sara@company.com",
    role: "محاسب",
    status: "غير نشط",
    lastLogin: "2026-01-10 09:30",
  },
];

const page = () => {
  const [activeTab, setActiveTab] = useState("المستخدمون");
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserRow[]>(usersData);
  const [showNewUser, setShowNewUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "مشاهد",
    status: "نشط",
  });

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === "نشط").length;
    const totalRoles = 4;
    const permissions = 7;
    return [
      { label: "إجمالي المستخدمين", value: totalUsers.toString(), tone: "text-(--dash-primary)" },
      { label: "المستخدمون النشطون", value: activeUsers.toString(), tone: "text-(--dash-success)" },
      { label: "الأدوار", value: totalRoles.toString(), tone: "text-(--dash-warning)" },
      { label: "الصلاحيات", value: permissions.toString(), tone: "text-(--dash-info)" },
    ];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users.filter((user) =>
      normalizedQuery
        ? [user.name, user.email, user.role].join(" ").toLowerCase().includes(normalizedQuery)
        : true
    );
  }, [users, query]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }
    const nextUser: UserRow = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role as UserRole,
      status: formData.status as UserStatus,
      lastLogin: "-",
    };
    setUsers((prev) => [nextUser, ...prev]);
    setShowNewUser(false);
    setFormData({ name: "", email: "", role: "مشاهد", status: "نشط" });
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setShowNewUser(false);
    }
  };

  const roleBadge = (role: UserRole) => {
    if (role === "مدير النظام") {
      return "bg-rose-50 text-rose-600";
    }
    if (role === "مشرف") {
      return "bg-blue-50 text-blue-600";
    }
    if (role === "محاسب") {
      return "bg-slate-100 text-slate-600";
    }
    return "bg-slate-100 text-slate-600";
  };

  const statusBadge = (status: UserStatus) =>
    status === "نشط" ? "bg-(--dash-primary) text-white" : "bg-slate-100 text-slate-600";

  return (
    <DashboardShell
      title="المستخدمون والصلاحيات"
      subtitle="إدارة المستخدمين والصلاحيات للوصول"
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="بحث عن الاسم أو البريد الإلكتروني..."
      headerAction={
        <button
          type="button"
          onClick={() => setShowNewUser(true)}
          className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
        >
          + مستخدم جديد
        </button>
      }
    >
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="dash-card flex items-center justify-between">
            <div>
              <p className="text-xs text-(--dash-muted)">{stat.label}</p>
              <p className={`mt-2 text-lg font-semibold ${stat.tone}`}>{stat.value}</p>
            </div>
            <span className="dash-icon">
              <svg viewBox="0 0 24 24" className={`h-5 w-5 ${stat.tone}`}>
                <path
                  fill="currentColor"
                  d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0H5Z"
                />
              </svg>
            </span>
          </div>
        ))}
      </section>

      <section className="dash-card mb-4">
        <div className="flex flex-wrap items-center gap-3 border-b border-(--dash-border) pb-4">
          <div className="flex items-center gap-4 text-xs text-(--dash-muted)">
            <button
              type="button"
              onClick={() => setActiveTab("المستخدمون")}
              className={`flex items-center gap-2 ${activeTab === "المستخدمون" ? "text-(--dash-text)" : "text-(--dash-muted)"}`}
            >
              <span
                className={`h-3 w-3 rounded-full border ${
                  activeTab === "المستخدمون" ? "border-(--dash-primary) bg-(--dash-primary)" : "border-(--dash-border)"
                }`}
              />
              المستخدمون
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("الأدوار والصلاحيات")}
              className={`flex items-center gap-2 ${
                activeTab === "الأدوار والصلاحيات" ? "text-(--dash-text)" : "text-(--dash-muted)"
              }`}
            >
              <span
                className={`h-3 w-3 rounded-full border ${
                  activeTab === "الأدوار والصلاحيات"
                    ? "border-(--dash-primary) bg-(--dash-primary)"
                    : "border-(--dash-border)"
                }`}
              />
              الأدوار والصلاحيات
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
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
              placeholder="بحث بالاسم أو البريد الإلكتروني"
              className="dash-input w-full rounded-xl border border-(--dash-border) pr-9"
            />
          </div>
          <button className="dash-filter">فلتر</button>
        </div>
      </section>

      <section className="dash-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-(--dash-muted)">
              <tr>
                <th className="px-3 py-3 text-right">الاسم</th>
                <th className="px-3 py-3 text-right">البريد الإلكتروني</th>
                <th className="px-3 py-3 text-right">الدور</th>
                <th className="px-3 py-3 text-right">الحالة</th>
                <th className="px-3 py-3 text-right">آخر دخول</th>
                <th className="px-3 py-3 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-(--dash-border)">
                  <td className="px-3 py-4 text-(--dash-text)">{user.name}</td>
                  <td className="px-3 py-4 text-(--dash-muted)">{user.email}</td>
                  <td className="px-3 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-(--dash-muted)">{user.lastLogin}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2 text-(--dash-muted)">
                      <button type="button" className="rounded-lg border border-(--dash-border) p-2">
                        <svg viewBox="0 0 24 24" className="h-4 w-4">
                          <path
                            fill="currentColor"
                            d="M4 16.8V20h3.2l9.4-9.4-3.2-3.2L4 16.8zm15.7-9.5c.4-.4.4-1 0-1.4l-1.6-1.6c-.4-.4-1-.4-1.4 0l-1.3 1.3 3.2 3.2z"
                          />
                        </svg>
                      </button>
                      <button type="button" className="rounded-lg border border-(--dash-border) p-2">
                        <svg viewBox="0 0 24 24" className="h-4 w-4">
                          <path
                            fill="currentColor"
                            d="M6 7h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm0-2a4 4 0 0 0-4 4v7a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4H6Z"
                          />
                        </svg>
                      </button>
                      <button type="button" className="rounded-lg border border-(--dash-border) p-2 text-rose-500">
                        <svg viewBox="0 0 24 24" className="h-4 w-4">
                          <path
                            fill="currentColor"
                            d="M6 7h12v2H6zm2 3h8l-1 10H9L8 10Zm3-6h2l1 2H10z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showNewUser && (
        <div className="dash-modal" onClick={handleOverlayClick}>
          <div className="dash-modal-body w-full max-w-2xl p-6">
            <div className="flex items-center justify-between border-b border-(--dash-border) pb-3">
              <div>
                <h3 className="text-sm font-semibold text-(--dash-text)">إضافة مستخدم جديد</h3>
                <p className="mt-1 text-xs text-(--dash-muted)">إنشاء مستخدم جديد وتحديد صلاحياته.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewUser(false)}
                className="rounded-lg border border-(--dash-border) px-2 py-1 text-xs text-(--dash-muted)"
              >
                إغلاق
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="dash-label">
                  الاسم الكامل
                  <input
                    value={formData.name}
                    onChange={(event) => handleFormChange("name", event.target.value)}
                    className="dash-input mt-2 h-12 rounded-2xl border border-(--dash-border) hover:border-(--dash-primary) focus:border-(--dash-primary)"
                    placeholder="مثال: أحمد محمد"
                  />
                </label>
                <label className="dash-label">
                  البريد الإلكتروني
                  <input
                    value={formData.email}
                    onChange={(event) => handleFormChange("email", event.target.value)}
                    className="dash-input mt-2 h-12 rounded-2xl border border-(--dash-border) hover:border-(--dash-primary) focus:border-(--dash-primary)"
                    placeholder="name@company.com"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="dash-label">
                  الدور
                  <select
                    value={formData.role}
                    onChange={(event) => handleFormChange("role", event.target.value)}
                    className="dash-select mt-2 h-12 rounded-2xl border border-(--dash-border) hover:border-(--dash-primary) focus:border-(--dash-primary)"
                  >
                    <option value="مدير النظام">مدير النظام</option>
                    <option value="مشرف">مشرف</option>
                    <option value="محاسب">محاسب</option>
                    <option value="مشاهد">مشاهد</option>
                  </select>
                </label>
                <label className="dash-label">
                  الحالة
                  <select
                    value={formData.status}
                    onChange={(event) => handleFormChange("status", event.target.value)}
                    className="dash-select mt-2 h-12 rounded-2xl border border-(--dash-border) hover:border-(--dash-primary) focus:border-(--dash-primary)"
                  >
                    <option value="نشط">نشط</option>
                    <option value="غير نشط">غير نشط</option>
                  </select>
                </label>
              </div>
              <div className="flex justify-start gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-(--dash-primary) px-5 py-2.5 text-xs font-semibold text-white"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewUser(false)}
                  className="rounded-xl border border-(--dash-border) px-5 py-2.5 text-xs text-(--dash-muted)"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default page;
