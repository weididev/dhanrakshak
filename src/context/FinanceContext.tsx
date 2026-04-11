import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TransactionType = 'income' | 'expense' | 'emi';
export type AssetType = 'emergency_fund' | 'nps' | 'investment' | 'cash' | 'sip' | 'epf' | 'ppf' | 'fd' | 'gold' | 'real_estate';
export type LiabilityType = 'loan' | 'credit_card' | 'other_debt' | 'home_loan' | 'car_loan' | 'bike_loan' | 'education_loan';
export type InsuranceType = 'life' | 'health';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  description: string;
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
}

export interface Liability {
  id: string;
  type: LiabilityType;
  amount: number;
  interestRate: number;
  name: string;
  emiAmount?: number;
  paymentDay?: number;
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
  userProfile: UserProfile;
  nameHistory: string[];
}


interface FinanceContextType extends FinanceState {
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addAsset: (a: Omit<Asset, 'id'>) => void;
  updateAsset: (id: string, a: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  addLiability: (l: Omit<Liability, 'id'>) => void;
  updateLiability: (id: string, l: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;
  addInsurance: (i: Omit<Insurance, 'id'>) => void;
  deleteInsurance: (id: string) => void;
  setBudget: (b: Budget) => void;
  deleteBudget: (category: string) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  addToHistory: (name: string) => void;
  resetData: () => void;
  exportData: () => Promise<void>;
  importData: (jsonData: string) => boolean;
}

const defaultState: FinanceState = {
  transactions: [],
  assets: [],
  liabilities: [],
  insurances: [],
  budgets: [],
  userProfile: {
    name: '',
    dependents: 0,
    monthlyIncome: 0,
    hasOnboarded: false,
    hourlyWage: 500,
    workHoursPerWeek: 40,
    targetRetirementAge: 50,
    currentAge: 25,
    monthlyFixedCosts: 0,
  },
  nameHistory: []
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = 'dhanrakshak_finance_data';

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FinanceState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse stored finance data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    setState(prev => ({
      ...prev,
      transactions: [{ ...t, id: crypto.randomUUID() }, ...prev.transactions]
    }));
  };

  const deleteTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const addAsset = (a: Omit<Asset, 'id'>) => {
    setState(prev => ({
      ...prev,
      assets: [{ ...a, id: crypto.randomUUID() }, ...prev.assets]
    }));
  };

  const updateAsset = (id: string, a: Partial<Asset>) => {
    setState(prev => ({
      ...prev,
      assets: prev.assets.map(item => item.id === id ? { ...item, ...a } : item)
    }));
  };

  const deleteAsset = (id: string) => {
    setState(prev => ({
      ...prev,
      assets: prev.assets.filter(a => a.id !== id)
    }));
  };

  const addLiability = (l: Omit<Liability, 'id'>) => {
    setState(prev => ({
      ...prev,
      liabilities: [{ ...l, id: crypto.randomUUID() }, ...prev.liabilities]
    }));
  };

  const updateLiability = (id: string, l: Partial<Liability>) => {
    setState(prev => ({
      ...prev,
      liabilities: prev.liabilities.map(item => item.id === id ? { ...item, ...l } : item)
    }));
  };

  const deleteLiability = (id: string) => {
    setState(prev => ({
      ...prev,
      liabilities: prev.liabilities.filter(l => l.id !== id)
    }));
  };

  const addInsurance = (i: Omit<Insurance, 'id'>) => {
    setState(prev => ({
      ...prev,
      insurances: [{ ...i, id: crypto.randomUUID() }, ...prev.insurances]
    }));
  };

  const deleteInsurance = (id: string) => {
    setState(prev => ({
      ...prev,
      insurances: prev.insurances.filter(i => i.id !== id)
    }));
  };

  const setBudget = (b: Budget) => {
    setState(prev => {
      const existing = prev.budgets.find(x => x.category === b.category);
      if (existing) {
        return {
          ...prev,
          budgets: prev.budgets.map(x => x.category === b.category ? b : x)
        };
      }
      return {
        ...prev,
        budgets: [...prev.budgets, b]
      };
    });
  };

  const deleteBudget = (category: string) => {
    setState(prev => ({
      ...prev,
      budgets: prev.budgets.filter(b => b.category !== category)
    }));
  };

  const updateProfile = (p: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...p }
    }));
  };

  const addToHistory = (name: string) => {
    if (!name) return;
    setState(prev => {
      if (prev.nameHistory.includes(name)) return prev;
      return {
        ...prev,
        nameHistory: [name, ...prev.nameHistory].slice(0, 50) // Keep last 50
      };
    });
  };

  const exportData = async () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const file = new File([blob], `dhanrakshak_backup_${new Date().toISOString().split('T')[0]}.json`, { type: 'application/json' });

    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Dhanrakshak Data Backup',
          text: 'My financial data backup from Dhanrakshak App'
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          downloadFallback(dataStr);
        }
      }
    } else {
      downloadFallback(dataStr);
    }
  };

  const downloadFallback = (dataStr: string) => {
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `dhanrakshak_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      // Basic validation
      if (parsed.userProfile && Array.isArray(parsed.transactions)) {
        setState(parsed);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const resetData = () => {
    setState(defaultState);
  };

  return (
    <FinanceContext.Provider value={{
      ...state,
      addTransaction,
      deleteTransaction,
      addAsset,
      updateAsset,
      deleteAsset,
      addLiability,
      updateLiability,
      deleteLiability,
      addInsurance,
      deleteInsurance,
      setBudget,
      deleteBudget,
      updateProfile,
      addToHistory,
      resetData,
      exportData,
      importData
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
