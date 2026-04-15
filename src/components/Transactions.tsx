import React, { useState, useMemo } from 'react';
import { useFinance, TransactionType } from '../context/FinanceContext';
import { Plus, Trash2, Search, ArrowUpDown, Filter } from 'lucide-react';

export function Transactions() {
  const { transactions = [], addTransaction, deleteTransaction, nameHistory = [], addToHistory } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');

  const categories = Array.from(new Set([...nameHistory, ...transactions.map(t => t.category).filter(Boolean)]));
  const descriptions = Array.from(new Set([...nameHistory, ...transactions.map(t => t.description).filter(Boolean)]));

  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(formData.category.toLowerCase()) && cat !== formData.category
  );

  const filteredDescriptions = descriptions.filter(desc => 
    desc.toLowerCase().includes(formData.description.toLowerCase()) && desc !== formData.description
  );

  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.description) return;
    
    addToHistory(formData.category);
    addToHistory(formData.description);
    addTransaction({
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description
    });
    
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setIsAdding(false);
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || t.type === filterType;
      return matchesSearch && matchesType;
    });

    result.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, sortBy, filterType]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Transactions</h1>
          <p className="text-[#808080] font-mono text-sm mt-1">LOG_ENTRY: INCOME / EXPENSE / EMI</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 px-4 py-2 rounded-lg hover:bg-[#00f0ff]/20 transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)]"
        >
          <Plus className="w-4 h-4" />
          <span className="font-mono text-sm uppercase tracking-wider">{isAdding ? 'CANCEL' : 'NEW ENTRY'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="glass-panel p-6 rounded-xl neon-border mb-8 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-[#808080] uppercase tracking-wider">Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as TransactionType})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="emi">EMI</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-[#808080] uppercase tracking-wider">Amount (₹)</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors font-mono"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2 relative">
              <label className="text-xs text-[#808080] uppercase tracking-wider">Category</label>
              <input 
                type="text" 
                required
                value={formData.category}
                onChange={e => {
                  setFormData({...formData, category: e.target.value});
                  setShowCategorySuggestions(true);
                }}
                onFocus={() => setShowCategorySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors"
                placeholder="e.g. Groceries, Salary, Car Loan"
              />
              {showCategorySuggestions && filteredCategories.length > 0 && (
                <div className="absolute z-50 w-full bg-[#141414] border border-[#1f1f1f] rounded-lg mt-1 max-h-40 overflow-y-auto shadow-xl">
                  {filteredCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setFormData({...formData, category: cat});
                        setShowCategorySuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#e0e0e0] hover:bg-[#1f1f1f] hover:text-[#00f0ff] transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs text-[#808080] uppercase tracking-wider">Date</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors"
              />
            </div>

            <div className="space-y-2 lg:col-span-2 relative">
              <label className="text-xs text-[#808080] uppercase tracking-wider">Description</label>
              <input 
                type="text" 
                required
                value={formData.description}
                onChange={e => {
                  setFormData({...formData, description: e.target.value});
                  setShowDescriptionSuggestions(true);
                }}
                onFocus={() => setShowDescriptionSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDescriptionSuggestions(false), 200)}
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors"
                placeholder="Brief description"
              />
              {showDescriptionSuggestions && filteredDescriptions.length > 0 && (
                <div className="absolute z-50 w-full bg-[#141414] border border-[#1f1f1f] rounded-lg mt-1 max-h-40 overflow-y-auto shadow-xl">
                  {filteredDescriptions.map(desc => (
                    <button
                      key={desc}
                      type="button"
                      onClick={() => {
                        setFormData({...formData, description: desc});
                        setShowDescriptionSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#e0e0e0] hover:bg-[#1f1f1f] hover:text-[#00f0ff] transition-colors"
                    >
                      {desc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-3 flex justify-end mt-2">
              <button 
                type="submit"
                className="bg-[#00f0ff] text-[#050505] font-bold px-6 py-2 rounded-lg hover:bg-[#00f0ff]/80 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]"
              >
                SAVE ENTRY
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 bg-[#141414] border border-[#1f1f1f] rounded-lg px-3 py-2">
          <Filter className="w-4 h-4 text-[#808080]" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-transparent text-white focus:outline-none text-sm"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="emi">EMI</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-[#141414] border border-[#1f1f1f] rounded-lg px-3 py-2">
          <ArrowUpDown className="w-4 h-4 text-[#808080]" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-white focus:outline-none text-sm"
          >
            <option value="date_desc">Latest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Amount: High to Low</option>
            <option value="amount_asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0a]">
              <tr className="border-b border-[#1f1f1f] text-[#808080] text-xs font-mono uppercase tracking-wider">
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Type</th>
                <th className="p-4 font-normal">Description</th>
                <th className="p-4 font-normal">Category</th>
                <th className="p-4 font-normal text-right">Amount</th>
                <th className="p-4 font-normal text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTransactions.length > 0 ? filteredAndSortedTransactions.map((t) => (
                <tr key={t.id} className="border-b border-[#1f1f1f]/50 hover:bg-[#141414] transition-colors">
                  <td className="p-4 text-sm text-[#e0e0e0]">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      t.type === 'income' ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20' : 
                      t.type === 'expense' ? 'bg-[#ff0055]/10 text-[#ff0055] border border-[#ff0055]/20' : 
                      'bg-[#ffb800]/10 text-[#ffb800] border border-[#ffb800]/20'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-white">{t.description}</td>
                  <td className="p-4 text-sm text-[#808080]">{t.category}</td>
                  <td className={`p-4 text-sm font-mono text-right ${
                    t.type === 'income' ? 'text-[#00ff9d]' : 
                    t.type === 'expense' ? 'text-[#ff0055]' : 'text-[#ffb800]'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="text-[#808080] hover:text-[#ff0055] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#808080] font-mono text-sm">
                    NO_RECORDS_FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
