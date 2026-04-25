export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  name: string;
  cat: string;
  amount: number;
  note: string;
}

export type TransactionType = 'Pendapatan' | 'Pengeluaran' | 'Tagihan' | 'Utang' | 'Tabungan';

export interface Budgets {
  income: Record<string, number>;
  expense: Record<string, number>;
  bill: Record<string, number>;
  debt: Record<string, number>;
  saving: Record<string, number>;
}

export interface Debt {
  id: number;
  name: string;
  amount: number;
  months: number;
  category: string;
  createdAt: string;
}


export interface MonthData {
  transactions: Transaction[];
  budgets: Budgets;
}

export interface AppState {
  months: Record<string, MonthData>;
  debts?: Debt[];
}

export interface Summary {
  actualIncome: number;
  actualExpense: number;
  actualBill: number;
  actualDebt: number;
  actualSaving: number;
  budgetIncome: number;
  budgetExpense: number;
  budgetBill: number;
  budgetDebt: number;
  budgetSaving: number;
  sisa: number;
}

export type PageName =
  | 'dashboard'
  | 'transactions'
  | 'income'
  | 'expenses'
  | 'bills'
  | 'debt'
  | 'savings'
  | 'report';
