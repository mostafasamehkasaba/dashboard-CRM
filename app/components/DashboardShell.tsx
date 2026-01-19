"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as XLSX from "xlsx";
import ThemeToggle from "./ThemeToggle";

const sidebarItems = [
  { label: "لوحة التحكم", href: "/dashboard" },
  { label: "الفواتير", href: "/invoices", badge: "5" },
  { label: "الدفعات", href: "/payments" },
  { label: "العملاء", href: "/customers" },
  { label: "الموردين", href: "/suppliers" },
  { label: "المنتجات", href: "/products" },
  { label: "المخزون", href: "/inventory", badge: "3" },
  { label: "المشتريات", href: "/purchases" },
  { label: "المصروفات", href: "/expenses" },
  { label: "المحافظ المالية", href: "/wallets" },
  { label: "التقارير", href: "/reports" },
  { label: "المستخدمون", href: "/users" },
  { label: "سجل الأنشطة", href: "/activity-log" },
  { label: "خطط الاشتراك", href: "/subscription-plans" },
  { label: "الإعدادات", href: "/settings" },
];

type SidebarLink = { label: string; href: string; badge?: string };
type SidebarGroup = { label: string; children: SidebarLink[] };

const sidebarNavigation: Array<SidebarLink | SidebarGroup> = [
  { label: "لوحة التحكم", href: "/dashboard" },
  { label: "الفواتير", href: "/invoices", badge: "5" },
  { label: "المدفوعات", href: "/payments" },
  { label: "العملاء", href: "/customers" },
  { label: "الموردين", href: "/suppliers" },
  { label: "المنتجات", href: "/products" },
  { label: "المخزون", href: "/inventory", badge: "3" },
  { label: "المشتريات", href: "/purchases" },
  { label: "المصروفات", href: "/expenses" },
  {
    label: "الخزنة والبنوك",
    children: [
      { label: "الخزنة", href: "/cash" },
      { label: "البنوك", href: "/banks" },
      { label: "التحويلات المالية", href: "/financial-transfers" },
      { label: "سجل الحركة", href: "/movement-log" },
    ],
  },
  { label: "المحفظة المالية", href: "/wallets" },
  { label: "التقارير", href: "/reports" },
  { label: "المستخدمون", href: "/users" },
  { label: "سجل النشاط", href: "/activity-log" },
  { label: "خطط الاشتراك", href: "/subscription-plans" },
  { label: "الإعدادات", href: "/settings" },
];

type DashboardShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerAction?: ReactNode;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  exportData?: {
    filename: string;
    headers: string[];
    rows: Array<Array<string | number>>;
  };
};

const timeFilters = ["اليوم", "هذا الأسبوع", "هذا الشهر", "هذا العام", "تخصيص"];

const notifications = [
  {
    id: "stock",
    title: "انخفاض المخزون",
    description: "منتج XYZ أقل من الحد الأدنى (5 وحدات متبقية)",
    time: "قبل 10 دقائق",
  },
  {
    id: "invoice",
    title: "فاتورة متأخرة",
    description: "فاتورة INV-004 لم تُحصّل منذ 14 يومًا",
    time: "قبل ساعة",
  },
  {
    id: "expiry",
    title: "تنبيه صلاحية",
    description: "منتج ABC تنتهي صلاحيته خلال 7 أيام",
    time: "قبل يوم",
  },
];

const DashboardShell = ({
  title,
  subtitle,
  children,
  exportData,
  headerAction,
  searchValue,
  searchPlaceholder,
  onSearchChange,
}: DashboardShellProps) => {
  const pathname = usePathname();
  const [selectedFilter, setSelectedFilter] = useState("هذا الشهر");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "info" | "warning" } | null>(null);
  const filterRef = useRef<HTMLDetailsElement | null>(null);
  const exportRef = useRef<HTMLDetailsElement | null>(null);
  const notificationsRef = useRef<HTMLDetailsElement | null>(null);
  const quickActionsRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const showToast = (message: string, tone: "success" | "info" | "warning" = "info") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    if (filterRef.current) {
      filterRef.current.open = false;
    }
  };

  const handleExportExcel = () => {
    if (!exportData) {
      if (exportRef.current) {
        exportRef.current.open = false;
      }
      return;
    }

    const { filename, headers, rows } = exportData;
    const sheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Report");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    if (exportRef.current) {
      exportRef.current.open = false;
    }
  };

  const handleExportPdf = () => {
    window.print();
    if (exportRef.current) {
      exportRef.current.open = false;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showQuickActions || !quickActionsRef.current) {
        return;
      }
      if (!quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showQuickActions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showProfileMenu || !profileMenuRef.current) {
        return;
      }
      if (!profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  return (
    <div dir="rtl" className="min-h-screen bg-(--dash-bg) text-(--dash-text)">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-16 h-72 w-72 rounded-full bg-sky-500/15 dark:bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-28 h-80 w-80 rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 blur-3xl" />
      </div>

      <aside className="fixed right-0 top-0 z-20 hidden h-full w-72 border-l border-(--dash-border) bg-(--dash-panel) p-6 backdrop-blur lg:block">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4">
            <div>
              <p className="text-lg font-semibold">لوب تك سيستمز</p>
              <p className="text-sm text-(--dash-muted)">مدير الأعمال</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--dash-primary) text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5Z"
                />
              </svg>
            </div>
          </div>

          <nav className="dash-scroll mt-8 flex-1 space-y-3 overflow-y-auto pr-1 text-sm">
            {sidebarNavigation.map((item) => {
              const isGroup = "children" in item;
              const isActive = isGroup
                ? item.children.some((child) => child.href === pathname)
                : pathname === item.href;

              if (isGroup) {
                return (
                  <details
                    key={item.label}
                    open={isActive}
                    className="group rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  >
                    <summary
                      className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-2 py-2 transition ${
                        isActive ? "text-(--dash-text)" : "text-(--dash-muted)"
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-(--dash-muted-2) transition group-open:rotate-180"
                        aria-hidden="true"
                      >
                        <path fill="currentColor" d="M7 10l5 5 5-5H7Z" />
                      </svg>
                    </summary>
                    <div className="mt-2 space-y-2 pb-2">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs transition ${
                              isChildActive
                                ? "bg-(--dash-primary) text-white shadow-(--dash-primary-soft)"
                                : "text-(--dash-muted) hover:bg-(--dash-panel-glass)"
                            }`}
                          >
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition ${
                    isActive
                      ? "bg-(--dash-primary) text-white shadow-(--dash-primary-soft)"
                      : "text-(--dash-muted) hover:bg-(--dash-panel-soft)"
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-(--dash-danger) px-2 py-0.5 text-xs font-semibold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="mt-8 flex w-full items-center justify-between rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3 text-sm text-(--dash-muted)"
          >
            <span>مساعدة</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--dash-panel-glass) text-(--dash-text)">
              ?
            </span>
          </button>
        </div>
      </aside>

      <main className="relative z-10 px-6 pb-16 pt-10 lg:pr-76 lg:pl-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-right"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--dash-primary) text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
                    />
                  </svg>
                </span>
                <div className="text-sm">
                  <p className="font-semibold">أحمد محمد</p>
                  <p className="text-xs text-(--dash-muted)">مدير النظام</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-(--dash-panel-glass)" />
              </button>
              {showProfileMenu ? (
                <div className="absolute right-0 top-12 z-30 w-44 rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-2 text-sm shadow-(--dash-shadow)">
                  <Link
                    href="/users"
                    onClick={() => setShowProfileMenu(false)}
                    className="block rounded-xl px-3 py-2 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                  >
                    الملف الشخصي
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      showToast("تم تسجيل الخروج.", "info");
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-right text-(--dash-text) hover:bg-(--dash-panel-soft)"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              ) : null}
            </div>

            <details ref={notificationsRef} className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text)">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--dash-panel-glass) text-(--dash-text)">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z"
                    />
                  </svg>
                </span>
                التنبيهات
                <span className="rounded-full bg-(--dash-danger) px-2 py-0.5 text-xs font-semibold text-white">
                  {notifications.length}
                </span>
              </summary>
              <div className="absolute right-0 top-12 z-20 w-80 rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-3 shadow-(--dash-shadow)">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">آخر التنبيهات</p>
                  <label className="flex items-center gap-2 text-xs text-(--dash-muted)">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={(event) => {
                        setNotificationsEnabled(event.target.checked);
                        showToast(
                          event.target.checked ? "تم تفعيل التنبيهات" : "تم إيقاف التنبيهات",
                          "info"
                        );
                      }}
                    />
                    تشغيل التنبيهات
                  </label>
                </div>
                <div className="mt-3 space-y-3">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) p-3"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{item.title}</span>
                        <span className="text-xs text-(--dash-muted)">{item.time}</span>
                      </div>
                      <p className="mt-2 text-xs text-(--dash-muted)">{item.description}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    showToast("تم تحديث التنبيهات", "success");
                    if (notificationsRef.current) {
                      notificationsRef.current.open = false;
                    }
                  }}
                  className="mt-3 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-text)"
                >
                  تحديث التنبيهات
                </button>
              </div>
            </details>

            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text)"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--dash-panel-glass) text-(--dash-text)">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 3a1 1 0 0 1 1 1v2.07a6.5 6.5 0 0 1 3.94 2.03l1.46-1.46a1 1 0 1 1 1.42 1.42l-1.46 1.46A6.5 6.5 0 0 1 19.93 12H22a1 1 0 1 1 0 2h-2.07a6.5 6.5 0 0 1-2.03 3.94l1.46 1.46a1 1 0 0 1-1.42 1.42l-1.46-1.46A6.5 6.5 0 0 1 13 19.93V22a1 1 0 1 1-2 0v-2.07a6.5 6.5 0 0 1-3.94-2.03l-1.46 1.46a1 1 0 1 1-1.42-1.42l1.46-1.46A6.5 6.5 0 0 1 4.07 14H2a1 1 0 1 1 0-2h2.07a6.5 6.5 0 0 1 2.03-3.94L4.64 6.6a1 1 0 1 1 1.42-1.42l1.46 1.46A6.5 6.5 0 0 1 11 6.07V4a1 1 0 0 1 1-1Z"
                  />
                </svg>
              </span>
              الإعدادات
            </Link>

            <ThemeToggle />

            <div className="relative" ref={quickActionsRef}>
              <button
                type="button"
                onClick={() => {
                  setShowQuickActions((prev) => !prev);
                  showToast("تم فتح الإجراءات السريعة", "info");
                }}
                className="flex items-center gap-2 rounded-2xl bg-(--dash-primary) px-5 py-2 text-sm font-semibold text-white shadow-(--dash-primary-soft)"
              >
                <span className="text-lg">+</span>
                إجراء جديد
              </button>
              {showQuickActions ? (
                <div className="absolute right-0 top-12 z-30 w-44 rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-2 text-sm shadow-(--dash-shadow)">
                  <Link
                    href="/invoices"
                    onClick={() => setShowQuickActions(false)}
                    className="block rounded-xl px-3 py-2 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                  >
                    إنشاء فاتورة
                  </Link>
                  <Link
                    href="/payments"
                    onClick={() => setShowQuickActions(false)}
                    className="block rounded-xl px-3 py-2 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                  >
                    إضافة دفعة
                  </Link>
                  <Link
                    href="/customers"
                    onClick={() => setShowQuickActions(false)}
                    className="block rounded-xl px-3 py-2 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                  >
                    عميل جديد
                  </Link>
                  <Link
                    href="/products"
                    onClick={() => setShowQuickActions(false)}
                    className="block rounded-xl px-3 py-2 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                  >
                    منتج جديد
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-105">
            <div className="flex items-center gap-3 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-(--dash-muted-2)" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M10 2a8 8 0 1 0 5.29 14l4.7 4.7a1 1 0 0 0 1.42-1.4l-4.7-4.7A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"
                />
              </svg>
              <input
                type="text"
                value={onSearchChange ? searchValue ?? "" : undefined}
                defaultValue={onSearchChange ? undefined : searchValue}
                onChange={onSearchChange ? (event) => onSearchChange(event.target.value) : undefined}
                readOnly={!onSearchChange}
                placeholder={searchPlaceholder ?? "بحث سريع عن العملاء، المنتجات، الفواتير..."}
                className="w-full bg-transparent text-sm text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <details ref={filterRef} className="relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text)">
                  {selectedFilter}
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-(--dash-muted-2)" aria-hidden="true">
                    <path fill="currentColor" d="M7 10l5 5 5-5H7Z" />
                  </svg>
                </summary>
                <div className="absolute right-0 top-12 z-20 w-44 rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-2 text-sm shadow-(--dash-shadow)">
                  {timeFilters.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleFilterSelect(item)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                    >
                      <span>{item}</span>
                      {selectedFilter === item ? <span className="text-(--dash-primary)">✓</span> : null}
                    </button>
                  ))}
                </div>
              </details>
              <details ref={exportRef} className="relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text)">
                  تصدير التقرير
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-(--dash-muted-2)" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V7h3.5L14 3.5Z"
                    />
                  </svg>
                </summary>
                <div className="absolute right-0 top-12 z-20 w-44 rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-2 text-sm shadow-(--dash-shadow)">
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                  >
                    <span>تصدير Excel</span>
                    <span className="text-(--dash-muted-2)">.xlsx</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportPdf}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-(--dash-text) hover:bg-(--dash-panel-soft)"
                  >
                    <span>طباعة PDF</span>
                    <span className="text-(--dash-muted-2)">PDF</span>
                  </button>
                </div>
              </details>
            </div>
          </div>
        </header>

        <section className="mt-10">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <h1 className="text-3xl font-semibold">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm text-(--dash-muted)">{subtitle}</p> : null}
            </div>
            {headerAction ? <div className="ms-auto flex items-center gap-2">{headerAction}</div> : null}
          </div>
        </section>

        <div className="mt-6">{children}</div>
      </main>

      {toast ? (
        <div className="fixed bottom-6 left-6 z-50">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm text-white shadow-lg ${
              toast.tone === "success"
                ? "border-(--dash-success) bg-(--dash-success)"
                : toast.tone === "warning"
                ? "border-(--dash-warning) bg-(--dash-warning)"
                : "border-(--dash-info) bg-(--dash-info)"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardShell;
