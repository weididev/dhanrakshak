/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Assets } from './components/Assets';
import { Liabilities } from './components/Liabilities';
import { Insurance } from './components/Insurance';
import { Strategies } from './components/Strategies';
import { Onboarding } from './components/Onboarding';
import { Profile } from './components/Profile';
import { Salaries } from './components/Salaries';

function MainApp() {
  const { userProfile } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const initCapacitor = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#000000' });
          await SplashScreen.hide();
        } catch (e) {
          console.warn('Capacitor plugins not available:', e);
        }

        CapApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapApp.exitApp();
          } else {
            window.history.back();
          }
        });
      }
    };
    initCapacitor();
  }, []);

  if (!userProfile?.hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'salaries' && <Salaries />}
      {activeTab === 'transactions' && <Transactions />}
      {activeTab === 'assets' && <Assets />}
      {activeTab === 'liabilities' && <Liabilities />}
      {activeTab === 'insurance' && <Insurance />}
      {activeTab === 'strategies' && <Strategies />}
      {activeTab === 'profile' && <Profile />}
    </Layout>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <MainApp />
    </FinanceProvider>
  );
}
