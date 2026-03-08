
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import PartnerBanks from './components/PartnerBanks';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import FinanceTools from './components/FinanceTools';
import WealthCheck from './components/WealthCheck';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import { ShieldCheck, BarChart3, Users, Settings as SettingsIcon, Bell, Search, Info, Wallet, X, Gem, Crown, Lock, Smartphone } from 'lucide-react';
import { Transaction, CreditReport, UserProfile } from './types';
import { SUPER_ADMIN } from './constants';

const App: React.FC = () => {
  // Navigation & Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'landing' | 'login' | 'app' | 'admin'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');
  
  // Notification Settings
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [scoreAlertsEnabled, setScoreAlertsEnabled] = useState(true);
  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, type: 'info' | 'success' | 'warning'}[]>([]);

  // Shared state
  const [transactions] = useState<Transaction[]>([
    { id: '1', type: 'MoMo', amount: 1500, date: '2024-05-01', description: 'Business Sales - MTN MoMo', status: 'Completed', isPositive: true },
    { id: '2', type: 'Utility', amount: 200, date: '2024-05-05', description: 'Electricity Bill (ECG)', status: 'Completed', isPositive: false },
    { id: '3', type: 'Inventory', amount: 800, date: '2024-05-10', description: 'New Stock Purchase', status: 'Completed', isPositive: false },
  ]);

  const [user, setUser] = useState<UserProfile>({
    name: "Loveland Klyntin",
    location: "Accra, Ghana",
    region: "Greater Accra",
    businessType: "Kyntin73 IT – Powering Ideas, Securing Futures",
    memberSince: "Jan 2024",
    isVerified: true,
    ghanaCardNumber: "GHA-724108119-4",
    clearanceStatus: 'Not Requested',
    momoAccounts: ["0552033463", "0545460689"],
    dataPermissions: {
      momo: true,
      nia: true,
      bureau: false
    }
  });

  const [currentReport, setCurrentReport] = useState<CreditReport | null>(null);

  // Auth Handlers
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setView('app');
    addNotification("Welcome Back", `Successfully signed in as ${user.name}`, "success");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('landing');
    setActiveTab('Overview');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setView('app');
  };

  // Admin Authentication Handler
  const handleAdminLogin = (phone: string, pin: string) => {
    if (phone === SUPER_ADMIN.phone && pin === SUPER_ADMIN.pin) {
      setIsAdminAuthenticated(true);
      setShowAdminLoginModal(false);
      setAdminLoginError('');
      setView('admin');
      addNotification("Admin Access Granted", `Welcome, ${SUPER_ADMIN.name}`, "success");
    } else {
      setAdminLoginError('Invalid credentials. Access denied.');
    }
  };

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setView('login');
  };

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'Overview':
        return <Dashboard 
          searchQuery={searchQuery} 
          onReportUpdate={setCurrentReport} 
          onNotification={addNotification}
          remindersEnabled={remindersEnabled}
          scoreAlertsEnabled={scoreAlertsEnabled}
          user={user}
        />;
      case 'Analytics':
        return <Analytics report={currentReport} transactions={transactions} />;
      case 'Wealth Check':
        return <WealthCheck transactions={transactions} susuBalance={8400} />;
      case 'Financial Tools':
        return <FinanceTools onNotification={addNotification} />;
      case 'Partner Banks':
        return <PartnerBanks report={currentReport} />;
      case 'Settings':
        return <Settings 
          user={user} 
          onLogout={handleLogout} 
          onUserUpdate={setUser}
          onNotification={addNotification}
          remindersEnabled={remindersEnabled}
          scoreAlertsEnabled={scoreAlertsEnabled}
          setRemindersEnabled={setRemindersEnabled}
          setScoreAlertsEnabled={setScoreAlertsEnabled}
        />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <Info size={48} className="opacity-20" />
            <p className="font-medium text-lg">{activeTab} module coming soon.</p>
          </div>
        );
    }
  };

  // Condition 1: Show Landing Page
  if (view === 'landing') {
    return (
      <LandingPage 
        onGetStarted={() => openAuth('signup')} 
        onLogin={() => openAuth('login')} 
      />
    );
  }

  // Condition 2: Show Login/Signup Page
  if (view === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onBack={() => setView('landing')} 
        initialMode={authMode}
      />
    );
  }

  // Admin Login Modal - Show before main app
  if (showAdminLoginModal) {
    return (
      <AdminLoginModal 
        onClose={() => {
          setShowAdminLoginModal(false);
          setAdminLoginError('');
        }}
        onLogin={handleAdminLogin}
        error={adminLoginError}
      />
    );
  }

  // Condition 3: Show Admin Dashboard
  if (view === 'admin') {
    return <AdminDashboard onLogout={handleAdminLogout} adminName={SUPER_ADMIN.name} adminRole={SUPER_ADMIN.role} />;
  }

  // Condition 4: Show Main App
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-700">
      {/* Global Notifications Portal */}
      <div className="fixed top-20 right-6 z-[1000] space-y-3 pointer-events-none w-full max-w-sm">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 flex items-start space-x-3 animate-in slide-in-from-right-10">
            <div className={`p-2 rounded-lg ${n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : n.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
              <Bell size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
              <p className="text-xs text-slate-500 font-medium">{n.message}</p>
            </div>
            <button onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} className="text-slate-300 hover:text-slate-500">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Top Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">
                CG
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block">CrediGhana <span className="text-indigo-600">AI</span></span>
            </div>
            
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search transactions, loans, or insights..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={() => setActiveTab('Overview')} className="p-2 text-slate-400 hover:text-slate-600 transition relative">
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>}
              </button>
              <div 
                onClick={() => setActiveTab('Settings')}
                className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold overflow-hidden cursor-pointer hover:bg-indigo-200 transition-colors"
              >
                LK
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 hidden sm:flex flex-col py-6 space-y-2 shrink-0">
          <SidebarItem 
            icon={<ShieldCheck size={20} />} 
            label="Overview" 
            active={activeTab === 'Overview'} 
            onClick={() => setActiveTab('Overview')} 
          />
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={activeTab === 'Analytics'} 
            onClick={() => setActiveTab('Analytics')} 
          />
          <SidebarItem 
            icon={<Gem size={20} />} 
            label="Wealth Check" 
            active={activeTab === 'Wealth Check'} 
            onClick={() => setActiveTab('Wealth Check')} 
          />
          <SidebarItem 
            icon={<Wallet size={20} />} 
            label="Financial Tools" 
            active={activeTab === 'Financial Tools'} 
            onClick={() => setActiveTab('Financial Tools')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Partner Banks" 
            active={activeTab === 'Partner Banks'} 
            onClick={() => setActiveTab('Partner Banks')} 
          />
          <div className="mt-auto">
            {isAdminAuthenticated ? (
              <div 
                onClick={() => setView('admin')}
                className={`flex items-center space-x-3 px-6 py-3 cursor-pointer transition-colors group text-slate-500 hover:text-indigo-600 hover:bg-slate-50`}
              >
                <span className="transition-transform group-hover:scale-110"><Crown size={20} /></span>
                <span className="text-sm font-semibold hidden lg:block">Admin Panel</span>
              </div>
            ) : (
              <div 
                onClick={() => setShowAdminLoginModal(true)}
                className={`flex items-center space-x-3 px-6 py-3 cursor-pointer transition-colors group text-slate-500 hover:text-amber-600 hover:bg-amber-50`}
              >
                <span className="transition-transform group-hover:scale-110"><Lock size={20} /></span>
                <span className="text-sm font-semibold hidden lg:block">Admin Access</span>
              </div>
            )}
            <SidebarItem 
              icon={<SettingsIcon size={20} />} 
              label="Settings" 
              active={activeTab === 'Settings'} 
              onClick={() => setActiveTab('Settings')} 
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 sm:pb-0 scroll-smooth">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        <button onClick={() => setActiveTab('Overview')} className={activeTab === 'Overview' ? "text-indigo-600" : "text-slate-400"}>
          <ShieldCheck />
        </button>
        <button onClick={() => setActiveTab('Wealth Check')} className={activeTab === 'Wealth Check' ? "text-amber-600" : "text-slate-400"}>
          <Gem />
        </button>
        <div className="relative">
          <PlusCircleButton onClick={() => setActiveTab('Overview')} />
        </div>
        <button onClick={() => setActiveTab('Financial Tools')} className={activeTab === 'Financial Tools' ? "text-indigo-600" : "text-slate-400"}>
          <Wallet />
        </button>
        <button onClick={() => setActiveTab('Settings')} className={activeTab === 'Settings' ? "text-indigo-600" : "text-slate-400"}>
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center space-x-3 px-6 py-3 cursor-pointer transition-colors group ${active ? 'text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
  >
    <span className="transition-transform group-hover:scale-110">{icon}</span>
    <span className="text-sm font-semibold hidden lg:block">{label}</span>
  </div>
);

const PlusCircleButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-indigo-600 p-3 rounded-full -mt-12 shadow-xl shadow-indigo-200 text-white hover:bg-indigo-700 transition-transform active:scale-95"
  >
    <Search size={24} />
  </button>
);

export default App;
