"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type BillingCycle = "شهري" | "سنوي";

type Plan = {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  badge?: string;
  featured?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "enterprise",
    name: "الخطة المتقدمة",
    priceMonthly: 1499,
    priceYearly: 14990,
    description: "للشركات الكبيرة التي تحتاج صلاحيات وتقارير موسعة.",
    features: [
      "عدد غير محدود من المستخدمين",
      "عدد غير محدود من العملاء والمنتجات",
      "عدد غير محدود من المخازن والمخزون",
      "تقارير متقدمة ولوحات أداء",
      "دعم فني مخصص مع مدير حساب",
      "تخصيص كامل للحقول والإشعارات",
      "تكامل API كامل",
      "نسخ احتياطي يومي تلقائي",
    ],
  },
  {
    id: "pro",
    name: "الخطة الاحترافية",
    priceMonthly: 799,
    priceYearly: 7990,
    description: "الخيار الأفضل للأعمال المتوسطة والنمو السريع.",
    badge: "الأكثر شيوعا",
    featured: true,
    features: [
      "حتى 30 مستخدم",
      "عدد غير محدود من العملاء والمنتجات",
      "5 مخازن نشطة",
      "صلاحيات متقدمة للمستخدمين",
      "تقارير مالية وتشغيلية كاملة",
      "إشعارات وتنبيهات ذكية",
      "دعم فني أولوية",
      "نسخ احتياطي أسبوعي",
    ],
  },
  {
    id: "basic",
    name: "الخطة الاقتصادية",
    priceMonthly: 299,
    priceYearly: 2990,
    description: "انطلق بإدارة العمليات الأساسية بسلاسة.",
    features: [
      "حتى 10 مستخدمين",
      "حتى 200 عميل ومنتج",
      "مخزن واحد نشط",
      "تقارير قياسية",
      "إشعارات أساسية",
      "تحديثات تلقائية",
      "دعم فني عبر البريد",
      "نسخ احتياطي شهري",
    ],
  },
];

const comparisonRows = [
  { feature: "عدد المستخدمين", basic: "10", pro: "30", enterprise: "غير محدود" },
  { feature: "عدد العملاء", basic: "200", pro: "غير محدود", enterprise: "غير محدود" },
  { feature: "عدد المخازن", basic: "1", pro: "5", enterprise: "غير محدود" },
  { feature: "تقارير الأداء", basic: "قياسية", pro: "متقدمة", enterprise: "متقدمة" },
  { feature: "الدعم الفني", basic: "بريد إلكتروني", pro: "أولوية", enterprise: "مخصص" },
  { feature: "التكاملات API", basic: "غير متاح", pro: "جزئي", enterprise: "كامل" },
  { feature: "نسخ احتياطي", basic: "شهري", pro: "أسبوعي", enterprise: "يومي" },
  { feature: "صلاحيات المستخدمين", basic: "أساسية", pro: "متقدمة", enterprise: "متقدمة" },
  { feature: "إشعارات ذكية", basic: "✓", pro: "✓", enterprise: "✓" },
];

const faqs = [
  {
    question: "هل يمكنني الترقية أو التخفيض في أي وقت؟",
    answer: "نعم، يمكنك تغيير الخطة في أي وقت وسيتم احتساب الفاتورة تلقائيا.",
  },
  {
    question: "هل توجد رسوم خفية على المعاملات؟",
    answer: "لا، لا توجد رسوم إضافية على العمليات أو المعاملات اليومية.",
  },
  {
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نوفر الدفع عبر البطاقات البنكية والتحويل البنكي حسب الخطة.",
  },
];

const page = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("شهري");

  const pricing = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        price: billingCycle === "شهري" ? plan.priceMonthly : plan.priceYearly,
        unit: billingCycle === "شهري" ? "شهري" : "سنوي",
      })),
    [billingCycle]
  );

  return (
    <DashboardShell title="خطط الاشتراك والقيود" subtitle="اختر الخطة المناسبة لأعمالك بدون قيود يومية على العمليات.">
      <section className="dash-card mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-(--dash-text)">لا يوجد قيود يومية في النظام</h2>
            <p className="mt-2 text-sm text-(--dash-muted)">
              جميع الخطط تسمح بعدد غير محدود من العمليات اليومية مع حفظ كامل لسجل النشاط.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-1">
            {(["شهري", "سنوي"] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold ${
                  billingCycle === cycle ? "bg-(--dash-primary) text-white" : "text-(--dash-muted)"
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-(--dash-muted)">
          <li>عدد غير محدود من الفواتير اليومية (بيع وشراء).</li>
          <li>عدد غير محدود من عمليات الدفع والتحصيل يوميا.</li>
          <li>عدد غير محدود من حركات الصرف والبنوك يوميا.</li>
          <li>عدد غير محدود من العملاء والموردين وفقا للخطة.</li>
          <li>عدد غير محدود من التقارير اليومية.</li>
        </ul>
      </section>

      <section className="mb-8 grid gap-4 xl:grid-cols-3">
        {pricing.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl border p-6 shadow-(--dash-shadow) ${
              plan.featured
                ? "border-(--dash-primary) bg-(--dash-panel) shadow-(--dash-primary-soft)"
                : "border-(--dash-border) bg-(--dash-panel)"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-(--dash-text)">{plan.name}</p>
                <p className="mt-1 text-xs text-(--dash-muted)">{plan.description}</p>
              </div>
              {plan.badge ? (
                <span className="rounded-full bg-(--dash-primary) px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              ) : null}
            </div>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-3xl font-semibold text-(--dash-text)">{plan.price}</span>
              <span className="text-xs text-(--dash-muted)">ر.س / {plan.unit}</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-(--dash-muted)">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 text-(--dash-success)">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`mt-6 w-full rounded-2xl px-4 py-2 text-xs font-semibold ${
                plan.featured
                  ? "bg-(--dash-primary) text-white shadow-(--dash-primary-soft)"
                  : "border border-(--dash-border) text-(--dash-text)"
              }`}
            >
              {plan.featured ? "الخطة الحالية" : "اختر الخطة"}
            </button>
          </div>
        ))}
      </section>

      <section className="dash-card mb-8">
        <h3 className="text-sm font-semibold text-(--dash-text)">مقارنة الخصائص بين الخطط</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-(--dash-border) text-xs text-(--dash-muted)">
              <tr>
                <th className="px-3 py-3 text-right">الميزة</th>
                <th className="px-3 py-3 text-center">الاقتصادية</th>
                <th className="px-3 py-3 text-center">الاحترافية</th>
                <th className="px-3 py-3 text-center">المتقدمة</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="border-b border-(--dash-border)">
                  <td className="px-3 py-3 text-(--dash-text)">{row.feature}</td>
                  <td className="px-3 py-3 text-center text-(--dash-muted)">{row.basic}</td>
                  <td className="px-3 py-3 text-center text-(--dash-muted)">{row.pro}</td>
                  <td className="px-3 py-3 text-center text-(--dash-muted)">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dash-card">
        <h3 className="text-sm font-semibold text-(--dash-text)">الأسئلة الشائعة</h3>
        <div className="mt-4 space-y-4 text-sm text-(--dash-muted)">
          {faqs.map((item) => (
            <div key={item.question} className="rounded-2xl border border-(--dash-border) bg-(--dash-panel-soft) p-4">
              <p className="font-semibold text-(--dash-text)">{item.question}</p>
              <p className="mt-2 text-sm text-(--dash-muted)">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
};

export default page;
