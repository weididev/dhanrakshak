import React, { useState } from 'react';
import { useFinance, AssetType } from '../context/FinanceContext';
import { Plus, Trash2, ShieldAlert, Landmark, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Assets() {
  const { assets = [], addAsset, updateAsset, deleteAsset, nameHistory = [], addToHistory } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  const [formData, setFormData] = useState({
    type: 'emergency_fund' as AssetType,
    amount: '',
    name: '',
    monthlyContribution: '',
    paymentDay: '',
    pranId: '',
    pfId: '',
    quantity: '',
    purchasePrice: '',
    companyName: '',
    creationDate: '',
    maturityDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalAmount = Number(formData.amount);
    let finalName = formData.name;

    if (formData.type === 'investment' && formData.companyName) {
      finalName = formData.companyName;
      addToHistory(formData.companyName);
      if (formData.quantity && formData.purchasePrice) {
        finalAmount = Number(formData.quantity) * Number(formData.purchasePrice);
      }
    } else if (formData.name) {
      addToHistory(formData.name);
    }

    if (!finalAmount && formData.type !== 'sip') return;
    
    addAsset({
      type: formData.type,
      amount: finalAmount,
      name: finalName || 'Unnamed Asset',
      ...(formData.monthlyContribution ? { monthlyContribution: Number(formData.monthlyContribution) } : {}),
      ...(formData.paymentDay ? { paymentDay: Number(formData.paymentDay) } : {}),
      ...(formData.pranId ? { pranId: formData.pranId } : {}),
      ...(formData.pfId ? { pfId: formData.pfId } : {}),
      ...(formData.quantity ? { quantity: Number(formData.quantity) } : {}),
      ...(formData.purchasePrice ? { purchasePrice: Number(formData.purchasePrice) } : {}),
      ...(formData.companyName ? { companyName: formData.companyName } : {}),
      ...(formData.creationDate ? { creationDate: formData.creationDate } : {}),
      ...(formData.maturityDate ? { maturityDate: formData.maturityDate } : {})
    });
    
    setFormData({
      type: 'emergency_fund',
      amount: '',
      name: '',
      monthlyContribution: '',
      paymentDay: '',
      pranId: '',
      pfId: '',
      quantity: '',
      purchasePrice: '',
      companyName: '',
      creationDate: '',
      maturityDate: ''
    });
    setIsAdding(false);
  };

  const emergencyFundTotal = assets.filter(a => a.type === 'emergency_fund').reduce((acc, a) => acc + a.amount, 0);
  const npsTotal = assets.filter(a => a.type === 'nps').reduce((acc, a) => acc + a.amount, 0);
  const sipTotal = assets.filter(a => a.type === 'sip').reduce((acc, a) => acc + a.amount, 0);
  const stockTotal = assets.filter(a => a.type === 'investment').reduce((acc, a) => acc + a.amount, 0);

  const assetNames = Array.from(new Set([...nameHistory, ...assets.map(a => a.name).filter(Boolean)]));
  const companyNames = Array.from(new Set([...nameHistory, ...assets.map(a => a.companyName).filter(Boolean)]));

  const filteredAssetNames = assetNames.filter(name => 
    name.toLowerCase().includes(formData.name.toLowerCase()) && name !== formData.name
  );

  const filteredCompanyNames = companyNames.filter(name => 
    name.toLowerCase().includes(formData.companyName.toLowerCase()) && name !== formData.companyName
  );

  const showStockFields = formData.type === 'investment';
  const showMonthlyFields = ['sip', 'nps', 'epf', 'ppf'].includes(formData.type);
  const showPfFields = formData.type === 'epf';
  const showNpsFields = formData.type === 'nps';
  const showDateFields = ['fd', 'gold', 'bond'].includes(formData.type);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Assets & Wealth</h1>
          <p className="text-[#808080] font-mono text-sm mt-1">MODULE: WEALTH_ACCUMULATION</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30 px-4 py-2 rounded-lg hover:bg-[#00ff9d]/20 transition-all shadow-[0_0_15px_rgba(0,255,157,0.1)]"
        >
          <Plus className="w-4 h-4" />
          <span className="font-mono text-sm uppercase tracking-wider">ADD ASSET</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <AssetSummaryCard title="Emergency Fund" amount={emergencyFundTotal} icon={<ShieldAlert className="text-[#ffb800]" />} color="text-[#ffb800]" />
        <AssetSummaryCard title="NPS / PF" amount={npsTotal + assets.filter(a => a.type === 'epf').reduce((acc, a) => acc + a.amount, 0)} icon={<Landmark className="text-[#00f0ff]" />} color="text-[#00f0ff]" />
        <AssetSummaryCard title="SIP / Stocks" amount={sipTotal + stockTotal} icon={<TrendingUp className="text-[#00ff9d]" />} color="text-[#00ff9d]" />
        <AssetSummaryCard title="Total Wealth" amount={assets.reduce((acc, a) => acc + a.amount, 0)} icon={<Landmark className="text-[#a855f7]" />} color="text-[#a855f7]" />
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-[#00ff9d]/30 shadow-[0_0_50px_rgba(0,255,157,0.1)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00ff9d]" /> Add New Asset
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-[#808080] hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Asset Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as AssetType})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
                  >
                    <option value="emergency_fund">Emergency Fund</option>
                    <option value="sip">Mutual Fund SIP</option>
                    <option value="investment">Stock / Equity</option>
                    <option value="nps">National Pension Scheme (NPS)</option>
                    <option value="epf">Provident Fund (EPF)</option>
                    <option value="ppf">Public Provident Fund (PPF)</option>
                    <option value="fd">Fixed Deposit (FD)</option>
                    <option value="gold">Gold / SGB</option>
                    <option value="bond">Bond / Debenture</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="cash">Cash / Bank</option>
                  </select>
                </div>
                
                {!showStockFields && (
                  <div className="space-y-2 relative">
                    <label className="text-xs text-[#808080] uppercase tracking-wider">Name/Description</label>
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
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
                      placeholder="e.g. SBI Savings, HDFC FD"
                    />
                    {showSuggestions && filteredAssetNames.length > 0 && (
                      <div className="absolute z-50 w-full bg-[#141414] border border-[#1f1f1f] rounded-lg mt-1 max-h-40 overflow-y-auto shadow-xl">
                        {filteredAssetNames.map(name => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, name});
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-[#e0e0e0] hover:bg-[#1f1f1f] hover:text-[#00ff9d] transition-colors"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {showStockFields && (
                  <>
                    <div className="space-y-2 relative">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Company Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.companyName}
                        onChange={e => {
                          setFormData({...formData, companyName: e.target.value});
                          setShowCompanySuggestions(true);
                        }}
                        onFocus={() => setShowCompanySuggestions(true)}
                        onBlur={() => setTimeout(() => setShowCompanySuggestions(false), 200)}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors"
                        placeholder="e.g. Reliance, TCS"
                      />
                      {showCompanySuggestions && filteredCompanyNames.length > 0 && (
                        <div className="absolute z-50 w-full bg-[#141414] border border-[#1f1f1f] rounded-lg mt-1 max-h-40 overflow-y-auto shadow-xl">
                          {filteredCompanyNames.map(name => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => {
                                setFormData({...formData, companyName: name});
                                setShowCompanySuggestions(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-[#e0e0e0] hover:bg-[#1f1f1f] hover:text-[#00ff9d] transition-colors"
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Quantity</label>
                      <input 
                        type="number" 
                        required
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Avg. Purchase Price (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={formData.purchasePrice}
                        onChange={e => setFormData({...formData, purchasePrice: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                        placeholder="0.00"
                      />
                    </div>
                  </>
                )}

                {!showStockFields && (
                  <div className="space-y-2">
                    <label className="text-xs text-[#808080] uppercase tracking-wider">Current Value (₹)</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                      placeholder="0.00"
                    />
                  </div>
                )}

                {showMonthlyFields && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Monthly Contribution (₹)</label>
                      <input 
                        type="number" 
                        value={formData.monthlyContribution}
                        onChange={e => setFormData({...formData, monthlyContribution: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Payment Day (1-31)</label>
                      <input 
                        type="number" 
                        min="1"
                        max="31"
                        value={formData.paymentDay}
                        onChange={e => setFormData({...formData, paymentDay: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                        placeholder="e.g. 5"
                      />
                    </div>
                  </>
                )}

                {showPfFields && (
                  <div className="space-y-2">
                    <label className="text-xs text-[#808080] uppercase tracking-wider">UAN / PF ID</label>
                    <input 
                      type="text" 
                      value={formData.pfId}
                      onChange={e => setFormData({...formData, pfId: e.target.value})}
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                      placeholder="12-digit UAN"
                    />
                  </div>
                )}

                {showNpsFields && (
                  <div className="space-y-2">
                    <label className="text-xs text-[#808080] uppercase tracking-wider">PRAN ID</label>
                    <input 
                      type="text" 
                      value={formData.pranId}
                      onChange={e => setFormData({...formData, pranId: e.target.value})}
                      className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                      placeholder="12-digit PRAN"
                    />
                  </div>
                )}

                {showDateFields && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Creation Date (Optional)</label>
                      <input 
                        type="date" 
                        value={formData.creationDate}
                        onChange={e => setFormData({...formData, creationDate: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Maturity Date (Optional)</label>
                      <input 
                        type="date" 
                        value={formData.maturityDate}
                        onChange={e => setFormData({...formData, maturityDate: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00ff9d] transition-colors font-mono"
                      />
                    </div>
                  </>
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
                    className="flex-1 bg-[#00ff9d] text-[#050505] font-bold px-4 py-2 rounded-lg hover:bg-[#00ff9d]/80 transition-colors shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                  >
                    SAVE ASSET
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
                <th className="p-4 font-normal">Asset Name</th>
                <th className="p-4 font-normal">Type</th>
                <th className="p-4 font-normal text-right">Payment Day</th>
                <th className="p-4 font-normal text-right">Value / Monthly</th>
                <th className="p-4 font-normal text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? assets.map((a) => (
                <tr key={a.id} className="border-b border-[#1f1f1f]/50 hover:bg-[#141414] transition-colors">
                  <td className="p-4 text-sm text-white font-medium">
                    {a.name}
                    {a.companyName && <div className="text-[10px] text-[#808080] font-mono mt-1">STOCK: {a.companyName}</div>}
                    {a.pfId && <div className="text-[10px] text-[#808080] font-mono mt-1">UAN: {a.pfId}</div>}
                    {a.pranId && <div className="text-[10px] text-[#808080] font-mono mt-1">PRAN: {a.pranId}</div>}
                    {(a.creationDate || a.maturityDate) && (
                      <div className="text-[10px] text-[#808080] font-mono mt-1 flex flex-wrap gap-x-2">
                        {a.creationDate && <span>CREATED: {new Date(a.creationDate).toLocaleDateString()}</span>}
                        {a.maturityDate && <span className="text-[#ffb800]">MATURES: {new Date(a.maturityDate).toLocaleDateString()}</span>}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${
                      a.type === 'emergency_fund' ? 'bg-[#ffb800]/10 text-[#ffb800] border border-[#ffb800]/20' : 
                      a.type === 'nps' || a.type === 'epf' ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20' :
                      a.type === 'investment' || a.type === 'sip' ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20' :
                      'bg-[#808080]/10 text-[#808080] border border-[#808080]/20'
                    }`}>
                      {a.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-mono text-right">
                    {a.paymentDay ? (
                      <input 
                        type="number"
                        min="1"
                        max="31"
                        value={a.paymentDay}
                        onChange={(e) => updateAsset(a.id, { paymentDay: Number(e.target.value) })}
                        className="w-12 bg-transparent border-b border-[#1f1f1f] text-right text-white focus:outline-none focus:border-[#00ff9d]"
                      />
                    ) : (
                      <span className="text-[#404040]">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm font-mono text-right text-white">
                    {a.quantity && a.purchasePrice ? (
                      <div>
                        <div>₹{a.amount.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] text-[#808080]">{a.quantity} @ ₹{a.purchasePrice}</div>
                      </div>
                    ) : (
                      <input 
                        type="number"
                        value={a.amount}
                        onChange={(e) => updateAsset(a.id, { amount: Number(e.target.value) })}
                        className="w-24 bg-transparent border-b border-[#1f1f1f] text-right text-white focus:outline-none focus:border-[#00ff9d]"
                      />
                    )}
                    {a.monthlyContribution !== undefined && (
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-[#00ff9d]">+₹</span>
                        <input 
                          type="number"
                          value={a.monthlyContribution}
                          onChange={(e) => updateAsset(a.id, { monthlyContribution: Number(e.target.value) })}
                          className="w-16 bg-transparent border-b border-[#1f1f1f] text-right text-[#00ff9d] text-[10px] focus:outline-none focus:border-[#00ff9d]"
                        />
                        <span className="text-[10px] text-[#00ff9d]">/mo</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => deleteAsset(a.id)}
                      className="text-[#808080] hover:text-[#ff0055] transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#808080] font-mono text-sm">
                    NO_ASSETS_RECORDED
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

function AssetSummaryCard({ title, amount, icon, color }: { title: string, amount: number, icon: React.ReactNode, color: string }) {
  return (
    <div className="glass-panel p-5 rounded-xl border-t-2 border-t-transparent hover:border-t-[#00ff9d] transition-all">
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
