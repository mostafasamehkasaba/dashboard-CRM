
"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type Vault = {
  id: string;
  name: string;
  location: string;
  balance: number;
  currency: string;
  minBalance: number;
};

type Movement = {
  id: string;
  date: string;
  time: string;
  vault: string;
  type: "إيداع" | "سحب";
  amount: number;
  currency: string;
  description: string;
  reference: string;
};

const vaults: Vault[] = [
  {
    id: "VAULT-USD",
    name: "خزنة الدولار",
    location: "الفرع الرئيسي",
    balance: 8500,
    currency: "USD",
    minBalance: 5000,
  },
  {
    id: "VAULT-NORTH",
    name: "خزنة الفرع الشمالي",
    location: "الفرع الشمالي",
    balance: 45200.5,
    currency: "SAR",
    minBalance: 20000,
  },
  {
    id: "VAULT-MAIN",
    name: "الخزنة الرئيسية",
    location: "الفرع الرئيسي",
    balance: 125450.75,
    currency: "SAR",
    minBalance: 50000,
  },
];

const movementsData: Movement[] = [
  {
    id: "MOV-001",
    date: "2026-01-16",
    time: "10:30",
    vault: "الخزنة الرئيسية",
    type: "إيداع",
    amount: 15000,
    currency: "SAR",
    description: "تحصيل من عميل - فاتورة INV-1234",
    reference: "INV-1234",
  },
  {
    id: "MOV-002",
    date: "2026-01-16",
    time: "09:15",
    vault: "الخزنة الرئيسية",
    type: "سحب",
    amount: 5000,
    currency: "SAR",
    description: "دفع مصروف - فاتورة الكهرباء",
    reference: "EXP-456",
  },
  {
    id: "MOV-003",
    date: "2026-01-15",
    time: "14:20",
    vault: "خزنة الفرع الشمالي",
    type: "إيداع",
    amount: 8500,
    currency: "SAR",
    description: "تحصيل نقدي من عميل",
    reference: "PMT-789",
  },
];

const formatCurrency = (value: number, currency: string) =>
  `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;

const page = () => {
  const [movements, setMovements] = useState<Movement[]>(movementsData);
  const [vaultFilter, setVaultFilter] = useState("كل الخزن");
  const [movementFilter, setMovementFilter] = useState("كل الحركات");
  const [query, setQuery] = useState("");
  const [showNewMovement, setShowNewMovement] = useState(false);
  const [showNewVault, setShowNewVault] = useState(false);
  const [movementModalMode, setMovementModalMode] = useState<"view" | "edit" | null>(null);
  const [activeMovement, setActiveMovement] = useState<Movement | null>(null);
  const [movementForm, setMovementForm] = useState({
    vault: "الخزنة الرئيسية",
    type: "إيداع",
    amount: "",
    currency: "SAR",
    date: "2026-01-16",
    time: "12:00",
    description: "",
    reference: "",
  });
  const [vaultForm, setVaultForm] = useState({
    name: "",
    location: "الفرع الرئيسي",
    balance: "",
    currency: "SAR",
    minBalance: "",
  });

  const totalBalance = useMemo(
    () => vaults.reduce((sum, vault) => sum + vault.balance, 0),
    []
  );
  const totalDeposits = useMemo(
    () =>
      movements
        .filter((movement) => movement.type === "إيداع")
        .reduce((sum, movement) => sum + movement.amount, 0),
    [movements]
  );
  const totalWithdrawals = useMemo(
    () =>
      movements
        .filter((movement) => movement.type === "سحب")
        .reduce((sum, movement) => sum + movement.amount, 0),
    [movements]
  );

  const filteredMovements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return movements.filter((movement) => {
      const matchesVault = vaultFilter === "كل الخزن" || movement.vault === vaultFilter;
      const matchesType = movementFilter === "كل الحركات" || movement.type === movementFilter;
      const matchesQuery = normalizedQuery
        ? [movement.vault, movement.type, movement.description, movement.reference, movement.date]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      return matchesVault && matchesType && matchesQuery;
    });
  }, [movements, vaultFilter, movementFilter, query]);

  const handleMovementChange = (field: string, value: string) => {
    setMovementForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleVaultChange = (field: string, value: string) => {
    setVaultForm((prev) => ({ ...prev, [field]: value }));
  };

  const openMovementModal = (mode: "view" | "edit", movement: Movement) => {
    setMovementModalMode(mode);
    setActiveMovement(movement);
    if (mode === "edit") {
      setMovementForm({
        vault: movement.vault,
        type: movement.type,
        amount: String(movement.amount),
        currency: movement.currency,
        date: movement.date,
        time: movement.time,
        description: movement.description,
        reference: movement.reference === "-" ? "" : movement.reference,
      });
    }
  };

  const closeMovementModal = () => {
    setMovementModalMode(null);
    setActiveMovement(null);
  };

  const handleMovementSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amountValue = Number.parseFloat(movementForm.amount);
    if (!movementForm.description.trim() || Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }
    const newMovement: Movement = {
      id: `MOV-${String(movements.length + 1).padStart(3, "0")}`,
      date: movementForm.date,
      time: movementForm.time,
      vault: movementForm.vault,
      type: movementForm.type as "إيداع" | "سحب",
      amount: amountValue,
      currency: movementForm.currency,
      description: movementForm.description.trim(),
      reference: movementForm.reference.trim() || "-",
    };
    setMovements((prev) => [newMovement, ...prev]);
    setShowNewMovement(false);
    setMovementForm({
      vault: "الخزنة الرئيسية",
      type: "إيداع",
      amount: "",
      currency: "SAR",
      date: movementForm.date,
      time: movementForm.time,
      description: "",
      reference: "",
    });
  };

  const handleMovementEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeMovement) {
      return;
    }
    const amountValue = Number.parseFloat(movementForm.amount);
    if (!movementForm.description.trim() || Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }
    setMovements((prev) =>
      prev.map((movement) =>
        movement.id === activeMovement.id
          ? {
              ...movement,
              vault: movementForm.vault,
              type: movementForm.type as "إيداع" | "سحب",
              amount: amountValue,
              currency: movementForm.currency,
              date: movementForm.date,
              time: movementForm.time,
              description: movementForm.description.trim(),
              reference: movementForm.reference.trim() || "-",
            }
          : movement
      )
    );
    closeMovementModal();
  };

  const handleVaultSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowNewVault(false);
    setVaultForm({
      name: "",
      location: "الفرع الرئيسي",
      balance: "",
      currency: "SAR",
      minBalance: "",
    });
  };

  return (
    <DashboardShell
      title="الخزنة"
      subtitle="إدارة الخزن النقدية والحركات المالية"
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="بحث في الخزن أو الحركات..."
      headerAction={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewMovement(true)}
            className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
          >
            حركة جديدة
          </button>
          <button
            type="button"
            onClick={() => setShowNewVault(true)}
            className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
          >
            خزنة جديدة +
          </button>
        </div>
      }
    >
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 shadow-(--dash-shadow)">
            <div>
              <p className="text-sm text-(--dash-muted)">إجمالي الرصيد</p>
              <p className="mt-2 text-2xl font-semibold text-(--dash-text)">
                {formatCurrency(totalBalance, "SAR")}
              </p>
            </div>
            <span className="rounded-2xl bg-(--dash-panel-glass) p-3 text-(--dash-primary)">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M4 6h16a2 2 0 0 1 2 2v2H2V8a2 2 0 0 1 2-2Zm-2 8h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4Zm5 2h6a1 1 0 0 0 0-2H7a1 1 0 0 0 0 2Z"
                />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 shadow-(--dash-shadow)">
            <div>
              <p className="text-sm text-(--dash-muted)">إجمالي الإيداعات</p>
              <p className="mt-2 text-2xl font-semibold text-(--dash-success)">
                {formatCurrency(totalDeposits, "SAR")}
              </p>
            </div>
            <span className="rounded-2xl bg-(--dash-panel-glass) p-3 text-(--dash-success)">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 3 2 21h20L12 3Zm0 5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Z"
                />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 shadow-(--dash-shadow)">
            <div>
              <p className="text-sm text-(--dash-muted)">إجمالي السحوبات</p>
              <p className="mt-2 text-2xl font-semibold text-(--dash-danger)">
                {formatCurrency(totalWithdrawals, "SAR")}
              </p>
            </div>
            <span className="rounded-2xl bg-(--dash-panel-glass) p-3 text-(--dash-danger)">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 3 2 21h20L12 3Zm0 5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Z"
                />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-(--dash-border) bg-(--dash-panel-soft) p-4 shadow-(--dash-shadow)">
            <div>
              <p className="text-sm text-(--dash-muted)">عدد الحركات</p>
              <p className="mt-2 text-2xl font-semibold text-(--dash-text)">{movements.length}</p>
            </div>
            <span className="rounded-2xl bg-(--dash-panel-glass) p-3 text-(--dash-info)">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
                />
              </svg>
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        {vaults.map((vault) => (
          <div
            key={vault.id}
            className="flex flex-col rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-5 shadow-(--dash-shadow)"
          >
            <div className="flex items-start justify-between">
              <span className="rounded-lg bg-(--dash-primary) px-2 py-1 text-xs font-semibold text-white">
                نشط
              </span>
              <span className="rounded-xl bg-(--dash-panel-glass) p-2 text-(--dash-primary)">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M4 6h16a2 2 0 0 1 2 2v2H2V8a2 2 0 0 1 2-2Zm-2 8h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4Z"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold">{vault.name}</p>
              <p className="text-xs text-(--dash-muted)">{vault.location}</p>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div>
                <p className="text-xs text-(--dash-muted)">الرصيد الحالي</p>
                <p className="mt-1 text-lg font-semibold">
                  {formatCurrency(vault.balance, vault.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-(--dash-muted)">الرصيد المستهدف</p>
                <p className="mt-1 text-xs text-(--dash-muted)">
                  {formatCurrency(vault.minBalance, vault.currency)}
                </p>
              </div>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2 pt-5 text-xs">
              <button
                type="button"
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-muted)"
              >
                تعديل
              </button>
              <button
                type="button"
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-(--dash-muted)"
              >
                عرض
              </button>
            </div>
          </div>
        ))}
      </section>
      <section className="mt-6">
        <div className="rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-muted)"
              >
                فلتر
              </button>
              <select
                value={vaultFilter}
                onChange={(event) => setVaultFilter(event.target.value)}
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
              >
                <option value="كل الخزن">كل الخزن</option>
                {vaults.map((vault) => (
                  <option key={vault.id} value={vault.name}>
                    {vault.name}
                  </option>
                ))}
              </select>
              <select
                value={movementFilter}
                onChange={(event) => setMovementFilter(event.target.value)}
                className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-xs text-(--dash-text)"
              >
                <option value="كل الحركات">كل الحركات</option>
                <option value="إيداع">إيداع</option>
                <option value="سحب">سحب</option>
              </select>
            </div>
            <span className="text-xs text-(--dash-muted)">آخر الحركات المالية</span>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-(--dash-border)">
            <div className="grid min-w-[980px] grid-cols-7 gap-4 border-b border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3 text-xs font-semibold text-(--dash-muted)">
              <span className="text-right">التاريخ</span>
              <span className="text-right">الخزنة</span>
              <span className="text-right">النوع</span>
              <span className="text-right">المبلغ</span>
              <span className="text-right">الوصف</span>
              <span className="text-right">المرجع</span>
              <span className="text-right">الإجراءات</span>
            </div>
            {filteredMovements.map((movement) => (
              <div
                key={movement.id}
                className="grid min-w-[980px] grid-cols-7 gap-4 border-b border-(--dash-border) px-4 py-3 text-sm text-(--dash-text) last:border-b-0"
              >
                <span>
                  <span className="block">{movement.date}</span>
                  <span className="text-xs text-(--dash-muted)">{movement.time}</span>
                </span>
                <span>{movement.vault}</span>
                <span className="flex">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      movement.type === "إيداع"
                        ? "bg-(--dash-success) text-white"
                        : "bg-(--dash-danger) text-white"
                    }`}
                  >
                    {movement.type === "إيداع" ? (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path fill="currentColor" d="M12 4 5 11h4v9h6v-9h4l-7-7Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                        <path fill="currentColor" d="M12 20 5 13h4V4h6v9h4l-7 7Z" />
                      </svg>
                    )}
                    {movement.type}
                  </span>
                </span>
                <span className={movement.type === "إيداع" ? "text-(--dash-success)" : "text-(--dash-danger)"}>
                  {formatCurrency(movement.amount, movement.currency)}
                </span>
                <span>{movement.description}</span>
                <span className="text-(--dash-muted)">{movement.reference}</span>
                <div className="flex items-center gap-3 text-(--dash-muted)">
                  <button
                    type="button"
                    onClick={() => openMovementModal("view", movement)}
                    className="text-xs text-(--dash-primary) hover:underline"
                  >
                    عرض
                  </button>
                  <button
                    type="button"
                    onClick={() => openMovementModal("edit", movement)}
                    className="text-xs text-(--dash-primary) hover:underline"
                  >
                    تعديل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {showNewMovement ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">حركة جديدة</h3>
              <button
                type="button"
                onClick={() => setShowNewMovement(false)}
                className="text-sm text-(--dash-muted)"
              >
                إغلاق
              </button>
            </div>
            <form onSubmit={handleMovementSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-(--dash-muted)">الخزنة</label>
                  <select
                    value={movementForm.vault}
                    onChange={(event) => handleMovementChange("vault", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  >
                    {vaults.map((vault) => (
                      <option key={vault.id} value={vault.name}>
                        {vault.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-(--dash-muted)">النوع</label>
                  <select
                    value={movementForm.type}
                    onChange={(event) => handleMovementChange("type", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  >
                    <option value="إيداع">إيداع</option>
                    <option value="سحب">سحب</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-(--dash-muted)">المبلغ</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={movementForm.amount}
                    onChange={(event) => handleMovementChange("amount", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-(--dash-muted)">العملة</label>
                  <select
                    value={movementForm.currency}
                    onChange={(event) => handleMovementChange("currency", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  >
                    <option value="SAR">SAR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-(--dash-muted)">التاريخ</label>
                  <input
                    type="date"
                    value={movementForm.date}
                    onChange={(event) => handleMovementChange("date", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-(--dash-muted)">الوقت</label>
                  <input
                    type="time"
                    value={movementForm.time}
                    onChange={(event) => handleMovementChange("time", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-(--dash-muted)">الوصف</label>
                <input
                  type="text"
                  value={movementForm.description}
                  onChange={(event) => handleMovementChange("description", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-(--dash-muted)">المرجع</label>
                <input
                  type="text"
                  value={movementForm.reference}
                  onChange={(event) => handleMovementChange("reference", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewMovement(false)}
                  className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
                >
                  حفظ الحركة
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      {movementModalMode ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {movementModalMode === "view" ? "تفاصيل الحركة" : "تعديل الحركة"}
              </h3>
              <button type="button" onClick={closeMovementModal} className="text-sm text-(--dash-muted)">
                إغلاق
              </button>
            </div>

            {movementModalMode === "view" && activeMovement ? (
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">الخزنة</span>
                  <span>{activeMovement.vault}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">النوع</span>
                  <span>{activeMovement.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">المبلغ</span>
                  <span className="font-semibold">
                    {formatCurrency(activeMovement.amount, activeMovement.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">التاريخ</span>
                  <span>
                    {activeMovement.date} - {activeMovement.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">الوصف</span>
                  <span>{activeMovement.description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--dash-muted)">المرجع</span>
                  <span>{activeMovement.reference}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMovementEditSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-(--dash-muted)">الخزنة</label>
                    <select
                      value={movementForm.vault}
                      onChange={(event) => handleMovementChange("vault", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    >
                      {vaults.map((vault) => (
                        <option key={vault.id} value={vault.name}>
                          {vault.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-(--dash-muted)">النوع</label>
                    <select
                      value={movementForm.type}
                      onChange={(event) => handleMovementChange("type", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    >
                      <option value="إيداع">إيداع</option>
                      <option value="سحب">سحب</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-(--dash-muted)">المبلغ</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={movementForm.amount}
                      onChange={(event) => handleMovementChange("amount", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-(--dash-muted)">العملة</label>
                    <select
                      value={movementForm.currency}
                      onChange={(event) => handleMovementChange("currency", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    >
                      <option value="SAR">SAR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-(--dash-muted)">التاريخ</label>
                    <input
                      type="date"
                      value={movementForm.date}
                      onChange={(event) => handleMovementChange("date", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-(--dash-muted)">الوقت</label>
                    <input
                      type="time"
                      value={movementForm.time}
                      onChange={(event) => handleMovementChange("time", event.target.value)}
                      className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-(--dash-muted)">الوصف</label>
                  <input
                    type="text"
                    value={movementForm.description}
                    onChange={(event) => handleMovementChange("description", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-(--dash-muted)">المرجع</label>
                  <input
                    type="text"
                    value={movementForm.reference}
                    onChange={(event) => handleMovementChange("reference", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeMovementModal}
                    className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
                  >
                    حفظ التعديل
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
      {showNewVault ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-(--dash-border) bg-(--dash-panel) p-6 shadow-(--dash-shadow)">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">إضافة خزنة جديدة</h3>
              <button
                type="button"
                onClick={() => setShowNewVault(false)}
                className="text-sm text-(--dash-muted)"
              >
                إغلاق
              </button>
            </div>
            <form onSubmit={handleVaultSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs text-(--dash-muted)">اسم الخزنة</label>
                <input
                  type="text"
                  value={vaultForm.name}
                  onChange={(event) => handleVaultChange("name", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-(--dash-muted)">الموقع</label>
                  <input
                    type="text"
                    value={vaultForm.location}
                    onChange={(event) => handleVaultChange("location", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-(--dash-muted)">العملة</label>
                  <select
                    value={vaultForm.currency}
                    onChange={(event) => handleVaultChange("currency", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  >
                    <option value="SAR">SAR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-(--dash-muted)">الرصيد الحالي</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={vaultForm.balance}
                    onChange={(event) => handleVaultChange("balance", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-(--dash-muted)">الرصيد المستهدف</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={vaultForm.minBalance}
                    onChange={(event) => handleVaultChange("minBalance", event.target.value)}
                    className="mt-2 w-full rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewVault(false)}
                  className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
                >
                  حفظ الخزنة
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
};

export default page;
