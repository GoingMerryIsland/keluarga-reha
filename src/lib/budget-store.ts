import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, MonthData, Transaction, TransactionType, Summary, PageName, Debt } from './types';
import { DEFAULT_BUDGETS, MONTHS } from './constants';

function monthKey(m: number, y: number) {
  return `${m}_${y}`;
}

export function parseKey(k: string) {
  const [m, y] = k.split('_').map(Number);
  return { m, y };
}

function createDefaultMonth(): MonthData {
  return {
    transactions: [],
    budgets: JSON.parse(JSON.stringify(DEFAULT_BUDGETS)),
  };
}

function computeSummary(data: MonthData | undefined): Summary {
  const txs = data?.transactions ?? [];
  const b = data?.budgets ?? DEFAULT_BUDGETS;

  const sum = (type: TransactionType) =>
    txs.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

  const budgetSum = (key: keyof typeof b) =>
    Object.values(b[key] || {}).reduce((s, v) => s + v, 0);

  const actualIncome = sum('Pendapatan');
  const actualExpense = sum('Pengeluaran');
  const actualBill = sum('Tagihan');
  const actualDebt = sum('Utang');
  const actualSaving = sum('Tabungan');

  return {
    actualIncome,
    actualExpense,
    actualBill,
    actualDebt,
    actualSaving,
    budgetIncome: budgetSum('income'),
    budgetExpense: budgetSum('expense'),
    budgetBill: budgetSum('bill'),
    budgetDebt: budgetSum('debt'),
    budgetSaving: budgetSum('saving'),
    sisa: actualIncome - actualExpense - actualBill - actualDebt - actualSaving,
  };
}

interface BudgetStore {
  // State
  currentMonth: number;
  currentYear: number;
  activePage: PageName;
  pendingAddAction: boolean;
  data: AppState;
  sidebarOpen: boolean;

  // Computed
  curKey: () => string;
  getMonthData: () => MonthData;
  getSummary: (key?: string) => Summary;
  getMonthLabel: () => string;

  // Actions
  setPage: (page: PageName) => void;
  setPageWithAdd: (page: PageName) => void;
  clearPendingAdd: () => void;
  switchMonth: (m: number, y: number) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: number) => void;
  updateBudget: (type: string, cat: string, val: number) => void;
  deleteMonthData: (key: string) => void;
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => void;
  updateDebt: (id: number, debt: Partial<Omit<Debt, 'id' | 'createdAt'>>) => void;
  deleteDebt: (id: number) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  resetData: () => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      activePage: 'dashboard' as PageName,
      pendingAddAction: false,
      sidebarOpen: false,
      data: { months: {}, debts: [] },

      curKey: () => monthKey(get().currentMonth, get().currentYear),

      getMonthData: () => {
        const key = get().curKey();
        return get().data.months[key] || createDefaultMonth();
      },

      getSummary: (key?: string) => {
        const k = key || get().curKey();
        return computeSummary(get().data.months[k]);
      },

      getMonthLabel: () => {
        return `${MONTHS[get().currentMonth]} ${get().currentYear}`;
      },

      setPage: (page) => set({ activePage: page, sidebarOpen: false, pendingAddAction: false }),
      setPageWithAdd: (page) => set({ activePage: page, sidebarOpen: false, pendingAddAction: true }),
      clearPendingAdd: () => set({ pendingAddAction: false }),

      switchMonth: (m, y) => {
        const key = monthKey(m, y);
        set((s) => {
          const months = { ...s.data.months };
          if (!months[key]) {
            months[key] = createDefaultMonth();
          }
          return {
            currentMonth: m,
            currentYear: y,
            data: { ...s.data, months },
          };
        });
      },

      addTransaction: (tx) => {
        const key = get().curKey();
        set((s) => {
          const months = { ...s.data.months };
          if (!months[key]) months[key] = createDefaultMonth();
          months[key] = {
            ...months[key],
            transactions: [
              ...months[key].transactions,
              { ...tx, id: Date.now() },
            ],
          };
          return { data: { ...s.data, months } };
        });
      },

      deleteTransaction: (id) => {
        const key = get().curKey();
        set((s) => {
          const months = { ...s.data.months };
          if (!months[key]) return s;
          months[key] = {
            ...months[key],
            transactions: months[key].transactions.filter((t) => t.id !== id),
          };
          return { data: { ...s.data, months } };
        });
      },

      updateBudget: (type, cat, val) => {
        const key = get().curKey();
        set((s) => {
          const months = { ...s.data.months };
          if (!months[key]) months[key] = createDefaultMonth();
          const budgets = { ...months[key].budgets };
          const typeKey = type as keyof typeof budgets;
          budgets[typeKey] = { ...budgets[typeKey], [cat]: val };
          months[key] = { ...months[key], budgets };
          return { data: { ...s.data, months } };
        });
      },

      deleteMonthData: (key) => {
        set((s) => {
          const months = { ...s.data.months };
          delete months[key];
          return { data: { ...s.data, months } };
        });
      },

      addDebt: (debt) => {
        set((s) => {
          const debts = [...(s.data.debts || []), { ...debt, id: Date.now(), createdAt: new Date().toISOString() }];
          return { data: { ...s.data, debts } };
        });
      },

      updateDebt: (id, debtUpdate) => {
        set((s) => {
          const debts = (s.data.debts || []).map((d) => (d.id === id ? { ...d, ...debtUpdate } : d));
          return { data: { ...s.data, debts } };
        });
      },

      deleteDebt: (id) => {
        set((s) => {
          const debts = (s.data.debts || []).filter((d) => d.id !== id);
          return { data: { ...s.data, debts } };
        });
      },

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      closeSidebar: () => set({ sidebarOpen: false }),
      resetData: () => {
        set({
          data: { months: {}, debts: [] },
          currentMonth: new Date().getMonth(),
          currentYear: new Date().getFullYear(),
        });
        localStorage.removeItem('budgetKC');
        window.location.reload();
      },
    }),
    {
      name: 'budgetKC',
      partialize: (state) => ({
        data: state.data,
        currentMonth: state.currentMonth,
        currentYear: state.currentYear,
      }),
    }
  )
);

// Export helper
export function fmt(n: number) {
  return 'Rp ' + Math.abs(n).toLocaleString('id-ID');
}

export function pct(a: number, b: number) {
  if (!b) return '0%';
  return Math.round((a / b) * 100) + '%';
}
