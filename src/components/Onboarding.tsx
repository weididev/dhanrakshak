import React, { useState } from 'react';
import { useFinance, LiabilityType } from '../context/FinanceContext';
import { Plus, Trash2, AlertCircle, CreditCard, Landmark, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Liabilities() {
  const { liabilities = [], addLiability, updateLiability, deleteLiability, nameHistory = [], addToHistory } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    type: 'loan' as LiabilityType,
    amount: '',
    interestRate: '',
    name: '',
    emiAmount: '',
    paymentDay: '',
    remainingTenureMonths: '',
    startDate: new Date().toISOString().split('T')[0],
    lastFourDigits: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.name || !formData.interestRate) return;
    
    addToHistory(formData.name);
    addLiability({
      type: formData.type,
      amount: Number(formData.amount),
      interestRate: Number(formData.interestRate),
      name: formData.name,
      ...(formData.emiAmount ? { emiAmount: Number(formData.emiAmount) } : {}),
      ...(formData.paymentDay ? { paymentDay: Number(formData.paymentDay) } : {}),
      ...(formData.remainingTenureMonths ? { remainingTenureMonths: Number(formData.remainingTenureMonths) } : {}),
      startDate: formData.startDate,
      ...(formData.lastFourDigits ? { lastFourDigits: formData.lastFourDigits } : {})
    });
    
    setFormData({
      type: 'loan',
      amount: '',
      interestRate: '',
      name: '',
      emiAmount: '',
      paymentDay: '',
      remainingTenureMonths: '',
      startDate: new Date().toISOString().split('T')[0],
      lastFourDigits: ''
    });
    setIsAdding(false);
  };

  const totalDebt = liabilities.reduce((acc, l) => acc + l.amount, 0);
  const totalEMI = liabilities.reduce((acc, l) => acc + (l.emiAmount || 0), 0);

  const liabilityNames = Array.from(new Set([...nameHistory, ...liabilities.map(l => l.name).filter(Boolean)]));

  const filteredNames = liabilityNames.filter(name => 
    name.toLowerCase().includes(formData.name.toLowerCase()) && name !== formData.name
  );

  const isLoan = ['loan', 'home_loan', 'car_loan', 'bike_loan', 'education_loan'].includes(formData.type);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Liabilities & Debt</h1>
          <p className="text-[#808080] font-mono text-sm mt-1">MODULE: DEBT_ELIMINATION</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#ff0055]/10 text-[#ff0055] border border-[#ff0055]/30 px-4 py-2 rounded-lg hover:bg-[#ff0055]/20 transition-all shadow-[0_0_15px_rgba(255,0,85,0.1)]"
        >
          <Plus className="w-4 h-4" />
          <span className="font-mono text-sm uppercase tracking-wider">ADD DEBT</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#ff0055]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#808080] text-sm font-medium uppercase tracking-widest">Total Outstanding Debt</h3>
              <div className="text-4xl font-mono text-white mt-1">₹{totalDebt.toLocaleString('en-IN')}</div>
            </div>
            <AlertCircle className="w-12 h-12 text-[#ff0055] opacity-20" />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#ffb800]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[#808080] text-sm font-medium uppercase tracking-widest">Total Monthly EMI</h3>
              <div className="text-4xl font-mono text-white mt-1">₹{totalEMI.toLocaleString('en-IN')}</div>
            </div>
            <Landmark className="w-12 h-12 text-[#ffb800] opacity-20" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-[#ff0055]/30 shadow-[0_0_50px_rgba(255,0,85,0.1)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#ff0055]" /> Add New Debt
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-[#808080] hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Debt Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as LiabilityType})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors"
                  >
                    <option value="home_loan">Home Loan</option>
                    <option value="car_loan">Car Loan</option>
                    <option value="bike_loan">Bike/Two-Wheeler Loan</option>
                    <option value="education_loan">Education Loan</option>
                    <option value="loan">Personal Loan</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="other_debt">Other Debt</option>
                  </select>
                </div>
                
                <div className="space-y-2 relative">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Name/Provider</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => {
                      setFormData({...formData, name: e.target.value});
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors"
                    placeholder="e.g. HDFC Home Loan"
                  />
                  {showSuggestions && filteredNames.length > 0 && (
                    <div className="absolute z-50 w-full bg-[#141414] border border-[#1f1f1f] rounded-lg mt-1 max-h-40 overflow-y-auto shadow-xl">
                      {filteredNames.map(name => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setFormData({...formData, name});
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-[#e0e0e0] hover:bg-[#1f1f1f] hover:text-[#ff0055] transition-colors"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Outstanding Amount (₹)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Interest Rate (%)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.1"
                    value={formData.interestRate}
                    onChange={e => setFormData({...formData, interestRate: e.target.value})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                    placeholder="0.0"
                  />
                </div>

                {isLoan && (
                  <>
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Monthly EMI (₹)</label>
                      <input 
                        type="number" 
                        min="0"
                        value={formData.emiAmount}
                        onChange={e => setFormData({...formData, emiAmount: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Payment Day (1-31)</label>
                      <input 
                        type="number" 
                        min="1"
                        max="31"
                        value={formData.paymentDay}
                        onChange={e => setFormData({...formData, paymentDay: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Remaining Tenure (Months)</label>
                      <input 
                        type="number" 
                        min="0"
                        value={formData.remainingTenureMonths}
                        onChange={e => setFormData({...formData, remainingTenureMonths: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                        placeholder="e.g. 60"
                      />
                    </div>
                    <div className="space-y-2 animate-in fade-in">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">EMI Start Date</label>
                      <input 
                        type="date" 
                        value={formData.startDate}
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                      />
                    </div>
                  </>
                )}

                {formData.type === 'credit_card' && (
                  <div className="space-y-2 animate-in fade-in">
                    <label className="text-xs text-[#808080] uppercase tracking-wider">Last 4 Digits</label>
                    <input 
                      type="text" 
                      maxLength={4}
                      value={formData.lastFourDigits}
                      onChange={e => setFormData({...formData, lastFourDigits: e.target.value.replace(/\D/g, '')})}
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                      placeholder="e.g. 1234"
                    />
                  </div>
                )}

                {formData.type === 'credit_card' && (
                  <div className="space-y-2 animate-in fade-in">
                    <label className="text-xs text-[#808080] uppercase tracking-wider">Bill Payment Day (1-31)</label>
                    <input 
                      type="number" 
                      min="1"
                      max="31"
                      value={formData.paymentDay}
                      onChange={e => setFormData({...formData, paymentDay: e.target.value})}
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff0055] transition-colors font-mono"
                      placeholder="e.g. 15"
                    />
                  </div>
                )}

                <div className="md:col-span-2 flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#1f1f1f] text-[#808080] hover:bg-[#1f1f1f] transition-colors font-mono text-sm"
                  >
                    CANCEL
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#ff0055] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#ff0055]/80 transition-colors shadow-[0_0_15px_rgba(255,0,85,0.3)]"
                  >
                    SAVE DEBT
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0a]">
              <tr className="border-b border-[#1f1f1f] text-[#808080] text-xs font-mono uppercase tracking-wider">
                <th className="p-4 font-normal">Debt Name</th>
                <th className="p-4 font-normal">Type</th>
                <th className="p-4 font-normal text-right">Payment Day</th>
                <th className="p-4 font-normal text-right">EMI / Balance</th>
                <th className="p-4 font-normal text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {liabilities.length > 0 ? liabilities.map((l) => {
                const freedomDate = l.remainingTenureMonths && l.startDate 
                  ? new Date(new Date(l.startDate).setMonth(new Date(l.startDate).getMonth() + l.remainingTenureMonths))
                  : null;
                
                return (
                  <tr key={l.id} className="border-b border-[#1f1f1f]/50 hover:bg-[#141414] transition-colors">
                    <td className="p-4 text-sm text-white font-medium">
                      <div className="flex items-center gap-2">
                        {l.name}
                        {l.lastFourDigits && (
                          <span className="text-[10px] bg-[#1f1f1f] px-1.5 py-0.5 rounded text-[#808080] font-mono">
                            **** {l.lastFourDigits}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#808080] font-mono mt-1">{l.interestRate}% INTEREST</div>
                      {freedomDate && (
                        <div className="text-[10px] text-[#00ff9d] font-mono mt-1 uppercase">
                          Freedom: {freedomDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        l.type === 'credit_card' ? 'bg-[#ff0055]/10 text-[#ff0055] border border-[#ff0055]/20' : 
                        'bg-[#ffb800]/10 text-[#ffb800] border border-[#ffb800]/20'
                      }`}>
                        {l.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-right">
                      {l.paymentDay ? (
                        <input 
                          type="number"
                          min="1"
                          max="31"
                          value={l.paymentDay}
                          onChange={(e) => updateLiability(l.id, { paymentDay: Number(e.target.value) })}
                          className="w-12 bg-transparent border-b border-[#1f1f1f] text-right text-white focus:outline-none focus:border-[#ff0055]"
                        />
                      ) : (
                        <span className="text-[#404040]">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-mono text-right text-white">
                      {l.emiAmount !== undefined && (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-[#ffb800]">₹</span>
                          <input 
                            type="number"
                            value={l.emiAmount}
                            onChange={(e) => updateLiability(l.id, { emiAmount: Number(e.target.value) })}
                            className="w-20 bg-transparent border-b border-[#1f1f1f] text-right text-[#ffb800] focus:outline-none focus:border-[#ffb800]"
                          />
                          <span className="text-[10px] text-[#808080]">/mo</span>
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-[#808080]">BAL: ₹</span>
                        <input 
                          type="number"
                          value={l.amount}
                          onChange={(e) => updateLiability(l.id, { amount: Number(e.target.value) })}
                          className="w-24 bg-transparent border-b border-[#1f1f1f] text-right text-[10px] text-[#808080] focus:outline-none focus:border-[#ff0055]"
                        />
                      </div>
                      {l.remainingTenureMonths && <div className="text-[10px] text-[#404040] uppercase mt-1">{l.remainingTenureMonths} Months Left</div>}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => deleteLiability(l.id)}
                        className="text-[#808080] hover:text-[#ff0055] transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#808080] font-mono text-sm">
                    NO_DEBTS_RECORDED
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

function LiabilitySummaryCard({ title, amount, icon, color }: { title: string, amount: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="glass-panel p-5 rounded-xl border-t-2 border-t-transparent hover:border-t-[#ff0055] transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[#808080] text-sm font-medium">{title}</h3>
        <div className="p-2 bg-[#141414] rounded-lg">{icon}</div>
      </div>
      <div className={`text-3xl font-mono ${color}`}>
        ₹{amount.toLocaleString('en-IN')}
      </div>
    </div>
  );
}

