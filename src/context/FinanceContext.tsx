import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { parseAxioCSV } from '../lib/dataImporter';
import { 
  Transaction, 
  TransactionType, 
  Asset, 
  AssetType, 
  Liability, 
  LiabilityType, 
  Insurance, 
  InsuranceType, 
  Salary, 
  Budget, 
  UserProfile, 
  FinanceState 
} from '../types/finance';

export type { 
  Transaction, 
  TransactionType, 
  Asset, 
  AssetType, 
  Liability, 
  LiabilityType, 
  Insurance, 
  InsuranceType, 
  Salary, 
  Budget, 
  UserProfile, 
  FinanceState 
};


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
  addSalary: (s: Omit<Salary, 'id'>) => void;
  updateSalary: (id: string, s: Partial<Salary>) => void;
  deleteSalary: (id: string) => void;
  payLiability: (id: string, amount: number, principal: number, interest: number, date: string, assetId?: string) => void;
  setBudget: (b: Budget) => void;
  deleteBudget: (category: string) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  addToHistory: (name: string) => void;
  resetData: () => void;
  exportData: () => Promise<void>;
  importData: (jsonData: string) => boolean;
  importAxioCSV: (csvData: string) => boolean;
}

const defaultState: FinanceState = {
  transactions: [],
  assets: [],
  liabilities: [],
  insurances: [],
  budgets: [],
  salaries: [],
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

  const addSalary = (s: Omit<Salary, 'id'>) => {
    setState(prev => {
      const newSalary = { ...s, id: crypto.randomUUID() };
      
      // Automatically add transaction
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: 'income',
        amount: newSalary.amount,
        category: 'Salary',
        date: newSalary.date,
        description: newSalary.description || 'Salary Received'
      };

      // Update linked asset balance if exists
      let updatedAssets = prev.assets;
      if (newSalary.linkedAssetId) {
        updatedAssets = prev.assets.map(asset => 
          asset.id === newSalary.linkedAssetId 
            ? { ...asset, amount: asset.amount + newSalary.amount }
            : asset
        );
      }

      return {
        ...prev,
        salaries: [newSalary, ...prev.salaries],
        assets: updatedAssets,
        transactions: [newTransaction, ...prev.transactions]
      };
    });
  };

  const updateSalary = (id: string, s: Partial<Salary>) => {
    setState(prev => ({
      ...prev,
      salaries: prev.salaries.map(item => item.id === id ? { ...item, ...s } : item)
    }));
  };

  const deleteSalary = (id: string) => {
    setState(prev => ({
      ...prev,
      salaries: prev.salaries.filter(s => s.id !== id)
    }));
  };
  
  const payLiability = (id: string, amount: number, principal: number, interest: number, date: string, assetId?: string) => {
    setState(prev => {
      const liability = prev.liabilities.find(l => l.id === id);
      if (!liability) return prev;

      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        type: 'emi',
        amount,
        principalAmount: principal,
        interestAmount: interest,
        category: 'EMI Payment',
        date,
        description: `Payment for ${liability.name}`,
        liabilityId: id
      };

      const updatedLiabilities = prev.liabilities.map(l => 
        l.id === id 
          ? { ...l, amount: Math.max(0, l.amount - principal) } 
          : l
      );

      let updatedAssets = prev.assets;
      if (assetId) {
        updatedAssets = prev.assets.map(a => 
          a.id === assetId 
            ? { ...a, amount: a.amount - amount }
            : a
        );
      }

      return {
        ...prev,
        transactions: [newTransaction, ...prev.transactions],
        liabilities: updatedLiabilities,
        assets: updatedAssets
      };
    });
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
    const fileName = `dhanrakshak_backup_${new Date().toISOString().split('T')[0]}.json`;

    if (Capacitor.isNativePlatform()) {
      try {
        // Write to cache directory temporarily
        const result = await Filesystem.writeFile({
          path: fileName,
          data: dataStr,
          directory: Directory.Cache,
          encoding: Encoding.UTF8
        });

        // Share the file to Drive, WhatsApp, etc.
        await Share.share({
          title: 'Dhanrakshak Data Backup',
          text: 'My financial data backup from Dhanrakshak App',
          url: result.uri,
          dialogTitle: 'Save or Share Backup'
        });
      } catch (error) {
        console.error('Error sharing native:', error);
        alert('Failed to export data. Please try again.');
      }
    } else {
      // Web fallback
      const blob = new Blob([dataStr], { type: 'application/json' });
      const file = new File([blob], fileName, { type: 'application/json' });

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
            downloadFallback(dataStr, fileName);
          }
        }
      } else {
        downloadFallback(dataStr, fileName);
      }
    }
  };

  const downloadFallback = (dataStr: string, fileName: string) => {
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  };

  const importData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      // Basic validation
      if (parsed.userProfile && Array.isArray(parsed.transactions)) {
        setState(prev => {
          // Merge transactions with de-duplication
          const existingTxSigs = new Set(prev.transactions.map(t => `${new Date(t.date).getTime()}_${t.amount}_${t.description}`));
          const newTransactions = parsed.transactions.filter((t: Transaction) => !existingTxSigs.has(`${new Date(t.date).getTime()}_${t.amount}_${t.description}`));
          
          // Merge salaries with de-duplication
          const existingSalSigs = new Set(prev.salaries.map(s => `${new Date(s.date).getTime()}_${s.amount}_${s.description}`));
          const newSalaries = (parsed.salaries || []).filter((s: Salary) => !existingSalSigs.has(`${new Date(s.date).getTime()}_${s.amount}_${s.description}`));

          // For assets and liabilities, we'll keep existing ones and add new ones if IDs don't match
          // Or update existing ones if they have the same ID? 
          // Usually, merging backups means combining history.
          
          return {
            ...prev,
            transactions: [...newTransactions, ...prev.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            salaries: [...newSalaries, ...prev.salaries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            assets: mergeById(prev.assets, parsed.assets || []),
            liabilities: mergeById(prev.liabilities, parsed.liabilities || []),
            insurances: mergeById(prev.insurances, parsed.insurances || []),
            budgets: mergeBudgets(prev.budgets, parsed.budgets || []),
            nameHistory: Array.from(new Set([...prev.nameHistory, ...(parsed.nameHistory || [])])).slice(0, 50)
          };
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const mergeById = <T extends { id: string }>(existing: T[], incoming: T[]): T[] => {
    const map = new Map<string, T>(existing.map(item => [item.id, item]));
    incoming.forEach(item => {
      // If it exists, we could either skip or update. Let's update to latest backup value.
      map.set(item.id, item);
    });
    return Array.from(map.values());
  };

  const mergeBudgets = (existing: Budget[], incoming: Budget[]): Budget[] => {
    const map = new Map<string, Budget>(existing.map(b => [b.category, b]));
    incoming.forEach(b => map.set(b.category, b));
    return Array.from(map.values());
  };

  const importAxioCSV = (csvData: string) => {
    try {
      const newState = parseAxioCSV(csvData, state);
      setState(newState);
      return true;
    } catch (e) {
      console.error('CSV Import failed:', e);
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
      addSalary,
      updateSalary,
      deleteSalary,
      payLiability,
      setBudget,
      deleteBudget,
      updateProfile,
      addToHistory,
      resetData,
      exportData,
      importData,
      importAxioCSV
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
          
