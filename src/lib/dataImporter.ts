import { Transaction, Salary, Asset, Liability, FinanceState } from '../context/FinanceContext';

export function parseAxioCSV(csvText: string, currentState: FinanceState): FinanceState {
  const lines = csvText.split('\n');
  
  // Create a map of existing assets and liabilities for quick lookup and balance updates
  const assetsMap = new Map<string, Asset>(currentState.assets.map(a => [a.id, { ...a }]));
  const liabilitiesMap = new Map<string, Liability>(currentState.liabilities.map(l => [l.id, { ...l }]));
  
  // Use a Set to track existing transaction signatures for de-duplication
  // Signature: date_amount_description
  const existingTxSignatures = new Set(currentState.transactions.map(t => 
    `${new Date(t.date).getTime()}_${t.amount}_${t.description}`
  ));
  
  const existingSalarySignatures = new Set(currentState.salaries.map(s => 
    `${new Date(s.date).getTime()}_${s.amount}_${s.description}`
  ));

  const newTransactions: Transaction[] = [];
  const newSalaries: Salary[] = [];

  // Helper to find or create asset/liability based on account name
  const getAccountId = (accountName: string) => {
    const name = accountName.toLowerCase();
    if (name.includes('paytm bank')) return 'a-paytm-bank';
    if (name.includes('paytm')) {
      if (name.includes('postpaid')) return 'l-paytm-postpaid';
      return 'a-paytm';
    }
    if (name.includes('airtel bank') || name.includes('airtel money')) return 'a-airtel-bank';
    if (name.includes('axis')) {
      if (name.includes('credit') || name.includes(' cc')) {
        if (name.includes('4331')) return 'l-axis-4331';
        if (name.includes('1853')) return 'l-axis-1853';
        return 'l-axis-1853'; // Default axis cc
      }
      return 'a-axis';
    }
    if (name.includes('hdfc')) {
      if (name.includes('credit') || name.includes(' cc')) return 'l-hdfc-credit';
      return 'a-hdfc';
    }
    if (name.includes('dbs')) return 'a-dbs';
    if (name.includes('syndicate')) return 'a-syndicate';
    if (name.includes('india post')) return 'a-indiapost';
    if (name.includes('yesbank')) return 'l-yesbank-4721';
    if (name.includes('scapia')) return 'l-scapia';
    if (name.includes('icici')) {
      if (name.includes('credit') || name.includes(' cc')) return 'l-icici-3000';
      return 'a-pockets';
    }
    if (name.includes('pockets')) return 'a-pockets';
    if (name.includes('payzapp')) return 'a-payzapp';
    if (name.includes('mobikwik')) return 'a-mobikwik';
    if (name.includes('sbm')) return 'a-sbm';
    if (name.includes('cash')) return 'a-cash';
    
    return 'a-cash'; // Fallback
  };

  // Ensure all required assets exist in the map
  const requiredAssets = [
    { id: 'a-paytm', name: 'Paytm Wallet' },
    { id: 'a-airtel-bank', name: 'Airtel Payments Bank' },
    { id: 'a-axis', name: 'Axis Bank (964297)' },
    { id: 'a-hdfc', name: 'HDFC Bank (2382)' },
    { id: 'a-dbs', name: 'DBS Bank (9652)' },
    { id: 'a-syndicate', name: 'Syndicate Bank (4337)' },
    { id: 'a-indiapost', name: 'India Post (7351)' },
    { id: 'a-paytm-bank', name: 'Paytm Payments Bank' },
    { id: 'a-pockets', name: 'ICICI Pockets' },
    { id: 'a-payzapp', name: 'HDFC PayZapp' },
    { id: 'a-mobikwik', name: 'MobiKwik' },
    { id: 'a-sbm', name: 'SBM Bank (8586)' },
    { id: 'a-cash', name: 'Cash' }
  ];

  requiredAssets.forEach(ra => {
    if (!assetsMap.has(ra.id)) {
      assetsMap.set(ra.id, { id: ra.id, type: 'cash', amount: 0, name: ra.name });
    }
  });

  // Ensure all required liabilities exist
  const requiredLiabilities = [
    { id: 'l-axis-4331', name: 'Axis CC (4331)' },
    { id: 'l-axis-1853', name: 'Axis CC (1853)' },
    { id: 'l-yesbank-4721', name: 'YesBank CC (4721)' },
    { id: 'l-scapia', name: 'Scapia CC' },
    { id: 'l-icici-3000', name: 'ICICI CC (3000)' },
    { id: 'l-paytm-postpaid', name: 'Paytm Postpaid' }
  ];

  requiredLiabilities.forEach(rl => {
    if (!liabilitiesMap.has(rl.id)) {
      liabilitiesMap.set(rl.id, { id: rl.id, type: 'credit_card', amount: 0, interestRate: 42, name: rl.name });
    }
  });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('"DATE"') || line.startsWith('"FROM"') || line.startsWith('"","",""')) continue;

    // Handle CSV splitting more carefully (quoted vs unquoted)
    let parts: string[];
    if (line.includes('","')) {
      parts = line.split('","').map(p => p.replace(/^"|"$/g, ''));
    } else {
      // Simple comma split but handle potential commas inside quotes (basic)
      parts = line.split(',').map(p => p.replace(/^"|"$/g, ''));
    }
    
    if (parts.length < 5) continue; // Minimum required fields

    const [date, time, place, amountStr, drCr, account, expense, income, category, tags, note] = parts;
    const amount = parseFloat(amountStr.replace(/,/g, ''));
    if (isNaN(amount)) continue;

    const accountId = getAccountId(account);
    const isIncome = drCr === 'CR';
    const isSalary = category.toUpperCase().includes('SALARY');

    // Clean category and handle tags
    let cleanCategory = category.replace(/[📲🏚️📚🏥🛒🧬🛵🎁🅿️🍶🧑‍🔧☕🍗🫜🥦]/g, '').trim();
    if (!cleanCategory) cleanCategory = isIncome ? 'Credit' : 'General';
    
    const description = `${place}${note ? ' - ' + note : ''}${tags ? ' [' + tags + ']' : ''}`;
    
    // Parse date safely (handles DD/MM/YYYY and other formats)
    let timestamp: string;
    try {
      let dateObj: Date;
      if (date.includes('/')) {
        const [day, month, year] = date.split('/').map(Number);
        dateObj = new Date(year, month - 1, day);
      } else {
        dateObj = new Date(date);
      }

      // Handle "11:06 PM" format
      if (time && time.includes(':')) {
        const [h, mPart] = time.split(':');
        const [m, ampm] = mPart.split(' ');
        let hour = parseInt(h);
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        dateObj.setHours(hour, parseInt(m));
      }
      
      timestamp = dateObj.toISOString();
    } catch (e) {
      timestamp = new Date(date).toISOString();
    }

    const sig = `${new Date(timestamp).getTime()}_${amount}_${description}`;

    if (isSalary) {
      if (!existingSalarySignatures.has(sig)) {
        newSalaries.push({
          id: `sal-${i}-${Math.random().toString(36).substr(2, 4)}`,
          amount,
          date: timestamp,
          description,
          linkedAssetId: accountId.startsWith('a-') ? accountId : undefined
        });
        existingSalarySignatures.add(sig);
      }
      
      if (!existingTxSignatures.has(sig)) {
        newTransactions.push({
          id: `t-${i}-${Math.random().toString(36).substr(2, 4)}`,
          type: 'income',
          amount,
          category: 'Salary',
          date: timestamp,
          description
        });
        existingTxSignatures.add(sig);
        
        // Update Asset/Liability balance ONLY for new transactions
        updateBalance(accountId, amount, true);
      }
    } else if (isIncome) {
      if (!existingTxSignatures.has(sig)) {
        newTransactions.push({
          id: `t-${i}-${Math.random().toString(36).substr(2, 4)}`,
          type: 'income',
          amount,
          category: cleanCategory,
          date: timestamp,
          description
        });
        existingTxSignatures.add(sig);
        updateBalance(accountId, amount, true);
      }
    } else {
      if (!existingTxSignatures.has(sig)) {
        newTransactions.push({
          id: `t-${i}-${Math.random().toString(36).substr(2, 4)}`,
          type: 'expense',
          amount,
          category: cleanCategory,
          date: timestamp,
          description
        });
        existingTxSignatures.add(sig);
        updateBalance(accountId, amount, false);
      }
    }
  }

  function updateBalance(accountId: string, amount: number, isIncome: boolean) {
    if (accountId.startsWith('a-')) {
      const asset = assetsMap.get(accountId);
      if (asset) {
        asset.amount += isIncome ? amount : -amount;
      }
    } else {
      const liability = liabilitiesMap.get(accountId);
      if (liability) {
        liability.amount += isIncome ? -amount : amount;
      }
    }
  }

  const allTransactions = [...currentState.transactions, ...newTransactions];
  const allSalaries = [...currentState.salaries, ...newSalaries];

  return { 
    ...currentState, 
    transactions: allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
    salaries: allSalaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
    assets: Array.from(assetsMap.values()), 
    liabilities: Array.from(liabilitiesMap.values()) 
  };
}
