"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type BankAccount = {
  id: string;
  name: string;
  bankName: string;
  type: string;
  currency: string;
  balance: number;
  iban: string;
  branch: string;
};

type BankTransaction = {
  id: string;
  date: string;
  time: string;
  account: string;
  type: "إيداع" | "سحب";
  amount: number;
  currency: string;
  description: string;
  reference: string;
  status: "مكتمل" | "قيد المعالجة";
};

const accountTypes = ["حساب جاري", "حساب توفير"];
const currencies = ["ريال سعودي (SAR)", "دولار أمريكي (USD)"];

const accounts: BankAccount[] = [
  {
    id: "BANK-001",
    name: "البنك الأهلي - حساب جاري",
    bankName: "البنك الأهلي السعودي",
    type: "حساب جاري",
    currency: "SAR",
    balance: 458920.5,
    iban: "SA1234",
    branch: "الرياض - المركز",
  },
  {
    id: "BANK-002",
    name: "مصرف الراجحي - حساب توفير",
    bankName: "مصرف الراجحي",
    type: "حساب توفير",
    currency: "SAR",
    balance: 250000,
    iban: "SA4321",
    branch: "الرياض - العليا",
  },
  {
    id: "BANK-003",
    name: "HSBC - حساب بالدولار",
    bankName: "HSBC Saudi Arabia",
    type: "حساب جاري",
    currency: "USD",
    balance: 45200,
    iban: "SA5678",
    branch: "Riyadh Branch",
  },
];

const transactionsData: BankTransaction[] = [
  {
    id: "TRX-789456",
    date: "2026-01-16",
    time: "11:30",
    account: "البنك الأهلي - حساب جاري",
    type: "إيداع",
    amount: 50000,
    currency: "SAR",
    description: "تحويل من عميل - فاتورة INV-2345",
    reference: "INV-2345",
    status: "مكتمل",
  },
  {
    id: "TRX-789455",
    date: "2026-01-16",
    time: "10:00",
    account: "البنك الأهلي - حساب جاري",
    type: "سحب",
    amount: 25000,
    currency: "SAR",
    description: "دفع للمورد - فاتورة شراء PUR-456",
    reference: "PUR-456",
    status: "مكتمل",
  },
  {
    id: "TRX-789454",
    date: "2026-01-15",
    time: "14:20",
    account: "مصرف الراجحي - حساب توفير",
    type: "إيداع",
    amount: 100000,
    currency: "SAR",
    description: "إيداع رأس مال",
    reference: "CAP-001",
    status: "مكتمل",
  },
  {
    id: "TRX-789453",
    date: "2026-01-15",
    time: "09:00",
    account: "HSBC - حساب بالدولار",
    type: "إيداع",
    amount: 15000,
    currency: "USD",
    description: "تحويل دولي من عميل خارجي",
    reference: "INT-778",
    status: "قيد المعالجة",
  },
];

const formatCurrency = (value: number, currency: string) =>
  `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;

const page = () => {
  const [transactions, setTransactions] = useState<BankTransaction[]>(transactionsData);
  const [query, setQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState("كل الحسابات");
  const [typeFilter, setTypeFilter] = useState("كل المعاملات");
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [transactionModalMode, setTransactionModalMode] = useState<"view" | "edit" | null>(null);
  const [activeTransaction, setActiveTransaction] = useState<BankTransaction | null>(null);
  const [accountForm, setAccountForm] = useState({
    accountName: "",
    bankName: "",
    iban: "",
    accountType: "",
    currency: currencies[0],
    openingBalance: "0.00",
    branch: "",
  });
  const [transactionForm, setTransactionForm] = useState({
    account: "",
    type: "",
    amount: "0.00",
    description: "",
    reference: "",
  });

  const stats = useMemo(() => {
    const totalBalance = accounts
      .filter((account) => account.currency === "SAR")
      .reduce((sum, account) => sum + account.balance, 0);
    const deposits = transactions
      .filter((item) => item.type === "إيداع")
      .reduce((sum, item) => sum + item.amount, 0);
    const withdrawals = transactions
      .filter((item) => item.type === "سحب")
      .reduce((sum, item) => sum + item.amount, 0);
    return [
      {
        label: "إجمالي الرصيد",
        value: formatCurrency(totalBalance, "SAR"),
        tone: "text-(--dash-primary)",
      },
      {
        label: "إجمالي الإيداعات",
        value: formatCurrency(deposits, "SAR"),
        tone: "text-(--dash-success)",
      },
      {
        label: "إجمالي السحوبات",
        value: formatCurrency(withdrawals, "SAR"),
        tone: "text-(--dash-danger)",
      },
      {
        label: "عدد المعاملات",
        value: String(transactions.length),
        tone: "text-(--dash-info)",
      },
    ];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return transactions.filter((item) => {
      const matchesAccount = accountFilter === "كل الحسابات" || item.account === accountFilter;
      const matchesType = typeFilter === "كل المعاملات" || item.type === typeFilter;
      const matchesQuery = normalizedQuery
        ? [item.account, item.description, item.reference, item.date]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      return matchesAccount && matchesType && matchesQuery;
    });
  }, [transactions, accountFilter, typeFilter, query]);

  const handleAccountChange = (field: string, value: string) => {
    setAccountForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTransactionChange = (field: string, value: string) => {
    setTransactionForm((prev) => ({ ...prev, [field]: value }));
  };

  const openTransactionModal = (mode: "view" | "edit", transaction: BankTransaction) => {
    setTransactionModalMode(mode);
    setActiveTransaction(transaction);
    if (mode === "edit") {
      setTransactionForm({
        account: transaction.account,
        type: transaction.type,
        amount: String(transaction.amount),
        description: transaction.description,
        reference: transaction.reference === "-" ? "" : transaction.reference,
      });
    }
  };

  const closeTransactionModal = () => {
    setTransactionModalMode(null);
    setActiveTransaction(null);
  };

  const handleAccountSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowNewAccount(false);
    setAccountForm({
      accountName: "",
      bankName: "",
      iban: "",
      accountType: "",
      currency: currencies[0],
      openingBalance: "0.00",
      branch: "",
    });
  };

  const handleTransactionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amountValue = Number.parseFloat(transactionForm.amount);
    if (!transactionForm.account || !transactionForm.type || Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }
    const newTransaction: BankTransaction = {
      id: `TRX-${String(transactions.length + 1).padStart(6, "0")}`,
      date: "2026-01-16",
      time: "12:15",
      account: transactionForm.account,
      type: transactionForm.type as "إيداع" | "سحب",
      amount: amountValue,
      currency: transactionForm.account.includes("HSBC") ? "USD" : "SAR",
      description: transactionForm.description.trim() || "-",
      reference: transactionForm.reference.trim() || "-",
      status: "مكتمل",
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    setShowNewTransaction(false);
    setTransactionForm({
      account: "",
      type: "",
      amount: "0.00",
      description: "",
      reference: "",
    });
  };

  const handleTransactionEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeTransaction) {
      return;
    }
    const amountValue = Number.parseFloat(transactionForm.amount);
    if (!transactionForm.account || !transactionForm.type || Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === activeTransaction.id
          ? {
              ...item,
              account: transactionForm.account,
              type: transactionForm.type as "إيداع" | "سحب",
              amount: amountValue,
              description: transactionForm.description.trim() || "-",
              reference: transactionForm.reference.trim() || "-",
            }
          : item
      )
    );
    closeTransactionModal();
  };

  const renderTypeBadge = (type: BankTransaction["type"]) => {
    const isDeposit = type === "إيداع";
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isDeposit ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
        }`}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full ${
            isDeposit ? "bg-emerald-100" : "bg-rose-100"
          }`}
        >
          <svg viewBox="0 0 20 20" className={`h-3 w-3 ${isDeposit ? "text-emerald-600" : "text-rose-600"}`}>
            <path
              fill="currentColor"
              d={
                isDeposit
                  ? "M10 3l4.5 4.5-1.4 1.4L11 6.7V16H9V6.7L6.9 8.9 5.5 7.5z"
                  : "M10 17l-4.5-4.5 1.4-1.4L9 13.3V4h2v9.3l2.1-2.2 1.4 1.4z"
              }
            />
          </svg>
        </span>
        {type}
      </span>
    );
  };

  const renderStatusBadge = (status: BankTransaction["status"]) => {
    const isDone = status === "مكتمل";
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          isDone ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
        }`}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full ${
            isDone ? "bg-emerald-100" : "bg-amber-100"
          }`}
        >
          <svg viewBox="0 0 20 20" className={`h-3 w-3 ${isDone ? "text-emerald-600" : "text-amber-600"}`}>
            <path
              fill="currentColor"
              d={
                isDone
                  ? "M7.8 13.4l-3.2-3.2 1.4-1.4 1.8 1.8 6.3-6.3 1.4 1.4z"
                  : "M10 4a6 6 0 100 12 6 6 0 000-12zm.8 3.5v3.6H9.2V7.5h1.6zm0 5.2v1.6H9.2v-1.6h1.6z"
              }
            />
          </svg>
        </span>
        {status}
      </span>
    );
  };

  return (
    <DashboardShell
      title="البنوك"
      subtitle="إدارة الحسابات البنكية والمعاملات المصرفية"
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder="بحث عن الحسابات أو المعاملات..."
      headerAction={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewTransaction(true)}
            className="rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-2 text-xs text-(--dash-muted)"
          >
            معاملة جديدة
          </button>
          <button
            type="button"
            onClick={() => setShowNewAccount(true)}
            className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
          >
            + حساب بنكي جديد
          </button>
        </div>
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
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M4 12h16v2H4zm0-6h10v2H4zm0 12h6v2H4z"
                />
              </svg>
            </span>
          </div>
        ))}
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        {accounts.map((account) => (
          <div key={account.id} className="dash-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-(--dash-text)">{account.name}</h3>
                <p className="mt-1 text-xs text-(--dash-muted)">{account.bankName}</p>
              </div>
              <span className="dash-icon bg-(--dash-primary-soft) text-(--dash-primary)">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="currentColor"
                    d="M12 3l9 6v2H3V9zm-8 8h16v7H4zm2 2v3h2v-3zm4 0v3h2v-3zm4 0v3h2v-3zm4 0v3h2v-3z"
                  />
                </svg>
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full bg-(--dash-panel-soft) px-3 py-1 text-[11px] font-semibold text-(--dash-muted)">
                {account.type}
              </span>
              <span className="text-sm font-semibold text-(--dash-text)">
                {formatCurrency(account.balance, account.currency)}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-(--dash-muted)">
              <div>
                <p className="text-[10px]">رقم الحساب</p>
                <p className="mt-1 text-(--dash-text)">{account.iban}</p>
              </div>
              <div>
                <p className="text-[10px]">الفرع</p>
                <p className="mt-1 text-(--dash-text)">{account.branch}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="rounded-lg border border-(--dash-border) bg-white py-2 text-xs text-(--dash-muted)"
              >
                عرض
              </button>
              <button
                type="button"
                className="rounded-lg border border-(--dash-border) bg-white py-2 text-xs text-(--dash-muted)"
              >
                تعديل
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="dash-card">
        <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-(--dash-border) pb-4">
          <button className="dash-filter">تصدير</button>
          <select
            className="dash-select"
            value={accountFilter}
            onChange={(event) => setAccountFilter(event.target.value)}
          >
            <option>كل الحسابات</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.name}>
                {account.name}
              </option>
            ))}
          </select>
          <select
            className="dash-select"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option>كل المعاملات</option>
            <option value="إيداع">إيداع</option>
            <option value="سحب">سحب</option>
          </select>
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--dash-muted)">
              <path
                fill="currentColor"
                d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 10-.7.7l.3.3v.8l4.5 4.5 1.3-1.3zM10.5 15a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"
              />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="بحث في المعاملات..."
              className="dash-input pr-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-(--dash-muted)">
              <tr>
                <th className="px-3 py-3 text-right">التاريخ</th>
                <th className="px-3 py-3 text-right">الحساب البنكي</th>
                <th className="px-3 py-3 text-right">النوع</th>
                <th className="px-3 py-3 text-right">المبلغ</th>
                <th className="px-3 py-3 text-right">الوصف</th>
                <th className="px-3 py-3 text-right">المرجع</th>
                <th className="px-3 py-3 text-right">الحالة</th>
                <th className="px-3 py-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id} className="border-t border-(--dash-border)">
                  <td className="px-3 py-4 text-xs text-(--dash-muted)">
                    <p className="text-sm text-(--dash-text)">{item.date}</p>
                    <p>{item.time}</p>
                  </td>
                  <td className="px-3 py-4 text-xs text-(--dash-muted)">
                    <p className="text-sm text-(--dash-text)">{item.account}</p>
                    <p>{item.currency}</p>
                  </td>
                  <td className="px-3 py-4">{renderTypeBadge(item.type)}</td>
                  <td className="px-3 py-4">
                    <span
                      className={`text-sm font-semibold ${
                        item.type === "إيداع" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {formatCurrency(item.amount, item.currency)}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-xs text-(--dash-muted)">{item.description}</td>
                  <td className="px-3 py-4 text-xs text-(--dash-muted)">{item.reference}</td>
                  <td className="px-3 py-4">{renderStatusBadge(item.status)}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openTransactionModal("view", item)}
                        className="rounded-lg border border-(--dash-border) p-2 text-(--dash-muted)"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4">
                          <path
                            fill="currentColor"
                            d="M12 5c5 0 9 5.3 9 7s-4 7-9 7-9-5.3-9-7 4-7 9-7zm0 2c-3.6 0-6.6 3.5-7 5 .4 1.5 3.4 5 7 5s6.6-3.5 7-5c-.4-1.5-3.4-5-7-5zm0 2.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => openTransactionModal("edit", item)}
                        className="rounded-lg border border-(--dash-border) p-2 text-(--dash-muted)"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4">
                          <path
                            fill="currentColor"
                            d="M4 16.8V20h3.2l9.4-9.4-3.2-3.2L4 16.8zm15.7-9.5c.4-.4.4-1 0-1.4l-1.6-1.6c-.4-.4-1-.4-1.4 0l-1.3 1.3 3.2 3.2z"
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

      {showNewAccount && (
        <div className="dash-modal">
          <div className="dash-modal-body max-w-xl">
            <div className="flex items-center justify-between border-b border-(--dash-border) pb-3">
              <div>
                <h3 className="text-sm font-semibold text-(--dash-text)">إضافة حساب بنكي جديد</h3>
                <p className="mt-1 text-xs text-(--dash-muted)">إنشاء حساب بنكي جديد لتتبع المعاملات المصرفية.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAccount(false)}
                className="rounded-lg border border-(--dash-border) px-2 py-1 text-xs text-(--dash-muted)"
              >
                إغلاق
              </button>
            </div>
            <form onSubmit={handleAccountSubmit} className="mt-4">
              <div className="dash-scroll max-h-[60vh] space-y-4 overflow-y-auto pr-1">
                <label className="dash-label">
                  اسم الحساب
                  <input
                    value={accountForm.accountName}
                    onChange={(event) => handleAccountChange("accountName", event.target.value)}
                    className="dash-input mt-2"
                    placeholder="مثال: البنك الأهلي - حساب جاري"
                  />
                </label>
                <label className="dash-label">
                  اسم البنك
                  <input
                    value={accountForm.bankName}
                    onChange={(event) => handleAccountChange("bankName", event.target.value)}
                    className="dash-input mt-2"
                    placeholder="مثال: البنك الأهلي السعودي"
                  />
                </label>
                <label className="dash-label">
                  رقم الحساب (IBAN)
                  <input
                    value={accountForm.iban}
                    onChange={(event) => handleAccountChange("iban", event.target.value)}
                    className="dash-input mt-2"
                    placeholder="SA..."
                  />
                </label>
                <label className="dash-label">
                  نوع الحساب
                  <select
                    value={accountForm.accountType}
                    onChange={(event) => handleAccountChange("accountType", event.target.value)}
                    className="dash-select mt-2"
                  >
                    <option value="">اختر نوع الحساب</option>
                    {accountTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="dash-label">
                  العملة
                  <select
                    value={accountForm.currency}
                    onChange={(event) => handleAccountChange("currency", event.target.value)}
                    className="dash-select mt-2"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="dash-label">
                  الرصيد الافتتاحي
                  <input
                    value={accountForm.openingBalance}
                    onChange={(event) => handleAccountChange("openingBalance", event.target.value)}
                    className="dash-input mt-2"
                    placeholder="0.00"
                  />
                </label>
                <label className="dash-label">
                  الفرع
                  <input
                    value={accountForm.branch}
                    onChange={(event) => handleAccountChange("branch", event.target.value)}
                    className="dash-input mt-2"
                    placeholder="مثال: الرياض - المركز"
                  />
                </label>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewAccount(false)}
                  className="rounded-lg border border-(--dash-border) px-4 py-2 text-xs text-(--dash-muted)"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewTransaction && (
        <div className="dash-modal">
          <div className="dash-modal-body max-w-lg">
            <div className="flex items-center justify-between border-b border-(--dash-border) pb-3">
              <div>
                <h3 className="text-sm font-semibold text-(--dash-text)">إضافة معاملة بنكية</h3>
                <p className="mt-1 text-xs text-(--dash-muted)">تسجيل إيداع أو سحب في الحساب البنكي.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewTransaction(false)}
                className="rounded-lg border border-(--dash-border) px-2 py-1 text-xs text-(--dash-muted)"
              >
                إغلاق
              </button>
            </div>
            <form onSubmit={handleTransactionSubmit} className="mt-4 space-y-4">
              <label className="dash-label">
                الحساب البنكي
                <select
                  value={transactionForm.account}
                  onChange={(event) => handleTransactionChange("account", event.target.value)}
                  className="dash-select mt-2"
                >
                  <option value="">اختر الحساب البنكي</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.name}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="dash-label">
                نوع المعاملة
                <select
                  value={transactionForm.type}
                  onChange={(event) => handleTransactionChange("type", event.target.value)}
                  className="dash-select mt-2"
                >
                  <option value="">اختر نوع المعاملة</option>
                  <option value="إيداع">إيداع</option>
                  <option value="سحب">سحب</option>
                </select>
              </label>
              <label className="dash-label">
                المبلغ
                <input
                  value={transactionForm.amount}
                  onChange={(event) => handleTransactionChange("amount", event.target.value)}
                  className="dash-input mt-2"
                  placeholder="0.00"
                />
              </label>
              <label className="dash-label">
                الوصف
                <input
                  value={transactionForm.description}
                  onChange={(event) => handleTransactionChange("description", event.target.value)}
                  className="dash-input mt-2"
                  placeholder="وصف المعاملة"
                />
              </label>
              <label className="dash-label">
                رقم المرجع
                <input
                  value={transactionForm.reference}
                  onChange={(event) => handleTransactionChange("reference", event.target.value)}
                  className="dash-input mt-2"
                  placeholder="رقم مرجع المعاملة"
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTransaction(false)}
                  className="rounded-lg border border-(--dash-border) px-4 py-2 text-xs text-(--dash-muted)"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {transactionModalMode && activeTransaction && (
        <div className="dash-modal">
          <div className="dash-modal-body max-w-lg">
            <div className="flex items-center justify-between border-b border-(--dash-border) pb-3">
              <div>
                <h3 className="text-sm font-semibold text-(--dash-text)">
                  {transactionModalMode === "view" ? "عرض المعاملة" : "تعديل المعاملة"}
                </h3>
                <p className="mt-1 text-xs text-(--dash-muted)">رقم المعاملة: {activeTransaction.id}</p>
              </div>
              <button
                type="button"
                onClick={closeTransactionModal}
                className="rounded-lg border border-(--dash-border) px-2 py-1 text-xs text-(--dash-muted)"
              >
                إغلاق
              </button>
            </div>
            {transactionModalMode === "view" ? (
              <div className="mt-4 space-y-3 text-sm text-(--dash-muted)">
                <div className="flex items-center justify-between">
                  <span>الحساب البنكي</span>
                  <span className="font-semibold text-(--dash-text)">{activeTransaction.account}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>النوع</span>
                  {renderTypeBadge(activeTransaction.type)}
                </div>
                <div className="flex items-center justify-between">
                  <span>المبلغ</span>
                  <span className="font-semibold text-(--dash-text)">
                    {formatCurrency(activeTransaction.amount, activeTransaction.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الوصف</span>
                  <span className="font-semibold text-(--dash-text)">{activeTransaction.description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>المرجع</span>
                  <span className="font-semibold text-(--dash-text)">{activeTransaction.reference}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>الحالة</span>
                  {renderStatusBadge(activeTransaction.status)}
                </div>
              </div>
            ) : (
              <form onSubmit={handleTransactionEditSubmit} className="mt-4 space-y-4">
                <label className="dash-label">
                  الحساب البنكي
                  <select
                    value={transactionForm.account}
                    onChange={(event) => handleTransactionChange("account", event.target.value)}
                    className="dash-select mt-2"
                  >
                    <option value="">اختر الحساب البنكي</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.name}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="dash-label">
                  نوع المعاملة
                  <select
                    value={transactionForm.type}
                    onChange={(event) => handleTransactionChange("type", event.target.value)}
                    className="dash-select mt-2"
                  >
                    <option value="">اختر نوع المعاملة</option>
                    <option value="إيداع">إيداع</option>
                    <option value="سحب">سحب</option>
                  </select>
                </label>
                <label className="dash-label">
                  المبلغ
                  <input
                    value={transactionForm.amount}
                    onChange={(event) => handleTransactionChange("amount", event.target.value)}
                    className="dash-input mt-2"
                    placeholder="0.00"
                  />
                </label>
                <label className="dash-label">
                  الوصف
                  <input
                    value={transactionForm.description}
                    onChange={(event) => handleTransactionChange("description", event.target.value)}
                    className="dash-input mt-2"
                    placeholder="وصف المعاملة"
                  />
                </label>
                <label className="dash-label">
                  رقم المرجع
                  <input
                    value={transactionForm.reference}
                    onChange={(event) => handleTransactionChange("reference", event.target.value)}
                    className="dash-input mt-2"
                    placeholder="رقم مرجع المعاملة"
                  />
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeTransactionModal}
                    className="rounded-lg border border-(--dash-border) px-4 py-2 text-xs text-(--dash-muted)"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white"
                  >
                    حفظ التعديل
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default page;
