import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, AlertCircle, Clock, Shield, TrendingUp, Zap, Target, Flame, Coffee, Book, Heart, Brain } from 'lucide-react';

// 1. Profit First
export function ProfitFirstTool({ income }: any) {
  const [profitPercent, setProfitPercent] = useState(10);
  const profit = income * (profitPercent / 100);
  const expenses = income - profit;

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#00ff9d]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Profit First Allocation</h2>
      <p className="text-[#808080] text-sm mb-6">"Income - Profit = Expenses. Take your profit first, then run your business/life on the rest."</p>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-xs text-[#808080] uppercase mb-2">
            <span>Profit Target</span>
            <span className="font-mono text-white">{profitPercent}%</span>
          </div>
          <input type="range" min="1" max="50" value={profitPercent} onChange={(e) => setProfitPercent(Number(e.target.value))} className="w-full accent-[#00ff9d]" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-xl">
            <h3 className="text-[#00ff9d] font-bold text-sm uppercase mb-1">Profit (Pay Yourself)</h3>
            <div className="text-3xl font-mono text-white">₹{profit.toLocaleString()}</div>
          </div>
          <div className="p-6 bg-[#141414] border border-[#1f1f1f] rounded-xl">
            <h3 className="text-[#808080] font-bold text-sm uppercase mb-1">Available for Expenses</h3>
            <div className="text-3xl font-mono text-white">₹{expenses.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Secrets of the Millionaire Mind (6 Jars)
export function MillionaireMindTool({ income }: any) {
  const jars = [
    { name: 'Necessities (NEC)', percent: 55, color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]' },
    { name: 'Financial Freedom (FFA)', percent: 10, color: 'text-[#00ff9d]', bg: 'bg-[#00ff9d]' },
    { name: 'Long-Term Savings (LTS)', percent: 10, color: 'text-[#ffb800]', bg: 'bg-[#ffb800]' },
    { name: 'Education (EDU)', percent: 10, color: 'text-[#a855f7]', bg: 'bg-[#a855f7]' },
    { name: 'Play (PLY)', percent: 10, color: 'text-[#ff0055]', bg: 'bg-[#ff0055]' },
    { name: 'Give (GIV)', percent: 5, color: 'text-[#f97316]', bg: 'bg-[#f97316]' },
  ];

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#a855f7]/30">
      <h2 className="text-2xl font-bold text-white mb-6">6-Jars System</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jars.map(jar => (
          <div key={jar.name} className="p-4 bg-[#141414] border border-[#1f1f1f] rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className={cn("text-xs font-bold uppercase", jar.color)}>{jar.name}</span>
              <span className="text-xs text-[#808080]">{jar.percent}%</span>
            </div>
            <div className="text-xl font-mono text-white mb-2">₹{(income * (jar.percent / 100)).toLocaleString()}</div>
            <div className="w-full h-1 bg-[#050505] rounded-full overflow-hidden">
              <div className={cn("h-full", jar.bg)} style={{ width: `${jar.percent}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Money: Master the Game
export function MasterMoneyTool({ assets }: any) {
  const [security, setSecurity] = useState(40);
  const [growth, setGrowth] = useState(50);
  const dream = 100 - security - growth;

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#3b82f6]/30">
      <h2 className="text-2xl font-bold text-white mb-6">3 Buckets Portfolio</h2>
      <div className="space-y-6">
        <div className="flex gap-2 h-8 rounded-full overflow-hidden">
          <div className="bg-[#00ff9d] transition-all" style={{ width: `${security}%` }}></div>
          <div className="bg-[#3b82f6] transition-all" style={{ width: `${growth}%` }}></div>
          <div className="bg-[#a855f7] transition-all" style={{ width: `${dream}%` }}></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-[#00ff9d]/30 rounded-xl">
            <h3 className="text-[#00ff9d] font-bold text-sm mb-2">Security Bucket ({security}%)</h3>
            <input type="range" min="0" max="100" value={security} onChange={(e) => setSecurity(Math.min(Number(e.target.value), 100 - growth))} className="w-full accent-[#00ff9d] mb-2" />
            <div className="text-xl font-mono">₹{(assets * (security/100)).toLocaleString()}</div>
          </div>
          <div className="p-4 border border-[#3b82f6]/30 rounded-xl">
            <h3 className="text-[#3b82f6] font-bold text-sm mb-2">Growth Bucket ({growth}%)</h3>
            <input type="range" min="0" max="100" value={growth} onChange={(e) => setGrowth(Math.min(Number(e.target.value), 100 - security))} className="w-full accent-[#3b82f6] mb-2" />
            <div className="text-xl font-mono">₹{(assets * (growth/100)).toLocaleString()}</div>
          </div>
          <div className="p-4 border border-[#a855f7]/30 rounded-xl">
            <h3 className="text-[#a855f7] font-bold text-sm mb-2">Dream Bucket ({dream}%)</h3>
            <div className="text-xl font-mono mt-8">₹{(assets * (dream/100)).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Bogleheads (Expense Ratio)
export function BogleheadsTool() {
  const [investment, setInvestment] = useState(100000);
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(30);
  const [returnRate, setReturnRate] = useState(10);
  const [expenseRatio, setExpenseRatio] = useState(1.5);

  const calculate = (ratio: number) => {
    let balance = investment;
    const monthlyRate = (returnRate - ratio) / 100 / 12;
    for(let i=0; i<years*12; i++) {
      balance = (balance + monthly) * (1 + monthlyRate);
    }
    return balance;
  };

  const withFee = calculate(expenseRatio);
  const withoutFee = calculate(0);
  const lostToFees = withoutFee - withFee;

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#ff0055]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Expense Ratio Erosion</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#808080] uppercase">Expense Ratio: {expenseRatio}%</label>
            <input type="range" min="0.1" max="3" step="0.1" value={expenseRatio} onChange={(e) => setExpenseRatio(Number(e.target.value))} className="w-full accent-[#ff0055]" />
          </div>
          <div>
            <label className="text-xs text-[#808080] uppercase">Years: {years}</label>
            <input type="range" min="5" max="50" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-[#808080]" />
          </div>
        </div>
        <div className="p-6 bg-[#141414] rounded-xl border border-[#1f1f1f]">
          <h3 className="text-white font-bold mb-4">The Cost of Fees</h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-[#808080]">Final Value (0% Fee)</div>
              <div className="text-xl font-mono text-[#00ff9d]">₹{withoutFee.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
            </div>
            <div>
              <div className="text-xs text-[#808080]">Final Value ({expenseRatio}% Fee)</div>
              <div className="text-xl font-mono text-white">₹{withFee.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
            </div>
            <div className="pt-4 border-t border-[#1f1f1f]">
              <div className="text-xs text-[#ff0055] font-bold uppercase">Lost to Fees & Lost Compounding</div>
              <div className="text-3xl font-mono text-[#ff0055]">₹{lostToFees.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Thinking Fast and Slow
export function FastSlowTool() {
  const [items, setItems] = useState<{name: string, price: number, time: number}[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if(!name || !price) return;
    setItems([...items, { name, price: Number(price), time: Date.now() + 48 * 60 * 60 * 1000 }]);
    setName(''); setPrice('');
  };

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#00f0ff]/30">
      <h2 className="text-2xl font-bold text-white mb-6">48-Hour Cooling-Off Period</h2>
      <form onSubmit={add} className="flex gap-4 mb-6">
        <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} className="flex-1 bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white" />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="w-32 bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-2 text-white" />
        <button type="submit" className="bg-[#00f0ff] text-black px-4 py-2 rounded-lg font-bold">HOLD</button>
      </form>
      <div className="space-y-2">
        {items.map((item, i) => {
          const hoursLeft = Math.max(0, (item.time - Date.now()) / (1000 * 60 * 60));
          return (
            <div key={i} className="flex justify-between items-center p-4 bg-[#141414] rounded-lg border border-[#1f1f1f]">
              <div>
                <div className="text-white font-bold">{item.name}</div>
                <div className="text-sm font-mono text-[#808080]">₹{item.price.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono text-[#00f0ff]">{hoursLeft.toFixed(1)}h</div>
                <div className="text-[10px] text-[#808080] uppercase">Remaining</div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <div className="text-center text-[#808080] text-sm py-4">No pending impulse buys.</div>}
      </div>
    </div>
  );
}

// 6. Early Retirement Extreme
export function ERETool({ savingsRate }: any) {
  // Simple formula for years to retirement based on savings rate (assuming 4% withdrawal, 5% real return)
  const sr = savingsRate / 100;
  let years = 0;
  if (sr > 0 && sr < 1) {
    years = Math.log((1 - sr) / sr * 0.04 / 0.05 + 1) / Math.log(1 + 0.05);
  }

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#00ff9d]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Lean FIRE Gauge</h2>
      <div className="flex flex-col items-center text-center">
        <div className="relative w-48 h-48 mb-4">
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1f1f1f" strokeWidth="10" strokeLinecap="round" />
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#00ff9d" strokeWidth="10" strokeLinecap="round" strokeDasharray="125" strokeDashoffset={125 - (125 * Math.min(savingsRate, 100) / 100)} className="transition-all duration-1000" />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 text-center">
            <div className="text-4xl font-mono text-white">{savingsRate.toFixed(1)}%</div>
            <div className="text-xs text-[#808080] uppercase">Savings Rate</div>
          </div>
        </div>
        <div className="p-4 bg-[#141414] rounded-xl border border-[#1f1f1f] w-full max-w-md">
          <h3 className="text-[#808080] text-sm mb-1">Years to Financial Independence</h3>
          <div className="text-3xl font-mono text-[#00ff9d]">{sr > 0 ? years.toFixed(1) : '∞'} Years</div>
          <p className="text-xs text-[#808080] mt-2">Target &gt;70% for extreme early retirement.</p>
        </div>
      </div>
    </div>
  );
}

// 7. Everyday Millionaires
export function EverydayMillionairesTool({ netWorth }: any) {
  const milestones = [
    { target: 100000, label: '₹1 Lakh' },
    { target: 1000000, label: '₹10 Lakhs' },
    { target: 5000000, label: '₹50 Lakhs' },
    { target: 10000000, label: '₹1 Crore' },
    { target: 50000000, label: '₹5 Crores' },
  ];

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#ffb800]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Net Worth Milestones</h2>
      <div className="space-y-4">
        {milestones.map((m, i) => {
          const achieved = netWorth >= m.target;
          const progress = Math.min(100, Math.max(0, (netWorth / m.target) * 100));
          return (
            <div key={i} className="p-4 bg-[#141414] rounded-xl border border-[#1f1f1f] relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 bg-[#ffb800]/10 transition-all" style={{ width: `${progress}%` }}></div>
              <div className="relative z-10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {achieved ? <CheckCircle2 className="text-[#ffb800]" /> : <div className="w-6 h-6 rounded-full border-2 border-[#333]"></div>}
                  <span className={cn("font-bold", achieved ? "text-white" : "text-[#808080]")}>{m.label}</span>
                </div>
                <span className="font-mono text-sm text-[#808080]">{progress.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 8. Common Sense Investing
export function CommonSenseTool() {
  const [years, setYears] = useState(30);
  const investment = 100000;
  const nominalRate = 12;
  const inflationRate = 6;

  const data = [];
  for(let i=0; i<=years; i+=5) {
    data.push({
      year: i,
      nominal: Math.round(investment * Math.pow(1 + nominalRate/100, i)),
      real: Math.round(investment * Math.pow(1 + (nominalRate - inflationRate)/100, i))
    });
  }

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#3b82f6]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Inflation Erosion (Real Return)</h2>
      <div className="h-[300px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
            <XAxis dataKey="year" stroke="#808080" />
            <YAxis stroke="#808080" tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1f1f1f' }} />
            <Area type="monotone" dataKey="nominal" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Nominal Value" />
            <Area type="monotone" dataKey="real" stroke="#00ff9d" fill="#00ff9d" fillOpacity={0.5} name="Real Value (Purchasing Power)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm text-[#808080]">
        Showing growth of ₹1L at 12% return vs 6% inflation over {years} years.
      </div>
    </div>
  );
}

// 9. Random Walk Down Wall Street
export function RandomWalkTool() {
  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#a855f7]/30 text-center">
      <h2 className="text-2xl font-bold text-white mb-6">DCA Discipline Tracker</h2>
      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-[#a855f7] mb-6">
        <div className="text-center">
          <div className="text-4xl font-mono text-white">12</div>
          <div className="text-[10px] text-[#808080] uppercase">Months Streak</div>
        </div>
      </div>
      <p className="text-[#808080] text-sm max-w-md mx-auto">
        "A blindfolded monkey throwing darts at a newspaper's financial pages could select a portfolio that would do just as well as one carefully selected by experts." Keep buying the index every month.
      </p>
    </div>
  );
}

// 10. Zero-Based Budgeting
export function ZeroBasedTool({ income, totalOutflow, savings }: any) {
  const remaining = income - totalOutflow - savings;

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#00f0ff]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Zero-Based Budget</h2>
      <div className="space-y-4 mb-8">
        <div className="flex justify-between p-4 bg-[#141414] rounded-lg">
          <span className="text-[#808080]">Income</span>
          <span className="font-mono text-[#00ff9d]">₹{income.toLocaleString()}</span>
        </div>
        <div className="flex justify-between p-4 bg-[#141414] rounded-lg">
          <span className="text-[#808080]">Expenses & EMI</span>
          <span className="font-mono text-[#ff0055]">-₹{totalOutflow.toLocaleString()}</span>
        </div>
        <div className="flex justify-between p-4 bg-[#141414] rounded-lg">
          <span className="text-[#808080]">Investments/Savings</span>
          <span className="font-mono text-[#3b82f6]">-₹{savings.toLocaleString()}</span>
        </div>
      </div>
      <div className={cn(
        "p-6 rounded-xl text-center border",
        remaining === 0 ? "bg-[#00ff9d]/10 border-[#00ff9d]/30" : "bg-[#ffb800]/10 border-[#ffb800]/30"
      )}>
        <div className="text-sm text-[#808080] uppercase tracking-widest mb-2">Unassigned Money</div>
        <div className={cn("text-5xl font-mono font-bold", remaining === 0 ? "text-[#00ff9d]" : "text-[#ffb800]")}>
          ₹{remaining.toLocaleString()}
        </div>
        <p className="text-xs mt-4 opacity-80">Every rupee must have a job. Assign the remaining balance to zero.</p>
      </div>
    </div>
  );
}

// 11. Essentialism
export function EssentialismTool() {
  const [rating, setRating] = useState(5);
  const isHellYeah = rating >= 9;

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#ff0055]/30 text-center">
      <h2 className="text-2xl font-bold text-white mb-6">"Hell Yeah or No" Filter</h2>
      <p className="text-[#808080] text-sm mb-8">Rate your desire for this non-essential purchase.</p>
      
      <div className="text-6xl font-mono font-bold text-white mb-8">{rating}/10</div>
      <input type="range" min="1" max="10" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full max-w-md accent-[#ff0055] mb-8" />
      
      <div className={cn(
        "p-6 rounded-xl border max-w-md mx-auto transition-all duration-500",
        isHellYeah ? "bg-[#00ff9d]/20 border-[#00ff9d] shadow-[0_0_30px_rgba(0,255,157,0.3)]" : "bg-[#ff0055]/10 border-[#ff0055]/30"
      )}>
        <div className={cn("text-3xl font-bold", isHellYeah ? "text-[#00ff9d]" : "text-[#ff0055]")}>
          {isHellYeah ? "HELL YEAH! BUY IT." : "NO. SKIP IT."}
        </div>
      </div>
    </div>
  );
}

// 12. Naval Ravikant
export function NavalTool() {
  const [codeMedia, setCodeMedia] = useState(10);
  const [capital, setCapital] = useState(20);
  const [labor, setLabor] = useState(70);

  return (
    <div className="glass-panel p-8 rounded-xl neon-border border-[#00f0ff]/30">
      <h2 className="text-2xl font-bold text-white mb-6">Specific Knowledge & Leverage</h2>
      <p className="text-[#808080] text-sm mb-8">"Fortunes require leverage. Business leverage comes from capital, people, and products with no marginal cost of replication (code and media)."</p>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-xs text-[#00f0ff] uppercase mb-2">
            <span>Code & Media (Highest Leverage)</span>
            <span>{codeMedia}%</span>
          </div>
          <input type="range" min="0" max="100" value={codeMedia} onChange={(e) => setCodeMedia(Number(e.target.value))} className="w-full accent-[#00f0ff]" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-[#ffb800] uppercase mb-2">
            <span>Capital (Money)</span>
            <span>{capital}%</span>
          </div>
          <input type="range" min="0" max="100" value={capital} onChange={(e) => setCapital(Number(e.target.value))} className="w-full accent-[#ffb800]" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-[#ff0055] uppercase mb-2">
            <span>Labor (Time/People)</span>
            <span>{labor}%</span>
          </div>
          <input type="range" min="0" max="100" value={labor} onChange={(e) => setLabor(Number(e.target.value))} className="w-full accent-[#ff0055]" />
        </div>
      </div>
    </div>
  );
}
