
import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  LogOut,
  BarChart3,
  FileText,
  Bell,
  RefreshCw,
  X,
  Check,
  Ban
} from 'lucide-react';
import { Transaction, Loan, UserProfile, AdminStats, SystemLog } from '../types';


interface AdminDashboardProps {
  onLogout: () => void;
  adminName?: string;
  adminRole?: string;
}

// Admin management type
interface Admin {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended';
  createdAt: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, adminName = 'Super Admin', adminRole = 'Super Administrator' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'loans' | 'transactions' | 'logs' | 'admins'>('overview');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loanFilter, setLoanFilter] = useState<'all' | 'Active' | 'Pending Approval' | 'Defaulted'>('all');
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'Income' | 'Expense'>('all');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);

  // Admin management state
  const [admins, setAdmins] = useState<Admin[]>([
    { id: 'A-001', name: 'Super Admin', phone: '0552033463', email: 'superadmin@credighana.com', role: 'Super Administrator', status: 'Active', createdAt: '2024-01-01' },
  ]);

  // New admin form state
  const [newAdmin, setNewAdmin] = useState({ name: '', phone: '', email: '', role: 'Administrator' });

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    totalLoans: 3420,
    activeLoans: 892,
    defaultedLoans: 45,
    totalTransactionVolume: 4567800,
    pendingApprovals: 23
  });

  const [mockUsers, setMockUsers] = useState<UserProfile[]>([
    { name: 'Loveland Klyntin', location: 'Accra, Ghana', businessType: 'IT Services', memberSince: 'Jan 2024', isVerified: true, ghanaCardNumber: 'GHA-724108119-4', clearanceStatus: 'Verified' },
    { name: 'Abena Mensah', location: 'Kumasi, Ghana', businessType: 'Fashion Retail', memberSince: 'Feb 2024', isVerified: true, ghanaCardNumber: 'GHA-892345671-2', clearanceStatus: 'Verified' },
    { name: 'Kofi Owusu', location: 'Takoradi, Ghana', businessType: 'Auto Parts', memberSince: 'Mar 2024', isVerified: false, ghanaCardNumber: 'GHA-123456789-0', clearanceStatus: 'Pending' },
    { name: 'Sarah Ahmed', location: 'Accra, Ghana', businessType: 'Restaurant', memberSince: 'Apr 2024', isVerified: true, ghanaCardNumber: 'GHA-987654321-1', clearanceStatus: 'Verified' },
  ]);

  const [mockLoans, setMockLoans] = useState<Loan[]>([
    { id: 'L-101', amount: 2500, interestRate: 3.5, status: 'Active', disbursedDate: '2024-04-15', purpose: 'Inventory Restock', repaymentAmount: 2587.50, dueDate: '2024-07-15' },
    { id: 'L-102', amount: 5000, interestRate: 2.5, status: 'Pending Approval', disbursedDate: '', purpose: 'Shop Expansion', repaymentAmount: 5125, dueDate: '' },
    { id: 'L-103', amount: 1500, interestRate: 7.0, status: 'Defaulted', disbursedDate: '2024-01-10', purpose: 'Equipment', repaymentAmount: 1605, dueDate: '2024-04-10' },
    { id: 'L-104', amount: 3000, interestRate: 4.0, status: 'Active', disbursedDate: '2024-05-01', purpose: 'Stock Purchase', repaymentAmount: 3120, dueDate: '2024-08-01' },
    { id: 'L-105', amount: 1000, interestRate: 7.0, status: 'Pending Approval', disbursedDate: '', purpose: 'Marketing', repaymentAmount: 1070, dueDate: '' },
  ]);

  const [mockTransactions] = useState<Transaction[]>([
    { id: '1', type: 'MoMo', amount: 1500, date: '2024-05-15', description: 'Business Sales', status: 'Completed', isPositive: true },
    { id: '2', type: 'LoanRepayment', amount: 500, date: '2024-05-14', description: 'Loan Payment', status: 'Completed', isPositive: true },
    { id: '3', type: 'Inventory', amount: 800, date: '2024-05-13', description: 'Stock Purchase', status: 'Completed', isPositive: false },
    { id: '4', type: 'Utility', amount: 200, date: '2024-05-12', description: 'Electricity Bill', status: 'Completed', isPositive: false },
    { id: '5', type: 'Savings', amount: 300, date: '2024-05-11', description: 'Susu Deposit', status: 'Completed', isPositive: true },
  ]);

  const [mockLogs, setMockLogs] = useState<SystemLog[]>([
    { id: '1', action: 'Loan Approved', userId: 'U-001', userName: 'Loveland Klyntin', timestamp: '2024-05-15 10:30:00', details: 'Loan L-101 approved for GH₵2,500' },
    { id: '2', action: 'User Verified', userId: 'U-002', userName: 'Abena Mensah', timestamp: '2024-05-15 09:15:00', details: 'GhanaCard verification completed' },
    { id: '3', action: 'Loan Defaulted', userId: 'U-003', userName: 'Kofi Owusu', timestamp: '2024-05-14 16:45:00', details: 'Loan L-103 marked as defaulted' },
    { id: '4', action: 'New Registration', userId: 'U-005', userName: 'Yaw Mensah', timestamp: '2024-05-14 14:20:00', details: 'New user registered successfully' },
    { id: '5', action: 'Credit Score Update', userId: 'U-001', userName: 'Loveland Klyntin', timestamp: '2024-05-14 12:00:00', details: 'Score updated from 650 to 720' },
  ]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const addLog = (action: string, details: string) => {
    const newLog: SystemLog = {
      id: String(mockLogs.length + 1),
      action,
      userId: 'ADMIN',
      userName: adminName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details
    };
    setMockLogs([newLog, ...mockLogs]);
  };

  const handleApproveLoan = () => {
    if (!selectedLoan) return;
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const updatedLoans = mockLoans.map(loan => 
      loan.id === selectedLoan.id ? { ...loan, status: 'Active' as const, disbursedDate: today, dueDate } : loan
    );
    setMockLoans(updatedLoans);
    setStats(prev => ({
      ...prev,
      activeLoans: prev.activeLoans + 1,
      pendingApprovals: prev.pendingApprovals - 1,
      totalLoans: prev.totalLoans + 1
    }));
    addLog('Loan Approved', `Loan ${selectedLoan.id} for GH₵${selectedLoan.amount.toLocaleString()} approved`);
    setSelectedLoan(null);
    showNotification('success', `Loan ${selectedLoan.id} approved successfully!`);
  };

  const handleRejectLoan = () => {
    if (!selectedLoan) return;
    const updatedLoans = mockLoans.filter(loan => loan.id !== selectedLoan.id);
    setMockLoans(updatedLoans);
    setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
    addLog('Loan Rejected', `Loan ${selectedLoan.id} for GH₵${selectedLoan.amount.toLocaleString()} was rejected`);
    setSelectedLoan(null);
    showNotification('error', `Loan ${selectedLoan.id} has been rejected`);
  };

  const handleVerifyUser = (index: number) => {
    const updatedUsers = [...mockUsers];
    updatedUsers[index] = { ...updatedUsers[index], isVerified: true, clearanceStatus: 'Verified' };
    setMockUsers(updatedUsers);
    addLog('User Verified', `User ${updatedUsers[index].name} (${updatedUsers[index].ghanaCardNumber}) verified`);
    showNotification('success', `${updatedUsers[index].name} has been verified!`);
  };

  const handleRejectUser = (index: number) => {
    const updatedUsers = [...mockUsers];
    updatedUsers[index] = { ...updatedUsers[index], isVerified: false, clearanceStatus: 'Rejected' };
    setMockUsers(updatedUsers);
    addLog('User Rejected', `User ${updatedUsers[index].name} verification rejected`);
    showNotification('error', `${updatedUsers[index].name} verification rejected`);
  };

  // Handle suspend user
  const handleSuspendUser = (index: number) => {
    const updatedUsers = [...mockUsers];
    updatedUsers[index] = { ...updatedUsers[index], isVerified: false, clearanceStatus: 'Suspended' };
    setMockUsers(updatedUsers);
    addLog('User Suspended', `User ${updatedUsers[index].name} has been suspended`);
    showNotification('error', `${updatedUsers[index].name} has been suspended`);
  };

  // Handle revoke user
  const handleRevokeUser = (index: number) => {
    const updatedUsers = [...mockUsers];
    updatedUsers[index] = { ...updatedUsers[index], isVerified: false, clearanceStatus: 'Revoked' };
    setMockUsers(updatedUsers);
    addLog('User Revoked', `User ${updatedUsers[index].name} access has been revoked`);
    showNotification('error', `${updatedUsers[index].name} access has been revoked`);
  };

  // Handle reactivate user (from suspended/revoked state)
  const handleReactivateUser = (index: number) => {
    const updatedUsers = [...mockUsers];
    updatedUsers[index] = { ...updatedUsers[index], isVerified: true, clearanceStatus: 'Verified' };
    setMockUsers(updatedUsers);
    addLog('User Reactivated', `User ${updatedUsers[index].name} has been reactivated`);
    showNotification('success', `${updatedUsers[index].name} has been reactivated`);
  };

  // Handle create new admin
  const handleCreateAdmin = () => {
    if (!newAdmin.name || !newAdmin.phone || !newAdmin.email) {
      showNotification('error', 'Please fill in all fields');
      return;
    }
    
    // Validate phone format
    if (!/^0\d{9}$/.test(newAdmin.phone)) {
      showNotification('error', 'Please enter a valid 10-digit phone number');
      return;
    }
    
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email)) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }
    
    const newAdminEntry: Admin = {
      id: `A-${String(admins.length + 1).padStart(3, '0')}`,
      name: newAdmin.name,
      phone: newAdmin.phone,
      email: newAdmin.email,
      role: newAdmin.role,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Show sending notification
    showNotification('success', `Sending OTP to ${newAdmin.phone}...`);
    
    // Simulate SMS and Email sending with delay
    setTimeout(() => {
      // Add to admins list
      setAdmins([...admins, newAdminEntry]);
      
      // Log the credential sending
      addLog('OTP Sent', `Live OTP ${otp} sent to ${newAdminEntry.phone} via SMS gateway`);
      addLog('Email Sent', `Login credentials sent to ${newAdminEntry.email}`);
      addLog('Admin Created', `New admin ${newAdmin.name} (${newAdmin.phone}) created with role ${newAdmin.role}`);
      
      setNewAdmin({ name: '', phone: '', email: '', role: 'Administrator' });
      setShowCreateAdminModal(false);
      showNotification('success', `Admin ${newAdminEntry.name} created! OTP sent to ${newAdminEntry.phone} and email ${newAdminEntry.email}`);
    }, 2000);
  };

  // Handle suspend admin
  const handleSuspendAdmin = (index: number) => {
    const updatedAdmins = [...admins];
    updatedAdmins[index] = { ...updatedAdmins[index], status: 'Suspended' };
    setAdmins(updatedAdmins);
    addLog('Admin Suspended', `Admin ${updatedAdmins[index].name} has been suspended`);
    showNotification('error', `${updatedAdmins[index].name} has been suspended`);
  };

  // Handle reactivate admin
  const handleReactivateAdmin = (index: number) => {
    const updatedAdmins = [...admins];
    updatedAdmins[index] = { ...updatedAdmins[index], status: 'Active' };
    setAdmins(updatedAdmins);
    addLog('Admin Reactivated', `Admin ${updatedAdmins[index].name} has been reactivated`);
    showNotification('success', `${updatedAdmins[index].name} has been reactivated`);
  };

  const filteredLoans = loanFilter === 'all' ? mockLoans : mockLoans.filter(loan => loan.status === loanFilter);

  const getLoanStatusConfig = (status: Loan['status']) => {
    switch (status) {
      case 'Active': return { styles: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle size={12} /> };
      case 'Completed': return { styles: 'bg-blue-100 text-blue-700 border-blue-200', icon: <CheckCircle size={12} /> };
      case 'Pending Approval': return { styles: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock size={12} /> };
      case 'Defaulted': return { styles: 'bg-rose-100 text-rose-700 border-rose-200', icon: <XCircle size={12} /> };
      default: return { styles: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
    }
  };

  const StatCard = ({ icon, label, value, trend, trendUp }: { icon: React.ReactNode, label: string, value: string | number, trend?: string, trendUp?: boolean }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">{icon}</div>
        {trend && (
          <div className={`flex items-center text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trendUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {trend}
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-xl animate-in slide-in-from-right-10 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          <div className="flex items-center space-x-2 font-bold">
            {notification.type === 'success' ? <CheckCircle size={20} /> : <Ban size={20} />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-bold">CG</div>
            <div>
              <div className="font-bold">CrediGhana</div>
              <div className="text-xs text-slate-400">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <BarChart3 size={20} /><span className="font-medium">Overview</span>
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users size={20} /><span className="font-medium">Users</span>
          </button>
          <button onClick={() => setActiveTab('loans')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'loans' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <CreditCard size={20} /><span className="font-medium">Loans</span>
          </button>
          <button onClick={() => setActiveTab('transactions')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'transactions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Activity size={20} /><span className="font-medium">Transactions</span>
          </button>
          <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'logs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <FileText size={20} /><span className="font-medium"> System Logs</span>
          </button>
          {adminRole === 'Super Administrator' && (
            <button onClick={() => setActiveTab('admins')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'admins' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Shield size={20} /><span className="font-medium"> Admins</span>
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-slate-800 transition">
            <LogOut size={20} /><span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-black text-slate-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'loans' && 'Loan Management'}
              {activeTab === 'transactions' && 'Transaction Monitor'}
              {activeTab === 'logs' && 'System Logs'}
              {activeTab === 'admins' && 'Admin Management'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell size={20} /><span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm">{adminName.split(' ').map(n => n[0]).join('')}</div>
              <div className="text-sm">
                <div className="font-bold text-slate-900">{adminName}</div>
                <div className="text-xs text-slate-500">{adminRole}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Users size={24} />} label="Total Users" value={stats.totalUsers.toLocaleString()} trend="+12%" trendUp />
                <StatCard icon={<CreditCard size={24} />} label="Total Loans" value={stats.totalLoans.toLocaleString()} trend="+8%" trendUp />
                <StatCard icon={<DollarSign size={24} />} label="Active Loans" value={stats.activeLoans.toLocaleString()} trend="+5%" trendUp />
                <StatCard icon={<AlertTriangle size={24} />} label="Defaulted Loans" value={stats.defaultedLoans} trend="-2%" trendUp={false} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-6">Transaction Volume</h3>
                  <div className="flex items-center justify-center h-48 bg-slate-50 rounded-2xl">
                    <div className="text-center">
                      <div className="text-3xl font-black text-indigo-600">GH₵ {(stats.totalTransactionVolume / 1000000).toFixed(2)}M</div>
                      <div className="text-sm text-slate-500">Total Volume</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-6">Pending Approvals</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl">
                      <div className="flex items-center space-x-3"><Clock size={20} className="text-amber-600" /><span className="font-bold text-slate-900">Loan Applications</span></div>
                      <span className="text-xl font-black text-amber-600">{stats.pendingApprovals}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                      <div className="flex items-center space-x-3"><Shield size={20} className="text-blue-600" /><span className="font-bold text-slate-900">Verifications</span></div>
                      <span className="text-xl font-black text-blue-600">{mockUsers.filter(u => !u.isVerified).length}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6">Recent System Activity</h3>
                <div className="space-y-4">
                  {mockLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-xl"><Activity size={16} className="text-indigo-600" /></div>
                        <div><div className="font-bold text-slate-900">{log.action}</div><div className="text-xs text-slate-500">{log.userName} • {log.timestamp}</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-slate-900">All Users</h3>
                  <button onClick={() => showNotification('success', 'User list refreshed')} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700">
                    <RefreshCw size={16} /><span>Refresh</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-4">User</th><th className="pb-4">Business</th><th className="pb-4">Location</th><th className="pb-4">Member Since</th><th className="pb-4">Verification</th><th className="pb-4">Status</th><th className="pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockUsers.map((user, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">{user.name.split(' ').map(n => n[0]).join('')}</div>
                              <div><div className="font-bold text-slate-900">{user.name}</div><div className="text-xs text-slate-500 font-mono">{user.ghanaCardNumber}</div></div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-slate-600">{user.businessType}</td>
                          <td className="py-4 text-sm text-slate-600">{user.location}</td>
                          <td className="py-4 text-sm text-slate-600">{user.memberSince}</td>
                          <td className="py-4">
                            {user.isVerified ? <span className="flex items-center text-xs font-bold text-emerald-600"><Shield size={12} className="mr-1" /> Verified</span> : <span className="text-xs font-bold text-amber-600">Pending</span>}
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.clearanceStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' : user.clearanceStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{user.clearanceStatus}</span>
                          </td>
                          <td className="py-4">
                            {(user.clearanceStatus === 'Verified' || user.clearanceStatus === 'Suspended' || user.clearanceStatus === 'Revoked') ? (
                              <div className="flex items-center space-x-2">
                                {user.clearanceStatus === 'Verified' && (
                                  <>
                                    <button onClick={() => handleSuspendUser(i)} className="p-2 hover:bg-amber-100 rounded-lg text-amber-600" title="Suspend User"><Ban size={16} /></button>
                                    <button onClick={() => handleRevokeUser(i)} className="p-2 hover:bg-rose-100 rounded-lg text-rose-600" title="Revoke Access"><XCircle size={16} /></button>
                                  </>
                                )}
                                {(user.clearanceStatus === 'Suspended' || user.clearanceStatus === 'Revoked') && (
                                  <button onClick={() => handleReactivateUser(i)} className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600" title="Reactivate User"><CheckCircle size={16} /></button>
                                )}
                              </div>
                            ) : !user.isVerified && (
                              <div className="flex items-center space-x-2">
                                <button onClick={() => handleVerifyUser(i)} className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600" title="Verify User"><CheckCircle size={16} /></button>
                                <button onClick={() => handleRejectUser(i)} className="p-2 hover:bg-rose-100 rounded-lg text-rose-600" title="Reject User"><XCircle size={16} /></button>
                              </div>
                            )}
                            {user.clearanceStatus === 'Not Requested' && <span className="text-xs text-slate-400">-</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loans' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button onClick={() => setLoanFilter('all')} className={`p-4 rounded-2xl font-bold text-center ${loanFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}>All Loans ({mockLoans.length})</button>
                <button onClick={() => setLoanFilter('Active')} className={`p-4 rounded-2xl font-bold text-center ${loanFilter === 'Active' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>Active ({mockLoans.filter(l => l.status === 'Active').length})</button>
                <button onClick={() => setLoanFilter('Pending Approval')} className={`p-4 rounded-2xl font-bold text-center ${loanFilter === 'Pending Approval' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300'}`}>Pending ({mockLoans.filter(l => l.status === 'Pending Approval').length})</button>
                <button onClick={() => setLoanFilter('Defaulted')} className={`p-4 rounded-2xl font-bold text-center ${loanFilter === 'Defaulted' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'}`}>Defaulted ({mockLoans.filter(l => l.status === 'Defaulted').length})</button>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6">Loan Applications</h3>
                <div className="space-y-4">
                  {filteredLoans.map((loan) => {
                    const cfg = getLoanStatusConfig(loan.status);
                    return (
                      <div key={loan.id} className="p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition cursor-pointer" onClick={() => setSelectedLoan(loan)}>
                        <div className="flex justify-between items-start mb-4">
                          <div><div className="font-bold text-slate-900 text-lg">{loan.purpose}</div><div className="text-sm text-slate-500">ID: {loan.id} • {loan.disbursedDate || 'Pending'}</div></div>
                          <div className="text-right"><div className="text-2xl font-black text-indigo-600">GH₵ {loan.amount.toLocaleString()}</div><div className="text-xs text-slate-500">Repayment: GH₵ {loan.repaymentAmount.toLocaleString()}</div></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${cfg.styles}`}>{cfg.icon}<span>{loan.status}</span></span>
                          <span className="text-sm font-bold text-slate-600">{loan.interestRate}% monthly</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => setTransactionFilter('all')} className={`p-4 rounded-2xl font-bold text-center ${transactionFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}>All ({mockTransactions.length})</button>
                <button onClick={() => setTransactionFilter('Income')} className={`p-4 rounded-2xl font-bold text-center ${transactionFilter === 'Income' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>Income ({mockTransactions.filter(t => t.isPositive).length})</button>
                <button onClick={() => setTransactionFilter('Expense')} className={`p-4 rounded-2xl font-bold text-center ${transactionFilter === 'Expense' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-rose-300'}`}>Expense ({mockTransactions.filter(t => !t.isPositive).length})</button>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactionFilter === 'all' 
                    ? mockTransactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${tx.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{tx.isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}</div>
                            <div><div className="font-bold text-slate-900">{tx.description}</div><div className="text-xs text-slate-500">{tx.type} • {tx.date}</div></div>
                          </div>
                          <div className={`text-lg font-black ${tx.isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>{tx.isPositive ? '+' : '-'} GH₵ {tx.amount.toLocaleString()}</div>
                        </div>
                      ))
                    : mockTransactions.filter(tx => transactionFilter === 'Income' ? tx.isPositive : !tx.isPositive).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${tx.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{tx.isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}</div>
                            <div><div className="font-bold text-slate-900">{tx.description}</div><div className="text-xs text-slate-500">{tx.type} • {tx.date}</div></div>
                          </div>
                          <div className={`text-lg font-black ${tx.isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>{tx.isPositive ? '+' : '-'} GH₵ {tx.amount.toLocaleString()}</div>
                        </div>
                      ))
                  }
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-6">System Logs</h3>
                <div className="space-y-3">
                  {mockLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-slate-50 rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3"><div className="p-2 bg-white rounded-lg"><Activity size={16} className="text-indigo-600" /></div><span className="font-bold text-slate-900">{log.action}</span></div>
                        <span className="text-xs text-slate-500">{log.timestamp}</span>
                      </div>
                      <div className="ml-11 text-sm text-slate-600">{log.details}</div>
                      <div className="ml-11 text-xs text-slate-400 mt-1">User: {log.userName} ({log.userId})</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-slate-900">Admin Management</h3>
                  <button onClick={() => setShowCreateAdminModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700">
                    <Check size={16} /><span>Add New Admin</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-4">Admin</th><th className="pb-4">Phone</th><th className="pb-4">Role</th><th className="pb-4">Created</th><th className="pb-4">Status</th><th className="pb-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admins.map((admin, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 font-bold">{admin.name.split(' ').map(n => n[0]).join('')}</div>
                              <div><div className="font-bold text-slate-900">{admin.name}</div><div className="text-xs text-slate-500 font-mono">ID: {admin.id}</div></div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-slate-600 font-mono">{admin.phone}</td>
                          <td className="py-4 text-sm text-slate-600">{admin.role}</td>
                          <td className="py-4 text-sm text-slate-600">{admin.createdAt}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${admin.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{admin.status}</span>
                          </td>
                          <td className="py-4">
                            {admin.role !== 'Super Administrator' && (
                              <div className="flex items-center space-x-2">
                                {admin.status === 'Active' ? (
                                  <button onClick={() => handleSuspendAdmin(i)} className="p-2 hover:bg-rose-100 rounded-lg text-rose-600" title="Suspend Admin"><Ban size={16} /></button>
                                ) : (
                                  <button onClick={() => handleReactivateAdmin(i)} className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600" title="Reactivate Admin"><CheckCircle size={16} /></button>
                                )}
                              </div>
                            )}
                            {admin.role === 'Super Administrator' && <span className="text-xs text-slate-400">System Admin</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl">
            <button onClick={() => setShowCreateAdminModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600"><X size={24} /></button>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Create New Admin</h3>
                <p className="text-slate-500">Add a new administrator to the system</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    placeholder="Enter admin name"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    placeholder="0551234567"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    placeholder="admin@example.com"
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                  <select 
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Loan Manager">Loan Manager</option>
                    <option value="User Support">User Support</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4">
                <button onClick={() => setShowCreateAdminModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">Cancel</button>
                <button onClick={handleCreateAdmin} className="flex-1 py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700">Create Admin</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl">
            <button onClick={() => setSelectedLoan(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600"><X size={24} /></button>
            <div className="space-y-6">
              <div><h3 className="text-2xl font-black text-slate-900">{selectedLoan.purpose}</h3><p className="text-slate-500">Loan ID: {selectedLoan.id}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl"><div className="text-xs text-slate-500 font-bold uppercase">Amount</div><div className="text-xl font-black text-indigo-600">GH₵ {selectedLoan.amount.toLocaleString()}</div></div>
                <div className="p-4 bg-slate-50 rounded-2xl"><div className="text-xs text-slate-500 font-bold uppercase">Interest Rate</div><div className="text-xl font-black text-slate-900">{selectedLoan.interestRate}%</div></div>
                <div className="p-4 bg-slate-50 rounded-2xl"><div className="text-xs text-slate-500 font-bold uppercase">Status</div><div className="text-xl font-black text-slate-900">{selectedLoan.status}</div></div>
                <div className="p-4 bg-slate-50 rounded-2xl"><div className="text-xs text-slate-500 font-bold uppercase">Repayment</div><div className="text-xl font-black text-emerald-600">GH₵ {selectedLoan.repaymentAmount.toLocaleString()}</div></div>
              </div>
              {selectedLoan.status === 'Pending Approval' && (
                <div className="flex space-x-4">
                  <button onClick={handleApproveLoan} className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 flex items-center justify-center"><Check size={20} className="mr-2" />Approve</button>
                  <button onClick={handleRejectLoan} className="flex-1 py-4 bg-rose-100 text-rose-600 font-bold rounded-2xl hover:bg-rose-200 flex items-center justify-center"><Ban size={20} className="mr-2" />Reject</button>
                </div>
              )}
              <button onClick={() => setSelectedLoan(null)} className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

