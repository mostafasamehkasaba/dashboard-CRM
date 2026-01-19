"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DashboardShell from "../components/DashboardShell";
import Image from "next/image";
type ProductStatus = "متوفر" | "منخفض" | "نافد";

type Product = {
  id: string;
  name: string;
  category: string;
  sku: string;
  supplier: string;
  status: ProductStatus;
  stock: number;
  price: number;
  imageTone: string;
};

const initialProducts: Product[] = [
  {
    id: "PROD-001",
    name: "لابتوب HP EliteBook",
    category: "الإلكترونيات",
    sku: "LAP-HP-001",
    supplier: "مورد المواد الإلكترونية",
    status: "منخفض",
    stock: 6,
    price: 3500,
    imageTone: "/images/لابتوب HP EliteBook.png",
  },
  {
    id: "PROD-002",
    name: "ماوس لاسلكي Logitech",
    category: "ملحقات",
    sku: "ACC-MS-045",
    supplier: "شركة التوريدات التقنية",
    status: "متوفر",
    stock: 45,
    price: 150,
    imageTone: "/images/Mouse.jpg",
  },
  {
    id: "PROD-003",
    name: "كيبورد ميكانيكي",
    category: "ملحقات",
    sku: "ACC-KB-120",
    supplier: "شركة التوريدات التقنية",
    status: "متوفر",
    stock: 22,
    price: 580,
    imageTone: "/images/keyboard.jpg",
  },
  {
    id: "PROD-004",
    name: "شاشة Dell 27",
    category: "الإلكترونيات",
    sku: "MON-DE-027",
    supplier: "مورد المواد الإلكترونية",
    status: "نافد",
    stock: 0,
    price: 1200,
    imageTone: "/images/شاشة Dell 27.jpg",
  },
];

const formatCurrency = (value: number) => `${value.toLocaleString()} ريال`;

const statusStyles: Record<ProductStatus, string> = {
  متوفر: "bg-(--dash-success) text-white",
  منخفض: "bg-(--dash-warning) text-white",
  نافد: "bg-(--dash-danger) text-white",
};

const page = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const formRef = useRef<HTMLElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    sku: "",
    supplier: "",
    status: "متوفر" as ProductStatus,
    stock: "0",
    price: "",
    image: "",
  });
  const [imageObjectUrl, setImageObjectUrl] = useState<string | null>(null);

  const summaryCards = useMemo(() => {
    const total = products.length;
    const available = products.filter((item) => item.status === "متوفر").length;
    const lowStock = products.filter((item) => item.status === "منخفض").length;
    const outOfStock = products.filter((item) => item.status === "نافد").length;
    return [
      { label: "إجمالي المنتجات", value: `${total}`, tone: "text-(--dash-text)" },
      { label: "المنتجات المتوفرة", value: `${available}`, tone: "text-(--dash-success)" },
      { label: "منخفض المخزون", value: `${lowStock}`, tone: "text-(--dash-warning)" },
      { label: "نافد المخزون", value: `${outOfStock}`, tone: "text-(--dash-danger)" },
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      if (!matchesStatus) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [item.name, item.category, item.sku, item.supplier, item.id]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [products, query, statusFilter]);

  const handleFormChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
      setImageObjectUrl(null);
      setForm((prev) => ({ ...prev, image: "" }));
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    if (imageObjectUrl) {
      URL.revokeObjectURL(imageObjectUrl);
    }
    setImageObjectUrl(nextUrl);
    setForm((prev) => ({ ...prev, image: nextUrl }));
  };

  const handleAddProduct = () => {
    const name = form.name.trim();
    const price = Number.parseFloat(form.price);
    if (!name || Number.isNaN(price)) {
      return;
    }
    const nextProduct: Product = {
      id: editingId ?? `PROD-${String(products.length + 1).padStart(3, "0")}`,
      name,
      category: form.category.trim() || "الإلكترونيات",
      sku: form.sku.trim() || `SKU-${products.length + 1}`,
      supplier: form.supplier.trim() || "شركة التوريدات التقنية",
      status: form.status,
      stock: Number.parseInt(form.stock, 10) || 0,
      price,
      imageTone: form.image.trim() || "from-slate-200 via-slate-50 to-slate-200",
    };
    setProducts((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? nextProduct : item));
      }
      return [nextProduct, ...prev];
    });
    setForm({
      name: "",
      category: "",
      sku: "",
      supplier: "",
      status: "متوفر",
      stock: "0",
      price: "",
      image: "",
    });
    if (imageObjectUrl) {
      URL.revokeObjectURL(imageObjectUrl);
      setImageObjectUrl(null);
    }
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditProduct = (productId: string) => {
    const target = products.find((item) => item.id === productId);
    if (!target) {
      return;
    }
    setForm({
      name: target.name,
      category: target.category,
      sku: target.sku,
      supplier: target.supplier,
      status: target.status,
      stock: String(target.stock),
      price: String(target.price),
      image: target.imageTone.startsWith("/") || target.imageTone.startsWith("blob:") ? target.imageTone : "",
    });
    setEditingId(target.id);
    setShowForm(true);
  };

  useEffect(() => {
    return () => {
      if (imageObjectUrl) {
        URL.revokeObjectURL(imageObjectUrl);
      }
    };
  }, [imageObjectUrl]);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  return (
    <DashboardShell
      title="المنتجات"
      subtitle="إدارة بيانات المنتجات والمخزون"
      exportData={{
        filename: "products",
        headers: ["رقم المنتج", "الاسم", "التصنيف", "رمز المنتج", "المورد", "الحالة", "المخزون", "السعر"],
        rows: products.map((item) => [
          item.id,
          item.name,
          item.category,
          item.sku,
          item.supplier,
          item.status,
          item.stock,
          item.price,
        ]),
      }}

      headerAction={
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-(--dash-primary) px-4 py-2 text-sm font-semibold text-white shadow-(--dash-primary-soft)"
          onClick={() => setShowForm((prev) => !prev)}
        >
          <span className="text-lg">+</span>
          منتج جديد
        </button>
      }
    >
      {showForm ? (
        <section
          ref={formRef}
          className="mb-6 rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)"
        >
          <h2 className="text-lg font-semibold">{editingId ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">اسم المنتج</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                placeholder="اسم المنتج"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">التصنيف</span>
              <input
                type="text"
                value={form.category}
                onChange={(event) => handleFormChange("category", event.target.value)}
                placeholder="الإلكترونيات"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">رمز المنتج</span>
              <input
                type="text"
                value={form.sku}
                onChange={(event) => handleFormChange("sku", event.target.value)}
                placeholder="SKU-000"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المورد</span>
              <input
                type="text"
                value={form.supplier}
                onChange={(event) => handleFormChange("supplier", event.target.value)}
                placeholder="شركة التوريدات التقنية"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">الحالة</span>
              <select
                value={form.status}
                onChange={(event) => handleFormChange("status", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              >
                <option value="متوفر">متوفر</option>
                <option value="منخفض">منخفض</option>
                <option value="نافد">نافد</option>
              </select>
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">المخزون</span>
              <input
                type="number"
                value={form.stock}
                onChange={(event) => handleFormChange("stock", event.target.value)}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted)">
              <span className="mb-2 block font-semibold text-(--dash-text)">السعر</span>
              <input
                type="number"
                value={form.price}
                onChange={(event) => handleFormChange("price", event.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
            </label>
            <label className="text-sm text-(--dash-muted) lg:col-span-3">
              <span className="mb-2 block font-semibold text-(--dash-text)">صورة المنتج</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
              />
              {form.image ? (
                <p className="mt-2 text-xs text-(--dash-muted)">تم اختيار صورة للمنتج</p>
              ) : null}
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text)"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              إلغاء
            </button>
            <button
              type="button"
              className="rounded-xl bg-(--dash-primary) px-4 py-2 text-sm font-semibold text-white shadow-(--dash-primary-soft)"
              onClick={handleAddProduct}
            >
              {editingId ? "حفظ التعديلات" : "إضافة المنتج"}
            </button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-5 shadow-(--dash-shadow)"
          >
            <p className="text-sm text-(--dash-muted)">{card.label}</p>
            <p className={`mt-3 text-xl font-semibold ${card.tone}`}>{card.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-4 shadow-(--dash-shadow)">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm text-(--dash-text)"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 3a1 1 0 0 1 1 1v8.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1Zm-7 14a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1Z"
              />
            </svg>
            تصدير
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm text-(--dash-text)"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-6.8 9.06V20a1 1 0 0 1-1.45.9l-3-1.5a1 1 0 0 1-.55-.9v-4.84L3.2 5.6A1 1 0 0 1 3 5Z"
              />
            </svg>
            فلترة
          </button>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as ProductStatus | "all")}
              className="appearance-none rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-sm text-(--dash-text) focus:outline-none"
            >
              <option value="all">كل الحالات</option>
              <option value="متوفر">متوفر</option>
              <option value="منخفض">منخفض</option>
              <option value="نافد">نافد</option>
            </select>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--dash-muted-2)">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M7 10l5 5 5-5H7Z" />
              </svg>
            </span>
          </div>
          <div className="flex min-w-55 flex-1 items-center gap-2 rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm text-(--dash-text)">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-(--dash-muted-2)" aria-hidden="true">
              <path
                fill="currentColor"
                d="M10 2a8 8 0 1 0 5.29 14l4.7 4.7a1 1 0 0 0 1.42-1.4l-4.7-4.7A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="بحث بالاسم أو رمز المنتج..."
              className="w-full bg-transparent text-sm text-(--dash-text) placeholder:text-(--dash-muted-2) focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-2xl border border-(--dash-border) bg-(--dash-panel) shadow-(--dash-shadow)"
          >
            <div className="relative h-44 overflow-hidden">
              {product.imageTone.startsWith("/") ? (
                <Image
                  src={product.imageTone}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 25vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${product.imageTone}`} />
              )}
              <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[product.status]}`}>
                {product.status}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">{product.name}</h3>
                  <p className="mt-1 text-xs text-(--dash-muted)">{product.category}</p>
                </div>
                <span className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-2 py-1 text-xs text-(--dash-muted)">
                  {product.id}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-(--dash-muted)">
                <p>المورد: {product.supplier}</p>
                <p>رمز المنتج: {product.sku}</p>
              </div>
              <div className="my-3 border-t border-(--dash-border)" />
              <div className="grid grid-cols-2 gap-4 text-xs text-(--dash-muted)">
                <div>
                  <p className="font-semibold text-(--dash-text)">المخزون</p>
                  <p className={product.stock === 0 ? "text-(--dash-danger)" : "text-(--dash-success)"}>
                    {product.stock} قطعة
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-(--dash-text)">السعر</p>
                  <p className="text-(--dash-primary)">{formatCurrency(product.price)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-(--dash-border) px-3 py-2 text-xs text-(--dash-text) hover:bg-(--dash-panel-soft)"
                >
                  عرض
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-(--dash-border) px-3 py-2 text-xs text-(--dash-text) hover:bg-(--dash-panel-soft)"
                  onClick={() => handleEditProduct(product.id)}
                >
                  تعديل
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </DashboardShell>
  );
};

export default page;
