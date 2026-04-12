import { FinanceState } from '../context/FinanceContext';

export const axioDummyData: Partial<FinanceState> = {
  assets: [
    { id: 'a-paytm', type: 'cash', amount: 0, name: 'Paytm Wallet' },
    { id: 'a-airtel', type: 'cash', amount: 0, name: 'Airtel Money' },
    { id: 'a-mobikwik', type: 'cash', amount: 0, name: 'MobiKwik' },
    { id: 'a-syndicate', type: 'cash', amount: 0, name: 'Syndicate Bank (4337)' },
    { id: 'a-axis', type: 'cash', amount: 0, name: 'Axis Bank (964297)' },
    { id: 'a-dbs', type: 'cash', amount: 0, name: 'DBS Bank (9652)' },
    { id: 'a-airtel-bank', type: 'cash', amount: 0, name: 'Airtel Payments Bank' },
    { id: 'a-hdfc', type: 'cash', amount: 0, name: 'HDFC Bank (2382)' },
    { id: 'a-sbm', type: 'cash', amount: 0, name: 'SBM Bank (8586)' },
    { id: 'a-indiapost', type: 'cash', amount: 0, name: 'India Post (7351)' },
    { id: 'a-paytm-bank', type: 'cash', amount: 0, name: 'Paytm Payments Bank' },
  ],
  liabilities: [
    { id: 'l-axis-4331', type: 'credit_card', amount: 0, interestRate: 42, name: 'Axis Credit Card (4331)', lastFourDigits: '4331' },
    { id: 'l-axis-1853', type: 'credit_card', amount: 0, interestRate: 42, name: 'Axis Credit Card (1853)', lastFourDigits: '1853' },
    { id: 'l-yesbank-4721', type: 'credit_card', amount: 0, interestRate: 42, name: 'YesBank Credit Card (4721)', lastFourDigits: '4721' },
    { id: 'l-scapia', type: 'credit_card', amount: 0, interestRate: 42, name: 'Scapia Credit Card', lastFourDigits: '0000' },
    { id: 'l-icici-3000', type: 'credit_card', amount: 0, interestRate: 42, name: 'ICICI Credit Card (3000)', lastFourDigits: '3000' },
    { id: 'l-paytm-postpaid', type: 'cc_outstanding', amount: 0, interestRate: 36, name: 'Paytm Postpaid' },
  ],
  transactions: [] // To be populated
};
