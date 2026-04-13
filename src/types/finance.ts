
export type TransactionType = 'income' | 'expense' | 'emi';
export type AssetType = 'emergency_fund' | 'nps' | 'investment' | 'cash' | 'sip' | 'epf' | 'ppf' | 'fd' | 'gold' | 'real_estate' | 'bond';
export type LiabilityType = 'loan' | 'credit_card' | 'other_debt' | 'home_loan' | 'car_loan' | 'bike_loan' | 'education_loan' | 'cc_outstanding';
export type InsuranceType = 'life' | 'health';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description: string;
  principalAmount?: number;
  interestAmount?: number;
  liabilityId?: string;
}

export interface Salary {
  id: string;
  amount: number;
  date: string;
  description: string;
  linkedAssetId?: string;
  status?: 'pending' | 'received';
}

export interface Asset {
  id: string;
  type: AssetType;
  amount: number;
  name: string;
  monthlyContribution?: number;
  paymentDay?: number;
  pranId?: string;
  pfId?: string;
  quantity?: number;
  purchasePrice?: number;
  companyName?: string;
  creationDate?: string;
  maturityDate?: string;
}

export interface Liability {
  id: string;
  type: LiabilityType;
  amount: number; // Outstanding Amount
  totalAmount?: number; // Original Loan Amount
  interestRate: number;
  name: string;
  emiAmount?: number;
  paymentDay?: number;
  totalTenureMonths?: number;
  remainingTenureMonths?: number;
  startDate?: string;
  lastFourDigits?: string;
}

export interface Insurance {
  id: string;
  type: InsuranceType;
  coverAmount: number;
  premium: number;
  name: string;
}

export interface Budget {
  category: string;
  amount: number;
}

export interface UserProfile {
  name: string;
  dependents: number;
  monthlyIncome: number;
  hasOnboarded: boolean;
  hourlyWage: number;
  workHoursPerWeek: number;
  targetRetirementAge: number;
  currentAge: number;
  monthlyFixedCosts: number;
}

export interface FinanceState {
  transactions: Transaction[];
  assets: Asset[];
  liabilities: Liability[];
  insurances: Insurance[];
  budgets: Budget[];
  salaries: Salary[];
  userProfile: UserProfile;
  nameHistory: string[];
}
