"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type UserRole = "مدير النظام" | "مدير" | "كاشير" | "محاسب";

type UserStatus = "نشط" | "غير نشط";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
};

type RoleCard = {
  id: string;
  name: UserRole;
  users: number;
};

type PermissionValue = true | false | "na";

type PermissionRow = {
  section: string;
  view: PermissionValue;
  create: PermissionValue;
  edit: PermissionValue;
  remove: PermissionValue;
};

const rolesData: RoleCard[] = [
  { id: "admin", name: "مدير النظام", users: 1 },
  { id: "manager", name: "مدير", users: 1 },
  { id: "cashier", name: "كاشير", users: 1 },
  { id: "accountant", name: "محاسب", users: 1 },
];

const permissionsByRole: Record<string, PermissionRow[]> = {
  admin: [
    { section: "الفواتير", view: true, create: true, edit: true, remove: true },
    { section: "الدفعات", view: true, create: true, edit: true, remove: true },
    { section: "العملاء", view: true, create: true, edit: true, remove: true },
    { section: "المنتجات", view: true, create: true, edit: true, remove: true },
    { section: "المخزون", view: true, create: true, edit: true, remove: true },
    { section: "التقارير", view: true, create: "na", edit: "na", remove: "na" },
    { section: "الإعدادات", view: true, create: "na", edit: true, remove: "na" },
  ],
  manager: [
    { section: "الفواتير", view: true, create: true, edit: true, remove: false },
    { section: "الدفعات", view: true, create: true, edit: false, remove: false },
    { section: "العملاء", view: true, create: true, edit: true, remove: false },
    { section: "المنتجات", view: true, create: true, edit: true, remove: false },
    { section: "المخزون", view: true, create: false, edit: true, remove: false },
    { section: "التقارير", view: true, create: "na", edit: "na", remove: "na" },
    { section: "الإعدادات", view: true, create: "na", edit: false, remove: "na" },
  ],
  cashier: [
    { section: "الفواتير", view: true, create: true, edit: false, remove: false },
    { section: "الدفعات", view: true, create: true, edit: false, remove: false },
    { section: "العملاء", view: true, create: false, edit: false, remove: false },
    { section: "المنتجات", view: true, create: false, edit: false, remove: false },
    { section: "المخزون", view: true, create: false, edit: false, remove: false },
    { section: "التقارير", view: true, create: "na", edit: "na", remove: "na" },
    { section: "الإعدادات", view: true, create: "na", edit: false, remove: "na" },
  ],
  accountant: [
    { section: "الفواتير", view: true, create: false, edit: false, remove: false },
    { section: "الدفعات", view: true, create: true, edit: false, remove: false },
    { section: "العملاء", view: true, create: false, edit: false, remove: false },
    { section: "المنتجات", view: true, create: false, edit: false, remove: false },
    { section: "المخزون", view: true, create: false, edit: false, remove: false },
    { section: "التقارير", view: true, create: "na", edit: "na", remove: "na" },
    { section: "الإعدادات", view: false, create: "na", edit: false, remove: "na" },
  ],
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
    role: "مدير",
    status: "نشط",
    lastLogin: "2026-01-15 10:15",
  },
  {
    id: "USR-003",
    name: "محمد سعيد",
    email: "mohammed@company.com",
    role: "كاشير",
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
  const [selectedRole, setSelectedRole] = useState("cashier");
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserRow[]>(usersData);
  const [showNewUser, setShowNewUser] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "مدير النظام" as UserRole,
    status: "نشط" as UserStatus,
  });

  const stats = useMemo(
    () => [
      { label: "إجمالي المستخدمين", value: users.length.toString(), tone: "text-(--dash-primary)" },
      { label: "المستخدمون النشطون", value: users.filter((user) => user.status === "نشط").length.toString(), tone: "text-(--dash-success)" },
      { label: "الأدوار", value: "4", tone: "text-(--dash-warning)" },
      { label: "الصلاحيات", value: "7", tone: "text-(--dash-info)" },
    ],
    [users]
  );

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users.filter((user) =>
      normalizedQuery ? [user.name, user.email, user.role].join(" ").toLowerCase().includes(normalizedQuery) : true
    );
  }, [query, users]);

  const handleFormChange = (field: keyof typeof formData, value: string) => {
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
      role: formData.role,
      status: formData.status,
      lastLogin: "-",
    };
    setUsers((prev) => [nextUser, ...prev]);
    setShowNewUser(false);
    setFormData({ name: "", email: "", role: "مدير النظام", status: "نشط" });
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setShowNewUser(false);
    }
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setActiveTab("الأدوار والصلاحيات");
  };

  const roleBadge = (role: UserRole) => {
    if (role === "مدير النظام") {
      return "bg-rose-500/15 text-rose-400";
    }
    if (role === "مدير") {
      return "bg-blue-500/15 text-blue-300";
    }
    if (role === "كاشير") {
      return "bg-indigo-500/15 text-indigo-300";
    }
    return "bg-slate-100/10 text-(--dash-muted)";
  };

  const statusBadge = (status: UserStatus) =>
    status === "نشط" ? "bg-(--dash-primary) text-white" : "bg-slate-100/10 text-(--dash-muted)";

  const selectedRoleLabel = rolesData.find((role) => role.id === selectedRole)?.name ?? "مدير";
  const permissions = permissionsByRole[selectedRole] ?? permissionsByRole.manager;

  const permissionCell = (value: PermissionValue) => {
    if (value === "na") {
      return <span className="text-sm text-(--dash-muted)">-</span>;
    }
    if (value) {
      return (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="currentColor" d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 6.1-6.1 1.4 1.4-7.5 7.5Z" />
          </svg>
        </span>
      );
    }
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-500/20 text-slate-300">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path fill="currentColor" d="M6.6 5.2 5.2 6.6 10.6 12l-5.4 5.4 1.4 1.4L12 13.4l5.4 5.4 1.4-1.4L13.4 12l5.4-5.4-1.4-1.4L12 10.6 6.6 5.2Z" />
        </svg>
      </span>
    );
  };

  return (
    <DashboardShell
      title="المستخدمون والصلاحيات"
      subtitle="إدارة المستخدمين وصلاحيات الوصول"
      hideHeaderFilters
      headerActionAlign="left"
      headerAction={
        <button
          type="button"
          onClick={() => setShowNewUser(true)}
          className="flex items-center gap-2 rounded-2xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="currentColor" d="M11 5h2v14h-2V5Zm-7 7h14v2H4v-2Z" />
          </svg>
          مستخدم جديد
        </button>
      }
    >
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-5 shadow-sm"
          >
            <div>
              <p className="text-xs text-(--dash-muted)">{stat.label}</p>
              <p className={`mt-2 text-2xl font-semibold ${stat.tone}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-(--dash-border) bg-(--dash-panel-soft) p-1">
          <button
            type="button"
            onClick={() => setActiveTab("المستخدمون")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeTab === "المستخدمون" ? "bg-(--dash-panel) text-(--dash-text) shadow-sm" : "text-(--dash-muted)"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
              />
            </svg>
            المستخدمون
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("الأدوار والصلاحيات")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeTab === "الأدوار والصلاحيات"
                ? "bg-(--dash-panel) text-(--dash-text) shadow-sm"
                : "text-(--dash-muted)"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm0 18c-3.3-1.2-6-4.9-6-9V6.3L12 4l6 2.3V11c0 4.1-2.7 7.8-6 9Z"
              />
            </svg>
            الأدوار والصلاحيات
          </button>
        </div>
      </section>

      {activeTab === "الأدوار والصلاحيات" && (
        <section className="dash-card">
          <h3 className="mb-6 text-sm font-semibold text-(--dash-text)">اختر الدور</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {rolesData.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id)}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-right transition ${
                    isSelected
                      ? "border-(--dash-primary) bg-(--dash-panel-soft) shadow-sm"
                      : "border-(--dash-border) bg-(--dash-panel-soft) hover:border-(--dash-primary)"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--dash-border) bg-(--dash-panel)">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-(--dash-text)" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M12 2 5 5v6c0 4.7 3.1 9 7 10 3.9-1 7-5.3 7-10V5l-7-3Zm0 16c-2.6-.9-4-4.4-4-7.7V6.2L12 4l4 2.2v4.1c0 3.3-2 6.8-4 7.7Z"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-(--dash-text)">{role.name}</p>
                      <p className="mt-1 text-xs text-(--dash-muted)">مستخدمين {role.users}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "الأدوار والصلاحيات" && (
        <section key={selectedRole} className="dash-card mt-6 overflow-hidden p-0 animate-report-slide">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--dash-border) bg-(--dash-panel-soft) px-5 py-4">
            <h3 className="text-sm font-semibold text-(--dash-text)">صلاحيات دور: {selectedRoleLabel}</h3>
            <button
              type="button"
              className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white"
            >
              حفظ التغييرات
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead className="text-xs text-(--dash-muted)">
                <tr>
                  <th className="px-5 py-4 text-right">القسم</th>
                  <th className="px-5 py-4 text-center w-24">عرض</th>
                  <th className="px-5 py-4 text-center w-24">إضافة</th>
                  <th className="px-5 py-4 text-center w-24">تعديل</th>
                  <th className="px-5 py-4 text-center w-24">حذف</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.section} className="border-t border-(--dash-border)">
                    <td className="px-5 py-4 text-(--dash-text)">{permission.section}</td>
                    <td className="px-5 py-4 text-center w-24">{permissionCell(permission.view)}</td>
                    <td className="px-5 py-4 text-center w-24">{permissionCell(permission.create)}</td>
                    <td className="px-5 py-4 text-center w-24">{permissionCell(permission.edit)}</td>
                    <td className="px-5 py-4 text-center w-24">{permissionCell(permission.remove)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "المستخدمون" && (
        <>
          <section className="dash-card mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <svg
                  viewBox="0 0 24 24"
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--dash-muted)"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 10-.7.7l.3.3v.8l4.5 4.5 1.3-1.3zM10.5 15a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"
                  />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="بحث بالاسم أو البريد الإلكتروني..."
                  className="dash-input h-12 w-full rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) pl-10 hover:border-(--dash-primary) hover:bg-(--dash-panel)"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs font-semibold text-(--dash-text) hover:border-(--dash-primary) hover:bg-(--dash-panel)"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M4 5h16v2l-6 6v5l-4 2v-7L4 7V5Z" />
                </svg>
                فلتر
              </button>
            </div>
          </section>

          <section className="dash-card mt-6 overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-(--dash-panel-soft) text-xs text-(--dash-muted)">
                  <tr>
                    <th className="px-4 py-4 text-right">الاسم</th>
                    <th className="px-4 py-4 text-right">البريد الإلكتروني</th>
                    <th className="px-4 py-4 text-right">الدور</th>
                    <th className="px-4 py-4 text-right">الحالة</th>
                    <th className="px-4 py-4 text-right">آخر دخول</th>
                    <th className="px-4 py-4 text-right">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-(--dash-border)">
                      <td className="px-4 py-4 text-(--dash-text)">{user.name}</td>
                      <td className="px-4 py-4 text-(--dash-muted)">{user.email}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-(--dash-muted)">{user.lastLogin}</td>
                      <td className="px-4 py-4">
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
        </>
      )}

      {showNewUser && (
        <div className="dash-modal" onClick={handleOverlayClick}>
          <div className="dash-modal-body w-full max-w-2xl p-6">
            <div className="flex items-center justify-between border-b border-(--dash-border) pb-3">
              <div>
                <h3 className="text-sm font-semibold text-(--dash-text)">إنشاء مستخدم جديد</h3>
                <p className="mt-1 text-xs text-(--dash-muted)">أدخل بيانات المستخدم وصلاحياته الأساسية.</p>
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
                    className="dash-input mt-2 h-12 w-full rounded-2xl border border-(--dash-border) bg-(--dash-panel) hover:border-(--dash-primary) focus:border-(--dash-primary)"
                    placeholder="مثال: أحمد محمد"
                  />
                </label>
                <label className="dash-label">
                  البريد الإلكتروني
                  <input
                    value={formData.email}
                    onChange={(event) => handleFormChange("email", event.target.value)}
                    className="dash-input mt-2 h-12 w-full rounded-2xl border border-(--dash-border) bg-(--dash-panel) hover:border-(--dash-primary) focus:border-(--dash-primary)"
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
                    className="dash-select mt-2 h-12 w-full rounded-2xl border border-(--dash-border) bg-(--dash-panel) hover:border-(--dash-primary) focus:border-(--dash-primary)"
                  >
                    <option value="مدير النظام">مدير النظام</option>
                    <option value="مدير">مدير</option>
                    <option value="كاشير">كاشير</option>
                    <option value="محاسب">محاسب</option>
                  </select>
                </label>
                <label className="dash-label">
                  الحالة
                  <select
                    value={formData.status}
                    onChange={(event) => handleFormChange("status", event.target.value)}
                    className="dash-select mt-2 h-12 w-full rounded-2xl border border-(--dash-border) bg-(--dash-panel) hover:border-(--dash-primary) focus:border-(--dash-primary)"
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
                  إنشاء
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
