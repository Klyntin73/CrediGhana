
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Transaction, CreditReport, UserProfile, Loan, BusinessDocument } from '../types';
import { analyzeCreditScore } from '../services/geminiService';
import ScoreGauge from './ScoreGauge';
import AdvisorChat from './AdvisorChat';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Lightbulb, 
  History, 
  PlusCircle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  HandCoins, 
  ChevronRight, 
  Sparkles, 
  X, 
  Calendar,
  Calculator,
  PieChart,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Loader2,
  FileText,
  BadgeCheck,
  Info,
  PiggyBank,
  ShoppingBag,
  CreditCard,
  Building2,
  Lock,
  Smartphone
} from 'lucide-react';

interface DashboardProps {
  searchQuery?: string;
  onReportUpdate?: (report: CreditReport) => void;
  onNotification?: (title: string, message: string, type: 'info' | 'success' | 'warning') => void;
  remindersEnabled?: boolean;
  scoreAlertsEnabled?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  searchQuery = '', 
  onReportUpdate, 
  onNotification,
  remindersEnabled = true,
  scoreAlertsEnabled = true
}) => {
  const [user, setUser] = useState<UserProfile>({
    name: "Loveland Klyntin",
    location: "Accra, Ghana",
    businessType: "Kyntin73 IT – Powering Ideas, Securing Futures",
    memberSince: "Jan 2024",
    isVerified: true,
    ghanaCardNumber: "GHA-724108119-4",
    clearanceStatus: 'Not Requested'
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'MoMo', amount: 1500, date: '2024-05-01', description: 'Business Sales - MTN MoMo', status: 'Completed', isPositive: true },
    { id: '2', type: 'Utility', amount: 200, date: '2024-05-05', description: 'Electricity Bill (ECG)', status: 'Completed', isPositive: false },
    { id: '3', type: 'Inventory', amount: 800, date: '2024-05-10', description: 'New Stock Purchase', status: 'Completed', isPositive: false },
  ]);

  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 'L-101',
      amount: 2500,
      interestRate: 3.5,
      status: 'Active',
      disbursedDate: '2024-04-15',
      purpose: 'Inventory Restock',
      repaymentAmount: 2587.50,
      dueDate: '2024-07-15'
    }
  ]);

  const [report, setReport] = useState<CreditReport | null>(null);
  const prevScoreRef = useRef<number | null>(null);
  const notifiedLoansRef = useRef<Set<string>>(new Set());

  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [loanModal, setLoanModal] = useState(false);
  const [selectedLoanInsight, setSelectedLoanInsight] = useState<Loan | null>(null);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const data = await analyzeCreditScore(transactions, user);
      
      // Handle Score Alert
      if (scoreAlertsEnabled && onNotification && prevScoreRef.current !== null && prevScoreRef.current !== data.score) {
        const diff = data.score - prevScoreRef.current;
        onNotification(
          "Credit Score Updated", 
          `Your AI Credit Score has ${diff > 0 ? 'increased' : 'decreased'} by ${Math.abs(diff)} points! New Score: ${data.score}`,
          diff > 0 ? 'success' : 'warning'
        );
      }
      prevScoreRef.current = data.score;
      
      setReport(data);
      if (onReportUpdate) onReportUpdate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [transactions, user, onReportUpdate, scoreAlertsEnabled, onNotification]);

  useEffect(() => {
    fetchAnalysis();
  }, [transactions, user.isVerified, fetchAnalysis]);

  // Check for upcoming loan reminders
  useEffect(() => {
    if (remindersEnabled && onNotification) {
      const today = new Date();
      loans.forEach(loan => {
        if (loan.status === 'Active' && !notifiedLoansRef.current.has(loan.id)) {
          const dueDate = new Date(loan.dueDate);
          const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          
          if (diffDays <= 7 && diffDays > 0) {
            onNotification(
              "Loan Repayment Reminder", 
              `Your repayment of GH₵ ${loan.repaymentAmount} for "${loan.purpose}" is due in ${diffDays} days.`,
              'info'
            );
            notifiedLoansRef.current.add(loan.id);
          }
        }
      });
    }
  }, [loans, remindersEnabled, onNotification]);

  const requestClearance = () => {
    setClearing(true);
    setTimeout(() => {
      setClearing(false);
      setUser(prev => ({ ...prev, clearanceStatus: 'Verified' }));
      onNotification?.("Clearance Verified", "Your financial clearance certificate has been issued and linked to your Ghana Card.", "success");
    }, 4000);
  };

  const addSimulatedTransaction = (type: Transaction['type'], amount: number, positive: boolean, desc: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      date: new Date().toISOString().split('T')[0],
      description: desc,
      status: 'Completed',
      isPositive: positive
    };
    setTransactions(prev => [newTx, ...prev]);
    onNotification?.("Lab Simulation Active", `${desc} added. AI is updating your score.`, "info");
  };

  const applyForLoan = (amount: number, purpose: string) => {
    const rate = report?.grade === 'A' ? 2.5 : report?.grade === 'B' ? 4 : 7;
    const repayment = amount + (amount * (rate / 100));
    
    const newLoan: Loan = {
      id: `L-${Math.floor(100 + Math.random() * 900)}`,
      amount,
      purpose,
      interestRate: rate,
      status: 'Pending Approval',
      disbursedDate: new Date().toISOString().split('T')[0],
      repaymentAmount: repayment,
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setLoans(prev => [newLoan, ...prev]);
    setLoanModal(false);
    onNotification?.("Application Submitted", "Your capital request is being reviewed by the AI. You will be notified of the decision within 5 minutes.", "info");
  };

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(t => 
      t.description.toLowerCase().includes(q) || 
      t.type.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  const filteredLoans = useMemo(() => {
    if (!searchQuery) return loans;
    const q = searchQuery.toLowerCase();
    return loans.filter(l => l.purpose.toLowerCase().includes(q) || l.id.toLowerCase().includes(q));
  }, [loans, searchQuery]);

  const getLoanStatusConfig = (status: Loan['status']) => {
    switch (status) {
      case 'Active': return { styles: 'bg-indigo-100 text-indigo-700 border-indigo-200', accent: 'border-l-indigo-500', icon: <Activity size={10} className="mr-1" /> };
      case 'Completed': return { styles: 'bg-emerald-100 text-emerald-700 border-emerald-200', accent: 'border-l-emerald-500', icon: <CheckCircle2 size={10} className="mr-1" /> };
      case 'Pending Approval': return { styles: 'bg-amber-100 text-amber-700 border-amber-200', accent: 'border-l-amber-500', icon: <Clock size={10} className="mr-1" /> };
      default: return { styles: 'bg-slate-100 text-slate-700 border-slate-200', accent: 'border-l-slate-300', icon: null };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative animate-in fade-in duration-500">
      <AdvisorChat transactions={transactions} report={report} />
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-[2rem] shadow-sm p-8 border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-[1.5rem] flex items-center justify-center text-indigo-600 text-2xl font-black">LK</div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900 leading-tight">{user.name}</h1>
              <BadgeCheck className="text-indigo-600 w-6 h-6" />
            </div>
            <div className="flex items-center text-slate-500 text-sm space-x-3">
              <span>{user.businessType}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="font-mono text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded uppercase tracking-widest">{user.ghanaCardNumber}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-0 flex space-x-3">
          <button onClick={() => setLoanModal(true)} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95">
            Apply for Loan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Score Area */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12">
            {loading && <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center font-bold text-indigo-700">AI Recalibrating Bureau Data...</div>}
            {report && (
              <>
                <ScoreGauge score={report.score} grade={report.grade} />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
                    <Building2 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Bureau Sync: Success</span>
                  </div>
                  <p className="text-slate-700 italic leading-relaxed font-medium">"{report.explanation}"</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.keyFactors.map((f, i) => (
                      <div key={i} className={`p-4 rounded-2xl border ${f.impact === 'Positive' ? 'border-emerald-100 bg-emerald-50/30' : 'border-rose-100 bg-rose-50/30'}`}>
                        <div className="flex items-center mb-1 font-bold text-xs text-slate-800">
                          {f.impact === 'Positive' ? <TrendingUp size={16} className="text-emerald-600 mr-2" /> : <TrendingDown size={16} className="text-rose-600 mr-2" />}
                          {f.factor}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">{f.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Real-time Impact Lab */}
          <div className="bg-indigo-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="w-8 h-8 text-indigo-300" />
                <h2 className="text-2xl font-black tracking-tight">Real-time Impact Lab</h2>
              </div>
              <p className="text-indigo-200 text-sm mb-8 max-w-md">Try these scenarios to see how AI adjusts your score. Positive habits unlock higher loan limits instantly.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <SimBtn 
                  onClick={() => addSimulatedTransaction('MoMo', 3000, true, 'High-Value Sale')} 
                  icon={<PlusCircle className="text-emerald-400" />} 
                  label="Bulk Sale" 
                  sub="+ GH₵ 3k" 
                />
                <SimBtn 
                  onClick={() => addSimulatedTransaction('Utility', 250, true, 'Utility Payment')} 
                  icon={<CheckCircle2 className="text-indigo-300" />} 
                  label="Bill Pay" 
                  sub="Trust Factor" 
                />
                <SimBtn 
                  onClick={() => addSimulatedTransaction('Savings', 1200, true, 'Susu Deposit')} 
                  icon={<PiggyBank className="text-amber-400" />} 
                  label="Susu Depo" 
                  sub="Resilience" 
                />
                <SimBtn 
                  onClick={() => addSimulatedTransaction('Inventory', 1500, false, 'Stock Purchase')} 
                  icon={<ShoppingBag className="text-emerald-300" />} 
                  label="Restock" 
                  sub="Activity" 
                />
                <SimBtn 
                  onClick={() => addSimulatedTransaction('LoanRepayment', 500, false, 'Late Fee')} 
                  icon={<AlertCircle className="text-rose-400" />} 
                  label="Missed Pay" 
                  sub="Risk Warning" 
                  isRisk 
                />
              </div>
            </div>
            <div className="absolute top-0 right-0 p-20 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={240} />
            </div>
          </div>

          {/* Financial Bureau & Clearance Widget */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck size={120} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">Financial Clearance Status</h3>
                  <p className="text-slate-500 text-sm">Official certificate required for high-value loans and government contracts.</p>
                </div>
                {user.clearanceStatus === 'Verified' ? (
                  <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black flex items-center shadow-sm">
                    <CheckCircle2 size={14} className="mr-2" /> CLEARED
                  </div>
                ) : user.clearanceStatus === 'Pending' || clearing ? (
                   <div className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-black flex items-center shadow-sm">
                    <Loader2 size={14} className="mr-2 animate-spin" /> VERIFYING
                  </div>
                ) : (
                  <div className="px-4 py-1.5 bg-slate-100 text-slate-400 rounded-full text-xs font-black flex items-center">
                    NOT REQUESTED
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Smartphone size={14} />
                    <span>NIA Database Sync</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-700">Identity Status:</span>
                    <span className="text-xs font-black text-emerald-600">MATCHED</span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full"></div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Building2 size={14} />
                    <span>XDS Data Hub</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-700">Bureau Health:</span>
                    <span className="text-xs font-black text-indigo-600">89% SECURE</span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[89%]"></div>
                  </div>
                </div>
              </div>

              {user.clearanceStatus !== 'Verified' && (
                <button 
                  onClick={requestClearance}
                  disabled={clearing}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-[1.5rem] shadow-xl hover:bg-black transition flex items-center justify-center disabled:opacity-50"
                >
                  {clearing ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin mr-3" />
                      <span>Syncing with Credit Bureau...</span>
                    </div>
                  ) : (
                    <>
                      <Lock size={18} className="mr-2" />
                      Request Full Financial Clearance
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Quick Finance Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Susu Progress</div>
                <div className="text-xl font-black text-slate-900">GH₵ 8,400.00</div>
                <div className="text-[10px] text-indigo-600 font-bold">70% of Shop Rent Goal</div>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                <PiggyBank size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Pay Later</div>
                <div className="text-xl font-black text-slate-900">GH₵ 3,000.00</div>
                <div className="text-[10px] text-emerald-600 font-bold">Next payment Jun 15</div>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} />
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative">
            <h2 className="text-lg font-black mb-6 flex items-center">
              <HandCoins className="w-5 h-5 text-indigo-500 mr-2" />
              Loan History
            </h2>
            <div className="space-y-4">
              {filteredLoans.map(loan => {
                const cfg = getLoanStatusConfig(loan.status);
                return (
                  <div key={loan.id} className="p-5 rounded-3xl border-2 border-slate-50 hover:border-indigo-100 transition-all cursor-pointer group" onClick={() => setSelectedLoanInsight(loan)}>
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-black text-slate-900">GH₵ {loan.amount.toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border ${cfg.styles}`}>
                        {loan.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-4">{loan.purpose}</div>
                    <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                      <div>
                        <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Interest Rate</div>
                        <div className="text-xs font-black text-emerald-600">{loan.interestRate}% <span className="text-[8px] font-normal">p/m</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Repayment</div>
                        <div className="text-xs font-black text-indigo-600">GH₵ {loan.repaymentAmount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-[450px] flex flex-col">
            <h2 className="text-lg font-black mb-6 flex items-center">
              <History className="w-5 h-5 text-indigo-500 mr-2" />
              Activity
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {filteredTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-50 group hover:bg-white hover:border-indigo-100 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${tx.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.isPositive ? <ArrowUpRight size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800">{tx.description}</div>
                      <div className="text-[9px] text-slate-400 font-bold">{tx.date}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-black ${tx.isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {tx.isPositive ? '+' : '-'} GH₵ {tx.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loan Insight Popover */}
      {selectedLoanInsight && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedLoanInsight(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition">
              <X size={24} />
            </button>
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.5rem]">
                  <Calculator size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Logic Check</h3>
                  <p className="text-slate-500 text-sm font-medium">Loan ID: {selectedLoanInsight.id}</p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Market Base</span>
                  <span className="font-mono font-bold">2.00%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Grade {report?.grade} Risk Premium</span>
                  <span className="font-mono font-bold text-rose-500">+{(selectedLoanInsight.interestRate - 2).toFixed(2)}%</span>
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-black text-slate-900">Total Monthly Rate</span>
                  <span className="text-2xl font-black text-indigo-600">{selectedLoanInsight.interestRate}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <Sparkles size={18} className="text-emerald-600" />
                <p className="text-xs text-emerald-800 font-medium">Your score of {report?.score} saved you <span className="font-black">GH₵ 120</span> compared to a Grade C merchant.</p>
              </div>

              <button 
                onClick={() => setSelectedLoanInsight(null)}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-xl shadow-slate-200 hover:bg-black transition active:scale-95"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {loanModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              applyForLoan(Number(f.get('amount')), String(f.get('purpose')));
            }}
            className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl relative animate-in zoom-in duration-200"
          >
            <button type="button" onClick={() => setLoanModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition"><X /></button>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Growth Capital</h3>
            <p className="text-slate-500 mb-8 font-medium">Your limit is GH₵ 5,000 based on Grade {report?.grade}.</p>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Request Amount (GH₵)</label>
                <input name="amount" type="number" defaultValue="1000" min="100" max="5000" className="w-full px-6 py-4 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none font-black text-xl transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-2">Primary Purpose</label>
                <select name="purpose" className="w-full px-6 py-4 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none font-bold transition-all appearance-none">
                  <option>Restock Inventory</option>
                  <option>New Equipment</option>
                  <option>Shop Expansion</option>
                </select>
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95">
                Submit Digital Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const SimBtn = ({ onClick, icon, label, sub, isRisk = false }: { onClick: () => void, icon: React.ReactNode, label: string, sub: string, isRisk?: boolean }) => (
  <button 
    onClick={onClick} 
    className={`p-4 md:p-6 rounded-3xl transition-all text-center group flex flex-col items-center justify-center space-y-2 border border-transparent shadow-sm active:scale-95 ${isRisk ? 'bg-white/5 hover:bg-rose-500/30 hover:border-rose-400/30' : 'bg-white/10 hover:bg-white/20 hover:border-white/30'}`}
  >
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-xs font-black block">{label}</span>
    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">{sub}</span>
  </button>
);

export default Dashboard;
