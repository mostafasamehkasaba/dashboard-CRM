"use client";

import { useMemo, useState } from "react";
import DashboardShell from "../components/DashboardShell";

type Wallet = {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
  status: "نشط" | "معلق";
  accent: "primary" | "success" | "warning" | "info";
};

type WalletMovement = {
  id: string;
  date: string;
  time: string;
  title: string;
  amount: number;
  currency: string;
  type: "ï§Ÿã" | "«¥ ";
  reference: string;
};

const wallets: Wallet[] = [
  {
    id: "WAL-001",
    name: "Ÿé ëè Ÿéšìéï",
    type: " ëè",
    currency: "SAR",
    balance: 250000,
    status: "نشط",
    accent: "primary",
  },
  {
    id: "WAL-002",
    name: "Ÿé ëè Ÿé©Ÿ¤¥ï",
    type: " ëè",
    currency: "SAR",
    balance: 180000,
    status: "نشط",
    accent: "primary",
  },
  {
    id: "WAL-003",
    name: "Ÿé­ë§íç Ÿéëç§ï",
    type: "ëç§ï",
    currency: "SAR",
    balance: 85000,
    status: "نشط",
    accent: "success",
  },
  {
    id: "WAL-004",
    name: "¥«Ÿ  §íéŸ©",
    type: " ëè",
    currency: "USD",
    balance: 15000,
    status: "نشط",
    accent: "info",
  },
  {
    id: "WAL-005",
    name: " áŸç¡ ê§î",
    type: " áŸç¡",
    currency: "SAR",
    balance: 45000,
    status: "نشط",
    accent: "warning",
  },
];

const movements: WalletMovement[] = [
  {
    id: "MOV-901",
    date: "2026-01-16",
    time: "10:30",
    title: "ï§Ÿã ê ïãŸ¢",
    amount: 15000,
    currency: "SAR",
    type: "ï§Ÿã",
    reference: "INV-901",
  },
  {
    id: "MOV-902",
    date: "2026-01-15",
    time: "14:10",
    title: "åŸ¢í©¡ èì© Ÿ˜",
    amount: 1500,
    currency: "SAR",
    type: "«¥ ",
    reference: "EXP-201",
  },
  {
    id: "MOV-903",
    date: "2026-01-14",
    time: "09:20",
    title: "ê­©íåŸ¢ ¢¬äïéï¡",
    amount: 850,
    currency: "SAR",
    type: "«¥ ",
    reference: "EXP-202",
  },
  {
    id: "MOV-904",
    date: "2026-01-12",
    time: "16:40",
    title: "¢¥íïé êë ãêïé",
    amount: 25000,
    currency: "SAR",
    type: "ï§Ÿã",
    reference: "PAY-101",
  },
  {
    id: "MOV-905",
    date: "2026-01-10",
    time: "11:45",
    title: "åŸ¢í©¡ ­ïŸë¡",
    amount: 3200,
    currency: "SAR",
    type: "«¥ ",
    reference: "EXP-203",
  },
];

const formatCurrency = (value: number, currency: string) =>
  `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;

const page = () => {
  const [walletsData, setWalletsData] = useState<Wallet[]>(wallets);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("èé ŸéšëíŸã");
  const [statusFilter, setStatusFilter] = useState("كل الحالات");
  const [showNewWallet, setShowNewWallet] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: " ëè",
    currency: "SAR",
    balance: "0.00",
    status: "نشط",
  });

  const stats = useMemo(() => {
    const totalWallets = walletsData.length;
    const totalBalance = walletsData.reduce((sum, wallet) => sum + (wallet.currency === "SAR" ? wallet.balance : 0), 0);
    const deposits = movements.filter((item) => item.type === "ï§Ÿã").reduce((sum, item) => sum + item.amount, 0);
    const withdrawals = movements.filter((item) => item.type === "«¥ ").reduce((sum, item) => sum + item.amount, 0);
    return [
      {
        label: "ã§§ Ÿéê¥Ÿåâ",
        value: totalWallets.toString(),
        tone: "text-(--dash-primary)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2h-2V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v2H3V7Zm0 5h18v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-5Zm4 2a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2H7Z"
            />
          </svg>
        ),
      },
      {
        label: "Ÿéê­©íåŸ¢",
        value: formatCurrency(withdrawals, "SAR"),
        tone: "text-(--dash-danger)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M12 20 5 13h4V4h6v9h4l-7 7Z" />
          </svg>
        ),
      },
      {
        label: "Ÿé§¦é",
        value: formatCurrency(deposits, "SAR"),
        tone: "text-(--dash-success)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M12 4 5 11h4v9h6v-9h4l-7-7Z" />
          </svg>
        ),
      },
      {
        label: "¤êŸéï Ÿé©­ï§",
        value: formatCurrency(totalBalance, "SAR"),
        tone: "text-(--dash-primary)",
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="currentColor"
              d="M12 2a1 1 0 0 1 1 1v1.1a6.5 6.5 0 0 1 4.5 2.1l-1.4 1.4A4.5 4.5 0 0 0 13 6.1V9h2a1 1 0 1 1 0 2h-2v1.9a2.5 2.5 0 0 0 2.5 2.5H16a1 1 0 1 1 0 2h-.5A4.5 4.5 0 0 1 12 15.4V11H10a1 1 0 1 1 0-2h2V6.1a4.5 4.5 0 0 0-3.1 1.3L7.5 6A6.5 6.5 0 0 1 11 4.1V3a1 1 0 0 1 1-1Z"
            />
          </svg>
        ),
      },
    ];
  }, [walletsData]);

  const filteredWallets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return walletsData.filter((wallet) => {
      const matchesType = typeFilter === "èé ŸéšëíŸã" || wallet.type === typeFilter;
      const matchesStatus = statusFilter === "كل الحالات" || wallet.status === statusFilter;
      const matchesQuery = normalizedQuery
        ? [wallet.name, wallet.type, wallet.currency]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;
      return matchesType && matchesStatus && matchesQuery;
    });
  }, [walletsData, query, typeFilter, statusFilter]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      return;
    }
    const balanceValue = Number.parseFloat(formData.balance);
    const accent: Wallet["accent"] =
      formData.type === "ëç§ï"
        ? "success"
        : formData.type === " áŸç¡"
          ? "warning"
          : formData.currency === "USD"
            ? "info"
            : "primary";
    const newWallet: Wallet = {
      id: `WAL-${String(walletsData.length + 1).padStart(3, "0")}`,
      name: formData.name.trim(),
      type: formData.type,
      currency: formData.currency,
      balance: Number.isNaN(balanceValue) ? 0 : balanceValue,
      status: formData.status,
      accent,
    };
    setWalletsData((prev) => [newWallet, ...prev]);
    setShowNewWallet(false);
    setFormData({
      name: "",
      type: " ëè",
      currency: "SAR",
      balance: "0.00",
      status: "نشط",
    });
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setShowNewWallet(false);
    }
  };

  const accentIcon = (accent: Wallet["accent"]) => {
    if (accent === "success") {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path fill="currentColor" d="M4 7h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4Z" />
        </svg>
      );
    }
    if (accent === "warning") {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path fill="currentColor" d="M4 6h16v12H4z" />
        </svg>
      );
    }
    if (accent === "info") {
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path fill="currentColor" d="M5 6h14v12H5z" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4">
        <path fill="currentColor" d="M6 7h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6Z" />
      </svg>
    );
  };

  const accentClasses: Record<Wallet["accent"], string> = {
    primary: "text-(--dash-primary) bg-(--dash-panel-soft)",
    success: "text-emerald-600 bg-emerald-50",
    warning: "text-amber-600 bg-amber-50",
    info: "text-sky-600 bg-sky-50",
  };

  return (
    <DashboardShell
      title="Ÿéê¥Ÿåâ ŸéêŸéï¡"
      subtitle="§Ÿ©¡ Ÿéê¥Ÿåâ ŸéêŸéï¡ íŸé¥«Ÿ Ÿ¢ Ÿé ëèï¡"
      searchValue={query}
      onSearchChange={setQuery}
      searchPlaceholder=" ¥£ åï Ÿéê¥Ÿåâ ŸéêŸéï¡..."
      headerAction={
        <button
          type="button"
          onClick={() => setShowNewWallet(true)}
          className="rounded-xl bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white shadow-(--dash-primary-soft)"
        >
          + ê¥åâ¡ ¤§ï§¡
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
            <span className="dash-icon">{stat.icon}</span>
          </div>
        ))}
      </section>

      <section className="dash-card mb-6">
        <div className="flex flex-wrap items-center gap-3 border-b border-(--dash-border) pb-4">
          <button className="dash-filter">åé¢©</button>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="dash-select min-w-[150px] rounded-xl"
          >
            <option>èé ŸéšëíŸã</option>
            <option value=" ëè"> ëè</option>
            <option value="ëç§ï">ëç§ï</option>
            <option value="ê¥åâ¡">ê¥åâ¡</option>
            <option value=" áŸç¡"> áŸç¡</option>
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="dash-select min-w-[150px] rounded-xl"
          >
            <option>كل الحالات</option>
            <option value="نشط">نشط</option>
            <option value="معلق">معلق</option>
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
              placeholder=" ¥£ åï Ÿéê¥Ÿåâ..."
              className="dash-input w-full rounded-xl border border-(--dash-border) pr-9 focus:border-(--dash-primary) focus:outline-none focus:ring-2 focus:ring-(--dash-primary-soft)"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {filteredWallets.map((wallet) => (
            <div key={wallet.id} className="rounded-2xl border border-(--dash-border) bg-(--dash-panel) p-4">
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-(--dash-primary) px-2 py-1 text-[10px] font-semibold text-white">
                  {wallet.status}
                </span>
                <span className={`dash-icon ${accentClasses[wallet.accent]}`}>{accentIcon(wallet.accent)}</span>
              </div>
              <div className="mt-6 text-right">
                <h3 className="text-sm font-semibold text-(--dash-text)">{wallet.name}</h3>
                <p className="mt-1 text-xs text-(--dash-muted)">{wallet.type}</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-(--dash-muted)">
                <span className="rounded-md border border-(--dash-border) px-2 py-1 text-[10px]">{wallet.currency}</span>
                <div className="text-right">
                  <p className="text-[10px] text-(--dash-muted)">Ÿé©­ï§ Ÿé¥Ÿéï</p>
                  <p className="text-sm font-semibold text-(--dash-text)">
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dash-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-(--dash-text)">™¦© Ÿé¥©èŸ¢</h3>
          <div className="flex items-center gap-2 text-xs text-(--dash-muted)">
            <span>Ÿéïíê</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-(--dash-border) bg-(--dash-panel-soft)">
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path fill="currentColor" d="M6 4h12v2H6zm0 4h12v12H6z" />
              </svg>
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {movements.map((movement) => (
            <div
              key={movement.id}
              className="flex items-center justify-between rounded-xl border border-(--dash-border) bg-(--dash-panel-soft) px-4 py-3"
            >
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm font-semibold text-(--dash-text)">
                  <span>{movement.title}</span>
                  <span
                    className={`dash-icon h-6 w-6 ${
                      movement.type === "ï§Ÿã" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
                      <path
                        fill="currentColor"
                        d={
                          movement.type === "ï§Ÿã"
                            ? "M12 4 5 11h4v9h6v-9h4l-7-7Z"
                            : "M12 20 5 13h4V4h6v9h4l-7 7Z"
                        }
                      />
                    </svg>
                  </span>
                </div>
                <p className="mt-1 text-xs text-(--dash-muted)">{movement.reference} ú {movement.date}</p>
              </div>
              <div className="text-sm text-left">
                <p className={movement.type === "ï§Ÿã" ? "text-(--dash-success)" : "text-(--dash-danger)"}>
                  {formatCurrency(movement.amount, movement.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showNewWallet && (
        <div className="dash-modal" onClick={handleOverlayClick}>
          <div className="dash-modal-body max-w-lg">
            <div className="flex items-center justify-between border-b border-(--dash-border) pb-3">
              <div>
                <h3 className="text-sm font-semibold text-(--dash-text)">àŸå¡ ê¥åâ¡ ¤§ï§¡</h3>
                <p className="mt-1 text-xs text-(--dash-muted)">ë¬Ÿ˜ ê¥åâ¡ êŸéï¡ ¤§ï§¡ íê¢Ÿ ã¡ š©­§¢ìŸ.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewWallet(false)}
                className="rounded-lg border border-(--dash-border) px-2 py-1 text-xs text-(--dash-muted)"
              >
                äéŸç
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <label className="dash-label">
                Ÿ«ê Ÿéê¥åâ¡
                <input
                  value={formData.name}
                  onChange={(event) => handleFormChange("name", event.target.value)}
                  className="dash-input mt-2 rounded-xl"
                  placeholder="ê£Ÿé: Ÿé ëè Ÿéšìéï"
                />
              </label>
              <label className="dash-label">
                Ÿéëíã
                <select
                  value={formData.type}
                  onChange={(event) => handleFormChange("type", event.target.value)}
                  className="dash-select mt-2 rounded-xl"
                >
                  <option value=" ëè"> ëè</option>
                  <option value="ëç§ï">ëç§ï</option>
                  <option value="ê¥åâ¡">ê¥åâ¡</option>
                  <option value=" áŸç¡"> áŸç¡</option>
                </select>
              </label>
              <label className="dash-label">
                Ÿéãêé¡
                <select
                  value={formData.currency}
                  onChange={(event) => handleFormChange("currency", event.target.value)}
                  className="dash-select mt-2 rounded-xl"
                >
                  <option value="SAR">©ïŸé «ãí§ï (SAR)</option>
                  <option value="USD">§íéŸ© šê©ïèï (USD)</option>
                </select>
              </label>
              <label className="dash-label">
                Ÿé©­ï§ ŸéŸå¢¢Ÿ¥ï
                <input
                  value={formData.balance}
                  onChange={(event) => handleFormChange("balance", event.target.value)}
                  className="dash-input mt-2 rounded-xl"
                  placeholder="0.00"
                />
              </label>
              <label className="dash-label">
                Ÿé¥Ÿé¡
                <select
                  value={formData.status}
                  onChange={(event) => handleFormChange("status", event.target.value)}
                  className="dash-select mt-2 rounded-xl"
                >
                  <option value="نشط">نشط</option>
                  <option value="معلق">معلق</option>
                </select>
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewWallet(false)}
                  className="rounded-lg border border-(--dash-border) px-4 py-2 text-xs text-(--dash-muted)"
                >
                  éäŸ˜
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-(--dash-primary) px-4 py-2 text-xs font-semibold text-white"
                >
                  ¥åâ
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
