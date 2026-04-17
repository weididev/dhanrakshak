import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Target, AlertCircle, CheckCircle2, BookOpen, Flame, ShieldCheck, TrendingUp, Calculator, Zap, Info } from 'lucide-react';

export const Guidance = () => {
  const { transactions = [], assets = [], insurances = [], liabilities = [] } = useFinance();

  // Calculations based on current month
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
  const savingsRate = income > 0 ? ((income - totalOutflow) / income) * 100 : 0;

  const emergencyFund = assets.filter(a => a.type === 'emergency_fund').reduce((acc, a) => acc + a.amount, 0);
  const targetEmergencyFund = totalOutflow * 6;
  const emergencyFundRatio = targetEmergencyFund > 0 ? (emergencyFund / targetEmergencyFund) * 100 : 0;

  const healthCover = insurances.filter(i => i.type === 'health').reduce((acc, i) => acc + i.coverAmount, 0);
  const lifeCover = insurances.filter(i => i.type === 'life').reduce((acc, i) => acc + i.coverAmount, 0);

  // Rat Race Calculation (Rich Dad Poor Dad)
  const investmentTotal = assets.filter(a => a.type === 'investment' || a.type === 'sip').reduce((acc, a) => acc + a.amount, 0);
  const estimatedMonthlyPassiveIncome = investmentTotal * 0.0066; // 8% annual
  const ratRaceProgress = totalOutflow > 0 ? (estimatedMonthlyPassiveIncome / totalOutflow) * 100 : 0;

  // Smart Reinvestment Planner
  const endingSoonLiabilities = liabilities.filter(l => l.remainingTenureMonths && l.remainingTenureMonths <= 12);
  const freedUpMonthlyCash = endingSoonLiabilities.reduce((acc, l) => acc + (l.emiAmount || 0), 0);

  // Smart Tools Data
  const inflationRate = 0.06; // 6% average inflation in India
  const futureValue1L_10y = 100000 / Math.pow(1 + inflationRate, 10);
  const futureValue1L_20y = 100000 / Math.pow(1 + inflationRate, 20);
  
  const avgReturn = 0.12; // 12% average equity return
  const yearsToDouble = 72 / (avgReturn * 100);

  const totalAssets = assets.reduce((acc, a) => acc + a.amount, 0);
  const nextMilestone = Math.pow(10, Math.floor(Math.log10(totalAssets || 1)) + 1);
  const milestoneProgress = (totalAssets / nextMilestone) * 100;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Financial Freedom Analyzer</h1>
        <p className="text-[#808080] font-mono text-sm mt-1">BASED ON: RICH DAD POOR DAD & PSYCHOLOGY OF MONEY</p>
      </header>

      {/* Net Worth Milestone */}
      <div className="glass-panel p-6 rounded-xl border-t-4 border-t-[#a855f7]">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#808080] uppercase tracking-widest mb-1">Net Worth Milestone</h2>
            <div className="text-3xl font-mono text-white">₹{totalAssets.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#808080] uppercase tracking-wider mb-1">Next: ₹{nextMilestone.toLocaleString()}</div>
            <div className="text-[#a855f7] font-mono font-bold">{milestoneProgress.toFixed(1)}%</div>
          </div>
        </div>
        <div className="w-full bg-[#141414] rounded-full h-3 border border-[#1f1f1f] overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#a855f7] to-[#00f0ff] h-full transition-all duration-1000"
            style={{ width: `${Math.min(100, milestoneProgress)}%` }}
          ></div>
        </div>
      </div>

      {/* The Rat Race Indicator */}
      <div className="glass-panel p-8 rounded-xl neon-border border-[#00f0ff]/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Flame className="w-32 h-32 text-[#00f0ff]" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Escaping the Rat Race</h2>
        <p className="text-[#808080] mb-6 max-w-2xl relative z-10">
          "The rich buy assets. The poor only have expenses. The middle class buy liabilities they think are assets." - Robert Kiyosaki
        </p>

        <div className="mb-4 relative z-10">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#808080] font-mono">PASSIVE INCOME: ₹{estimatedMonthlyPassiveIncome.toFixed(0)}/mo</span>
            <span className="text-[#808080] font-mono">EXPENSES: ₹{totalOutflow}/mo</span>
          </div>
          <div className="w-full bg-[#141414] rounded-full h-6 border border-[#1f1f1f] overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#00f0ff] to-[#00ff9d] h-full transition-all duration-1000"
              style={{ width: `${Math.min(100, ratRaceProgress)}%` }}
            ></div>
          </div>
          <div className="text-right mt-2 font-mono font-bold text-[#00ff9d]">
            {ratRaceProgress.toFixed(1)}% TO FREEDOM
          </div>
        </div>

        {ratRaceProgress >= 100 ? (
          <div className="mt-6 p-4 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#00ff9d] shrink-0" />
            <div>
              <h3 className="text-[#00ff9d] font-bold">RAT RACE ESCAPED!</h3>
              <p className="text-sm text-[#e0e0e0] mt-1">Your estimated passive income exceeds your monthly expenses. You are financially independent.</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-[#141414] border border-[#1f1f1f] rounded-lg">
            <h3 className="text-white font-medium mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#00f0ff]" /> Next Steps
            </h3>
            <ul className="text-sm text-[#808080] space-y-2 list-disc pl-5">
              <li>Increase your savings rate (currently {savingsRate.toFixed(1)}%) to buy more income-generating assets.</li>
              <li>Reduce your monthly liabilities (EMI: ₹{emi}) to lower the threshold for financial freedom.</li>
              <li>Focus on acquiring assets (Investments) rather than liabilities.</li>
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Psychology of Money - Survival */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ffb800]" /> Survival & Margin of Safety
          </h2>
          <p className="text-[#808080] text-sm mb-6">
            "Getting money is one thing. Keeping it is another. Room for error is the most underappreciated force in finance." - Morgan Housel
          </p>

          <div className="space-y-6">
            <ChecklistItem 
              title="Emergency Fund (6 Months)"
              status={emergencyFundRatio >= 100 ? 'pass' : emergencyFundRatio >= 50 ? 'warn' : 'fail'}
              value={`${emergencyFundRatio.toFixed(0)}% Funded`}
              desc={`Target: ₹${targetEmergencyFund.toLocaleString('en-IN')}`}
            />
            <ChecklistItem 
              title="Health Insurance"
              status={healthCover > 500000 ? 'pass' : healthCover > 0 ? 'warn' : 'fail'}
              value={healthCover > 0 ? `₹${(healthCover/100000).toFixed(1)}L Cover` : 'No Cover'}
              desc="Protects wealth from medical emergencies."
            />
            <ChecklistItem 
              title="Life Insurance (Term)"
              status={lifeCover > income * 12 * 10 ? 'pass' : lifeCover > 0 ? 'warn' : 'fail'}
              value={lifeCover > 0 ? `₹${(lifeCover/100000).toFixed(1)}L Cover` : 'No Cover'}
              desc="Target: 10x Annual Income for dependents."
            />
          </div>
        </div>

        {/* The Art of Spending */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#ff0055]" /> The Art of Spending
          </h2>
          <p className="text-[#808080] text-sm mb-6">
            "Wealth is what you don't see. It's the cars not purchased, the diamonds not bought."
          </p>

          <div className="space-y-6">
            <ChecklistItem 
              title="Savings Rate"
              status={savingsRate >= 20 ? 'pass' : savingsRate > 0 ? 'warn' : 'fail'}
              value={`${savingsRate.toFixed(1)}%`}
              desc="Target: Save at least 20% of your income."
            />
            <ChecklistItem 
              title="Debt Burden (EMI to Income)"
              status={income > 0 && (emi / income) <= 0.3 ? 'pass' : 'warn'}
              value={income > 0 ? `${((emi / income) * 100).toFixed(1)}%` : '0%'}
              desc="Keep EMIs below 30% of your monthly income."
            />
            <div className="p-4 bg-[#141414] rounded-lg border border-[#1f1f1f] mt-4">
              <h4 className="text-sm font-bold text-white mb-1">Actionable Advice</h4>
              <p className="text-xs text-[#808080]">
                {savingsRate < 20 
                  ? "Your savings rate is below the recommended 20%. Review your expenses to find areas to cut back." 
                  : "Excellent savings rate! Ensure this surplus is being directed towards income-generating assets."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Reinvestment Planner */}
      <div className="glass-panel p-6 rounded-xl border-t-4 border-t-[#00ff9d]">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-[#00ff9d]" />
          <h2 className="text-xl font-bold text-white">Smart Reinvestment Planner</h2>
        </div>
        
        {endingSoonLiabilities.length > 0 ? (
          <div className="space-y-6">
            <div className="p-4 bg-[#00ff9d]/5 border border-[#00ff9d]/20 rounded-lg">
              <p className="text-sm text-[#e0e0e0]">
                You have <span className="text-[#00ff9d] font-bold">{endingSoonLiabilities.length} EMIs</span> ending within the next 12 months. 
                This will free up <span className="text-[#00ff9d] font-bold text-lg">₹{freedUpMonthlyCash.toLocaleString()}/month</span> in your cashflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#808080] uppercase tracking-widest">Ending Soon</h3>
                {endingSoonLiabilities.map(l => (
                  <div key={l.id} className="flex justify-between items-center p-3 bg-[#141414] rounded-lg border border-[#1f1f1f]">
                    <div>
                      <p className="text-sm font-medium text-white">{l.name}</p>
                      <p className="text-[10px] text-[#808080] font-mono">{l.remainingTenureMonths} MONTHS LEFT</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-[#ffb800]">₹{l.emiAmount?.toLocaleString()}/mo</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#808080] uppercase tracking-widest">Smart Recommendation</h3>
                <div className="p-4 bg-[#141414] rounded-lg border border-[#00ff9d]/30">
                  <p className="text-sm text-[#e0e0e0] leading-relaxed">
                    Don't let this freed-up cash disappear into lifestyle inflation! 
                    <br /><br />
                    <strong className="text-[#00ff9d]">Action:</strong> Once these EMIs end, automatically redirect the <span className="text-white">₹{freedUpMonthlyCash.toLocaleString()}</span> into your <span className="text-white">Mutual Fund SIPs</span> or <span className="text-white">NPS</span>.
                    <br /><br />
                    In 10 years, this disciplined reinvestment could grow to approximately <span className="text-[#00ff9d] font-bold">₹{(freedUpMonthlyCash * 12 * 10 * 1.08).toLocaleString()}</span> (at 8% CAGR).
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-[#141414] rounded-lg border border-[#1f1f1f]">
            <p className="text-[#808080] font-mono text-sm">NO_EMIS_ENDING_SOON_DETECTED</p>
            <p className="text-[10px] text-[#404040] mt-2 uppercase">System will automatically alert you when a debt freedom date approaches.</p>
          </div>
        )}
      </div>

      {/* Smart Financial Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl border-b-4 border-b-[#ff0055]">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#ff0055]" />
            <h3 className="font-bold text-white">Inflation Erosion</h3>
          </div>
          <p className="text-xs text-[#808080] mb-4">See how 6% inflation kills your purchasing power.</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#808080]">Today's ₹1 Lakh</span>
              <span className="text-sm font-mono text-white">₹1,00,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#808080]">In 10 Years</span>
              <span className="text-sm font-mono text-[#ff0055]">₹{Math.round(futureValue1L_10y).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#808080]">In 20 Years</span>
              <span className="text-sm font-mono text-[#ff0055] font-bold">₹{Math.round(futureValue1L_20y).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border-b-4 border-b-[#ffb800]">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-[#ffb800]" />
            <h3 className="font-bold text-white">Rule of 72</h3>
          </div>
          <p className="text-xs text-[#808080] mb-4">How long to double your money at 12% returns.</p>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-mono text-[#ffb800] font-bold">{yearsToDouble.toFixed(1)}</div>
            <div className="text-[10px] text-[#808080] uppercase tracking-widest mt-1">YEARS TO DOUBLE</div>
          </div>
          <p className="text-[10px] text-[#404040] text-center mt-2">Based on historical equity average returns.</p>
        </div>

        <div className="glass-panel p-6 rounded-xl border-b-4 border-b-[#00f0ff]">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[#00f0ff]" />
            <h3 className="font-bold text-white">Expense Ratio Leak</h3>
          </div>
          <p className="text-xs text-[#808080] mb-4">A 1% fee can eat 25% of your wealth in 30 years.</p>
          <div className="p-3 bg-[#141414] rounded-lg border border-[#1f1f1f]">
            <div className="text-[10px] text-[#808080] uppercase mb-2">Impact of 1% Fee on ₹10L</div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-[#808080]">Direct (0% Fee)</span>
              <span className="text-xs font-mono text-[#00ff9d]">₹2.99 Cr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#808080]">Regular (1% Fee)</span>
              <span className="text-xs font-mono text-[#ff0055]">₹2.24 Cr</span>
            </div>
            <div className="mt-2 pt-2 border-t border-[#1f1f1f] flex justify-between items-center">
              <span className="text-[10px] text-[#ff0055] font-bold uppercase">Wealth Lost</span>
              <span className="text-xs font-mono text-[#ff0055]">₹75 Lakhs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ title, status, value, desc }: { title: string, status: 'pass' | 'warn' | 'fail', value: string, desc: string }) {
  const colors = {
    pass: 'text-[#00ff9d] border-[#00ff9d]/30 bg-[#00ff9d]/5',
    warn: 'text-[#ffb800] border-[#ffb800]/30 bg-[#ffb800]/5',
    fail: 'text-[#ff0055] border-[#ff0055]/30 bg-[#ff0055]/5',
  };

  const icons = {
    pass: <CheckCircle2 className="w-5 h-5 text-[#00ff9d]" />,
    warn: <AlertCircle className="w-5 h-5 text-[#ffb800]" />,
    fail: <AlertCircle className="w-5 h-5 text-[#ff0055]" />,
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[status]} flex items-start gap-3`}>
      <div className="mt-0.5">{icons[status]}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-bold text-white text-sm">{title}</h4>
          <span className={`font-mono text-xs font-bold ${status === 'pass' ? 'text-[#00ff9d]' : status === 'warn' ? 'text-[#ffb800]' : 'text-[#ff0055]'}`}>
            {value}
          </span>
        </div>
        <p className="text-xs text-[#808080]">{desc}</p>
      </div>
    </div>
  );
}
