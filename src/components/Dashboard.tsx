import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, AlertTriangle, TrendingUp, Landmark, CheckCircle2, X, Clock, Shield, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const { transactions = [], assets = [], liabilities = [], insurance = [], salaries = [], addTransaction, updateLiability } = useFinance();

  const [payingLiability, setPayingLiability] = useState<string | null>(null);
  const [chartMonths, setChartMonths] = useState(6);
  const [pieChartPeriod, setPieChartPeriod] = useState(1); // 1 = this month, 3 = last 3 months, etc.
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    principal: '',
    interest: '',
    isBreakdown: false
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const emi = currentMonthTransactions.filter(t => t.type === 'emi').reduce((acc, t) => acc + t.amount, 0);
  
  const totalOutflow = expense + emi;
  const savings = income - totalOutflow;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : '0';

  const totalAssets = assets.reduce((acc, a) => acc + a.amount, 0);
  const totalLiabilities = liabilities.reduce((acc, l) => acc + l.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) : '0';
  const emergencyFund = assets.filter(a => a.type === 'emergency_fund').reduce((acc, a) => acc + a.amount, 0);

  const receivedSalary = salaries.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((acc, s) => acc + s.amount, 0);

  // Automated Metrics
  const totalMonthlySIP = assets.reduce((acc, a) => acc + (a.monthlyContribution || 0), 0);
  const totalMonthlyEMI = liabilities.reduce((acc, l) => acc + (l.emiAmount || 0), 0);
  
  const r = 0.12 / 12; // 12% annual return for SIPs
  const n = 10 * 12; // 10 years
  const projectedSIPWealth = totalMonthlySIP * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const projected10YearWealth = (totalAssets * Math.pow(1.08, 10)) + projectedSIPWealth; // 8% on existing assets, 12% on SIPs

  // Pie Chart Data
  const pieChartData = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - pieChartPeriod + 1);
    const startDate = new Date(d.getFullYear(), d.getMonth(), 1);

    const periodTransactions = transactions.filter(t => new Date(t.date) >= startDate);
    
    const inc = periodTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const exp = periodTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const emiTotal = periodTransactions.filter(t => t.type === 'emi').reduce((acc, t) => acc + t.amount, 0);
    const sav = inc - (exp + emiTotal);

    return {
      income: inc,
      expenseData: [
        { name: 'Expenses', value: exp },
        { name: 'EMI', value: emiTotal },
        { name: 'Savings', value: sav > 0 ? sav : 0 },
      ]
    };
  }, [transactions, pieChartPeriod]);

  const COLORS = ['#ff0055', '#ffb800', '#00ff9d'];

  // History Chart Data
  const historyData = useMemo(() => {
    const months = Array.from({ length: chartMonths }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return { month: d.getMonth(), year: d.getFullYear(), label: d.toLocaleString('default', { month: 'short' }) };
    }).reverse();

    return months.map(m => {
      const monthTransactions = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === m.month && d.getFullYear() === m.year;
      });
      const inc = monthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const exp = monthTransactions.filter(t => t.type === 'expense' || t.type === 'emi').reduce((acc, t) => acc + t.amount, 0);
      return { name: m.label, income: inc, expense: exp };
    });
  }, [transactions, chartMonths]);

  const creditCards = liabilities.filter(l => l.type === 'credit_card');

  const recentTransactions = transactions.slice(0, 5);

  const upcomingPayments = [
    ...assets.filter(a => a.monthlyContribution && a.paymentDay).map(a => ({
      id: a.id,
      name: a.name,
      amount: a.monthlyContribution!,
      day: a.paymentDay!,
      type: 'sip' as const,
      category: a.type === 'nps' ? 'NPS' : a.type === 'epf' ? 'EPF' : 'SIP'
    })),
    ...liabilities.filter(l => l.emiAmount && l.paymentDay).map(l => ({
      id: l.id,
      name: l.name,
      amount: l.emiAmount!,
      day: l.paymentDay!,
      type: 'emi' as const,
      category: 'EMI'
    }))
  ].sort((a, b) => a.day - b.day);

  const isPaid = (name: string, amount: number) => {
    return transactions.some(t => 
      t.description.includes(name) && 
      t.amount === amount && 
      new Date(t.date).getMonth() === currentMonth &&
      new Date(t.date).getFullYear() === currentYear
    );
  };

  const handleMarkAsPaid = (payment: typeof upcomingPayments[0]) => {
    if (payment.type === 'emi') {
      setPayingLiability(payment.id);
      setPaymentDetails({ ...paymentDetails, amount: payment.amount.toString() });
    } else {
      addTransaction({
        type: 'expense',
        amount: payment.amount,
        category: payment.category,
        date: new Date().toISOString().split('T')[0],
        description: `${payment.category} Payment: ${payment.name}`
      });
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingLiability) return;

    const liability = liabilities.find(l => l.id === payingLiability);
    if (!liability) return;

    const totalAmount = Number(paymentDetails.amount);
    const principal = paymentDetails.isBreakdown ? Number(paymentDetails.principal) : totalAmount;
    const interest = paymentDetails.isBreakdown ? Number(paymentDetails.interest) : 0;

    addTransaction({
      type: 'expense',
      amount: totalAmount,
      category: 'EMI Payment',
      description: `EMI Payment: ${liability.name}`,
      date: new Date().toISOString().split('T')[0],
      liabilityId: liability.id,
      principalAmount: principal,
      interestAmount: interest
    });

    updateLiability(liability.id, {
      amount: Math.max(0, liability.amount - principal)
    });

    setPayingLiability(null);
    setPaymentDetails({ amount: '', principal: '', interest: '', isBreakdown: false });
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Financial Overview</h1>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-[#808080] font-mono text-sm">DATA_SYNC: LOCAL | STATUS: SECURE</p>
          <div className="h-4 w-[1px] bg-[#1f1f1f]"></div>
          <p className="text-[#00f0ff] font-mono text-sm">NET_WORTH: ₹{netWorth.toLocaleString()}</p>
        </div>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Monthly Income" 
          amount={income} 
          icon={<ArrowUpRight className="text-[#00ff9d]" />} 
          color="text-[#00ff9d]"
        />
        <StatCard 
          title="Total Outflow" 
          amount={totalOutflow} 
          icon={<ArrowDownRight className="text-[#ff0055]" />} 
          color="text-[#ff0055]"
        />
        <StatCard 
          title="Savings Rate" 
          amount={`${savingsRate}%`} 
          icon={<Wallet className="text-[#00f0ff]" />} 
          color="text-[#00f0ff]"
          isCurrency={false}
        />
        <StatCard 
          title="Protection" 
          amount={insurance.reduce((acc, i) => acc + i.coverageAmount, 0)} 
          icon={<Shield className="text-[#a855f7]" />} 
          color="text-[#a855f7]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border-t-4 border-t-[#a855f7] lg:col-span-3">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-[#a855f7]" />
            <h2 className="text-xl font-bold text-white">Automated Wealth Projection</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#141414] rounded-lg border border-[#1f1f1f]">
              <div className="text-xs text-[#808080] uppercase tracking-wider mb-1">Active Monthly SIPs</div>
              <div className="text-2xl font-mono text-[#00ff9d]">₹{totalMonthlySIP.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-[#141414] rounded-lg border border-[#1f1f1f]">
              <div className="text-xs text-[#808080] uppercase tracking-wider mb-1">Active Monthly EMIs</div>
              <div className="text-2xl font-mono text-[#ff0055]">₹{totalMonthlyEMI.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-[#a855f7]/10 rounded-lg border border-[#a855f7]/30">
              <div className="text-xs text-[#a855f7] uppercase tracking-wider mb-1 font-bold">10-Year Projected Wealth</div>
              <div className="text-2xl font-mono text-white">₹{Math.round(projected10YearWealth).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="glass-panel p-6 rounded-xl lg:col-span-2 neon-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Income vs Expenses</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#141414] border border-[#1f1f1f] rounded-lg px-2 py-1">
                <Filter className="w-3 h-3 text-[#808080]" />
                <select 
                  value={chartMonths}
                  onChange={(e) => setChartMonths(Number(e.target.value))}
                  className="bg-transparent text-[#808080] focus:outline-none text-xs font-mono"
                >
                  <option value={3}>Last 3 Months</option>
                  <option value={6}>Last 6 Months</option>
                  <option value={12}>Last 12 Months</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00ff9d]"></div>
                  <span className="text-[10px] text-[#808080] uppercase">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff0055]"></div>
                  <span className="text-[10px] text-[#808080] uppercase">Expense</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#404040" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#404040" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                  cursor={{ fill: '#141414' }}
                />
                <Bar dataKey="income" fill="#00ff9d" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" fill="#ff0055" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl neon-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Cashflow Distribution</h2>
            <div className="flex items-center gap-2 bg-[#141414] border border-[#1f1f1f] rounded-lg px-2 py-1">
              <Filter className="w-3 h-3 text-[#808080]" />
              <select 
                value={pieChartPeriod}
                onChange={(e) => setPieChartPeriod(Number(e.target.value))}
                className="bg-transparent text-[#808080] focus:outline-none text-xs font-mono"
              >
                <option value={1}>This Month</option>
                <option value={3}>Last 3 Months</option>
                <option value={6}>Last 6 Months</option>
                <option value={12}>Last 12 Months</option>
              </select>
            </div>
          </div>
          <div className="h-[250px] w-full">
            {pieChartData.income > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData.expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieChartData.expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#808080] font-mono text-sm">
                NO_DATA_AVAILABLE
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {pieChartData.expenseData.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center">
                <LegendItem color={COLORS[index]} label={item.name} />
                <span className="text-xs font-mono text-white">₹{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Fund Status */}
        <div className="glass-panel p-6 rounded-xl flex flex-col border-t-4 border-t-[#ffb800]">
          <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ffb800]" />
            Emergency Fund
          </h2>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-3xl font-mono text-white mb-1">₹{emergencyFund.toLocaleString('en-IN')}</div>
            <p className="text-[#808080] text-[10px] mb-4 uppercase tracking-widest">
              Target: ₹{(totalOutflow * 6).toLocaleString('en-IN')}
            </p>
            
            <div className="w-full bg-[#141414] rounded-full h-3 mb-2 overflow-hidden border border-[#1f1f1f]">
              <div 
                className="bg-[#ffb800] h-3 rounded-full shadow-[0_0_10px_rgba(255,184,0,0.5)] transition-all duration-1000" 
                style={{ width: `${Math.min(100, totalOutflow > 0 ? (emergencyFund / (totalOutflow * 6)) * 100 : 0)}%` }}
              ></div>
            </div>
            <div className="text-right text-[10px] font-mono text-[#ffb800]">
              {totalOutflow > 0 ? ((emergencyFund / (totalOutflow * 6)) * 100).toFixed(1) : 0}% OF TARGET
            </div>
          </div>
        </div>

        {/* Debt Freedom Countdown */}
        <div className="glass-panel p-6 rounded-xl flex flex-col border-t-4 border-t-[#ff0055]">
          <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#ff0055]" />
            Debt Freedom
          </h2>
          
          <div className="flex-1 flex flex-col justify-center">
            {liabilities.length > 0 ? (
              <>
                <div className="text-3xl font-mono text-white mb-1">
                  {Math.max(...liabilities.map(l => l.remainingTenureMonths || 0))} Months
                </div>
                <p className="text-[#808080] text-[10px] mb-4 uppercase tracking-widest">Until Total Debt Freedom</p>
                
                <div className="space-y-2">
                  {liabilities.slice(0, 2).map(l => (
                    <div key={l.id} className="text-[10px] flex justify-between items-center bg-[#141414] p-2 rounded border border-[#1f1f1f]">
                      <span className="text-[#808080] truncate mr-2">{l.name}</span>
                      <span className="text-[#ffb800] font-mono shrink-0">{l.remainingTenureMonths} MO</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 className="w-8 h-8 text-[#00ff9d] mx-auto mb-2" />
                <p className="text-[#00ff9d] font-bold text-sm">DEBT FREE</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credit Card Summary */}
      {creditCards.length > 0 && (
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#ff0055]" /> Credit Card Portfolio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditCards.map(cc => (
              <div key={cc.id} className="bg-[#141414] border border-[#1f1f1f] p-4 rounded-xl hover:border-[#ff0055]/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold">{cc.name}</h3>
                    <p className="text-[10px] text-[#808080] font-mono">**** {cc.lastFourDigits || 'XXXX'}</p>
                  </div>
                  <div className="p-2 bg-[#ff0055]/10 rounded-lg">
                    <Landmark className="w-4 h-4 text-[#ff0055]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[#808080] uppercase tracking-widest">Current Bill</p>
                  <div className="text-xl font-mono text-white">₹{cc.amount.toLocaleString()}</div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-[10px] text-[#808080]">DUE: DAY {cc.paymentDay || '--'}</div>
                  {isPaid(cc.name, cc.amount) ? (
                    <span className="text-[10px] text-[#00ff9d] font-bold font-mono">PAID</span>
                  ) : (
                    <button 
                      onClick={() => handleMarkAsPaid({
                        id: cc.id,
                        name: cc.name,
                        amount: cc.amount,
                        day: cc.paymentDay || 1,
                        type: 'emi',
                        category: 'Credit Card'
                      })}
                      className="text-[10px] text-[#ff0055] hover:underline font-bold font-mono"
                    >
                      PAY NOW
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Payment Tracker */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#00f0ff]" /> Monthly Payment Tracker
          </h2>
          <div className="text-[10px] text-[#808080] font-mono uppercase tracking-widest">
            Cycle: {new Date().toLocaleString('default', { month: 'long' })} {currentYear}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingPayments.length > 0 ? upcomingPayments.map((p, idx) => {
            const paid = isPaid(p.name, p.amount);
            return (
              <div key={`${p.id}-${idx}`} className={`p-4 rounded-xl border transition-all ${
                paid ? 'bg-[#00ff9d]/5 border-[#00ff9d]/20' : 'bg-[#141414] border-[#1f1f1f] hover:border-[#00f0ff]/30'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[10px] text-[#808080] font-mono uppercase tracking-widest mb-1">Due: Day {p.day}</div>
                    <h3 className="text-sm font-bold text-white truncate w-32">{p.name}</h3>
                  </div>
                  <div className={`text-sm font-mono font-bold ${paid ? 'text-[#00ff9d]' : 'text-[#ffb800]'}`}>
                    ₹{p.amount.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    p.type === 'sip' ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'bg-[#ffb800]/10 text-[#ffb800]'
                  }`}>
                    {p.category}
                  </span>
                  
                  {paid ? (
                    <div className="flex items-center gap-1 text-[#00ff9d] text-[10px] font-bold font-mono">
                      <CheckCircle2 className="w-3 h-3" /> PAID
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleMarkAsPaid(p)}
                      className="text-[10px] bg-white text-black px-3 py-1 rounded font-bold hover:bg-[#00f0ff] hover:text-white transition-all"
                    >
                      MARK AS PAID
                    </button>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-8 text-center text-[#808080] font-mono text-sm border border-dashed border-[#1f1f1f] rounded-xl">
              NO_UPCOMING_PAYMENTS_CONFIGURED
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4 text-white">Recent Transactions</h2>
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1f1f1f] text-[#808080] text-sm font-mono">
                  <th className="pb-3 font-normal">DATE</th>
                  <th className="pb-3 font-normal">DESCRIPTION</th>
                  <th className="pb-3 font-normal">CATEGORY</th>
                  <th className="pb-3 font-normal text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-[#1f1f1f]/50 hover:bg-[#141414] transition-colors">
                    <td className="py-3 text-sm text-[#e0e0e0]">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="py-3 text-sm text-white">{t.description}</td>
                    <td className="py-3 text-sm text-[#808080] uppercase text-xs tracking-wider">{t.category}</td>
                    <td className={`py-3 text-sm font-mono text-right ${
                      t.type === 'income' ? 'text-[#00ff9d]' : 
                      t.type === 'expense' ? 'text-[#ff0055]' : 'text-[#ffb800]'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-[#808080] font-mono text-sm">
            NO_TRANSACTIONS_FOUND
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {payingLiability && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-md p-6 rounded-2xl border border-[#00f0ff]/30 shadow-[0_0_50px_rgba(0,240,255,0.1)]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#00f0ff]" /> Record Payment
                </h2>
                <button onClick={() => setPayingLiability(null)} className="text-[#808080] hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-[#808080] uppercase tracking-wider">Total Amount Paid (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={paymentDetails.amount}
                    onChange={e => setPaymentDetails({...paymentDetails, amount: e.target.value})}
                    className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors font-mono"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="breakdown"
                    checked={paymentDetails.isBreakdown}
                    onChange={e => setPaymentDetails({...paymentDetails, isBreakdown: e.target.checked})}
                    className="w-4 h-4 rounded border-[#1f1f1f] bg-[#141414] text-[#00f0ff] focus:ring-[#00f0ff]"
                  />
                  <label htmlFor="breakdown" className="text-xs text-[#e0e0e0] uppercase tracking-wider cursor-pointer">
                    Specify Principal & Interest
                  </label>
                </div>

                {paymentDetails.isBreakdown && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-2">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Principal (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={paymentDetails.principal}
                        onChange={e => setPaymentDetails({...paymentDetails, principal: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors font-mono text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-[#808080] uppercase tracking-wider">Interest (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={paymentDetails.interest}
                        onChange={e => setPaymentDetails({...paymentDetails, interest: e.target.value})}
                        className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00f0ff] transition-colors font-mono text-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button 
                    type="button"
                    onClick={() => setPayingLiability(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#1f1f1f] text-[#808080] hover:bg-[#1f1f1f] transition-colors font-mono text-sm"
                  >
                    CANCEL
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#00f0ff] text-[#050505] font-bold px-4 py-2 rounded-lg hover:bg-[#00f0ff]/80 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    CONFIRM
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, amount, icon, color, isCurrency = true, trend }: { title: string, amount: number | string, icon: React.ReactNode, color: string, isCurrency?: boolean, trend?: string }) {
  return (
    <div className="glass-panel p-5 rounded-xl border-l-2 border-l-transparent hover:border-l-[#00f0ff] transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-[#808080] text-sm font-medium">{title}</h3>
        <div className="p-2 bg-[#141414] rounded-lg">{icon}</div>
      </div>
      <div className={`text-3xl font-mono ${color}`}>
        {isCurrency && typeof amount === 'number' ? `₹${amount.toLocaleString('en-IN')}` : amount}
      </div>
      {trend && <div className="text-[10px] text-[#404040] font-mono mt-2 uppercase tracking-widest">{trend}</div>}
    </div>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return <TrendingUp className={className} />;
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }}></div>
      <span className="text-sm text-[#808080] uppercase tracking-wider text-xs">{label}</span>
    </div>
  );
}
