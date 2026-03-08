
import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  CreditCard, 
  ShoppingBag, 
  Send, 
  Plus, 
  ChevronRight, 
  Smartphone, 
  Globe, 
  Lock, 
  ArrowRight,
  Target,
  Clock,
  CheckCircle2,
  TrendingUp,
  History,
  Info,
  Loader2,
  Scan,
  X,
  Camera,
  Package,
  ShoppingCart,
  Zap,
  Tag,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { SavingsGoal, BNPLOrder, VirtualCard } from '../types';

interface FinanceToolsProps {
  onNotification: (title: string, message: string, type: 'info' | 'success' | 'warning') => void;
}

const FinanceTools: React.FC<FinanceToolsProps> = ({ onNotification }) => {
  const [activeSubTab, setActiveSubTab] = useState<'susu' | 'bnpl' | 'cards' | 'p2p'>('susu');
  const [loading, setLoading] = useState(false);
  
  // Modals
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [scanningStatus, setScanningStatus] = useState<'idle' | 'scanning' | 'found'>('idle');

  // Security Features State
  const [instantFreezeEnabled, setInstantFreezeEnabled] = useState(true);
  const [smsVerificationEnabled, setSmsVerificationEnabled] = useState(true);
  const [showUsageHistory, setShowUsageHistory] = useState(false);
  const [showHealthCheck, setShowHealthCheck] = useState(false);
  
  // Usage history data
  const [cardTransactions, setCardTransactions] = useState([
    { id: 't1', merchant: 'Alibaba Express', amount: 450, date: '2024-06-10', status: 'Completed' },
    { id: 't2', merchant: 'Amazon Global', amount: 125, date: '2024-06-08', status: 'Completed' },
    { id: 't3', merchant: 'Shein Wholesale', amount: 280, date: '2024-06-05', status: 'Completed' },
    { id: 't4', merchant: 'eBay Seller GH', amount: 89, date: '2024-06-01', status: 'Completed' },
  ]);

  // Roundup State
  const [isRoundupActive, setIsRoundupActive] = useState(true);
  const [roundupSavings, setRoundupSavings] = useState(124.50);

  // States for dynamic updates
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: 'g1', name: 'New Shop Rent', target: 12000, current: 8400, icon: '🏠', deadline: '2024-12-01' },
    { id: 'g2', name: 'Import Duty Buffer', target: 5000, current: 1200, icon: '🚢', deadline: '2024-10-15' }
  ]);

  const [bnplOrders, setBnplOrders] = useState<BNPLOrder[]>([
    { id: 'b1', merchant: 'Alibaba Wholesaler', totalAmount: 4500, paidAmount: 1500, nextInstallmentDate: '2024-06-15', status: 'Active' }
  ]);

  const [cards, setCards] = useState<VirtualCard[]>([
    { id: 'v1', lastFour: '8842', expiry: '08/26', type: 'VISA', status: 'Active', limit: 2500 }
  ]);

  const [p2pAmount, setP2pAmount] = useState('0');
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsPermission, setContactsPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  // Simulated contacts data
  const [contacts, setContacts] = useState([
    { id: 'c1', name: 'Adjoa (Kiosk)', phone: '0245123456', verified: true },
    { id: 'c2', name: 'Kojo Logistics', phone: '0555987654', verified: true },
    { id: 'c3', name: 'Makola Textiles', phone: '0501234567', verified: true },
    { id: 'c4', name: 'Akwasi Provisions', phone: '0549876543', verified: true },
  ]);

  // Simulated Catalog Data
  const catalogItems = [
    { id: 'cat1', name: 'Bulk GTP Wax Print', supplier: 'Akosombo Textiles', price: 2400, img: 'https://images.unsplash.com/photo-1590736910113-f9fbe399ca9d?auto=format&fit=crop&q=80&w=200' },
    { id: 'cat2', name: 'Wholesale Basmati Rice (50kg)', supplier: 'Olam Ghana', price: 850, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' },
    { id: 'cat3', name: 'Solar Lantern Crate', supplier: 'Sunlight Hub', price: 3200, img: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?auto=format&fit=crop&q=80&w=200' },
    { id: 'cat4', name: 'Android Tablet (Bulk 5x)', supplier: 'Freddies Hub', price: 5500, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=200' },
  ];

  // Handlers
  const handleAddSusuGoal = () => {
    onNotification("Goal Configurator", "Redirecting to your personalized goal-setting AI advisor...", "info");
  };

  const handleToggleRoundups = () => {
    const nextState = !isRoundupActive;
    setIsRoundupActive(nextState);
    if (nextState) {
      onNotification("Auto-Roundups Active", "We are now rounding your MoMo sales to the nearest GH₵ 10 to grow your Susu.", "success");
    } else {
      onNotification("Roundups Paused", "Automatic savings from roundups have been suspended.", "warning");
    }
  };

  const handlePayInstallment = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setBnplOrders(prev => prev.map(order => {
        if (order.id === id) {
          const installment = 750;
          const newPaid = Math.min(order.totalAmount, order.paidAmount + installment);
          return { ...order, paidAmount: newPaid, status: newPaid >= order.totalAmount ? 'Completed' : 'Active' };
        }
        return order;
      }));
      setLoading(false);
      onNotification("Payment Successful", "GH₵ 750.00 installment paid. Your business credit health just improved!", "success");
    }, 1500);
  };

  const handleScanToStock = () => {
    setIsScanModalOpen(true);
    setScanningStatus('scanning');
    setTimeout(() => {
      setScanningStatus('found');
    }, 2500);
  };

  const confirmScannedItem = () => {
    const newOrder: BNPLOrder = {
      id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
      merchant: 'Verified Local Wholesaler',
      totalAmount: 1250,
      paidAmount: 0,
      nextInstallmentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active'
    };
    setBnplOrders(prev => [newOrder, ...prev]);
    setIsScanModalOpen(false);
    onNotification("Inventory Added", "New stock added to Pay Later schedule. First payment in 14 days.", "success");
  };

  // Security Feature Handlers
  const handleToggleInstantFreeze = () => {
    const newState = !instantFreezeEnabled;
    setInstantFreezeEnabled(newState);
    onNotification(
      newState ? "Instant Freeze Enabled" : "Instant Freeze Disabled",
      newState 
        ? "Your card can now be instantly frozen from the mobile app if lost or stolen."
        : "Instant freeze has been disabled. You can still freeze your card from the web dashboard.",
      newState ? "success" : "warning"
    );
  };

  const handleToggleSmsVerification = () => {
    const newState = !smsVerificationEnabled;
    setSmsVerificationEnabled(newState);
    onNotification(
      newState ? "SMS Verification Enabled" : "SMS Verification Disabled",
      newState
        ? "You'll receive SMS alerts for every transaction on your virtual card."
        : "SMS transaction alerts have been disabled.",
      newState ? "success" : "warning"
    );
  };

  const handleViewUsageHistory = () => {
    setShowUsageHistory(true);
    onNotification("Usage History", "Loading your virtual card transaction history...", "info");
  };

  const handleFreezeCard = (cardId: string) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, status: card.status === 'Active' ? 'Frozen' : 'Active' }
        : card
    ));
    const card = cards.find(c => c.id === cardId);
    const isNowFrozen = card?.status === 'Active';
    onNotification(
      isNowFrozen ? "Card Unfrozen" : "Card Frozen",
      isNowFrozen 
        ? `Card ending in ${card?.lastFour} has been unfrozen and is ready to use.`
        : `Card ending in ${card?.lastFour} has been frozen. No transactions will be allowed.`,
      isNowFrozen ? "success" : "warning"
    );
  };

  const handleViewFullHealthCheck = () => {
    setShowHealthCheck(true);
    onNotification("Financial Health Check", "Loading your comprehensive business health dashboard...", "info");
  };

  const handleBrowseCatalog = () => {
    setIsCatalogModalOpen(true);
  };

  const placeCatalogOrder = (item: any) => {
    setLoading(true);
    setTimeout(() => {
      const newOrder: BNPLOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        merchant: item.supplier,
        totalAmount: item.price,
        paidAmount: 0,
        nextInstallmentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Active'
      };
      setBnplOrders(prev => [newOrder, ...prev]);
      setLoading(false);
      setIsCatalogModalOpen(false);
      onNotification("Order Confirmed", `${item.name} from ${item.supplier} has been ordered via Pay Later.`, "success");
    }, 1500);
  };

  const handleCreateVirtualCard = () => {
    setLoading(true);
    setTimeout(() => {
      const newCard: VirtualCard = {
        id: `v${Date.now()}`,
        lastFour: Math.floor(1000 + Math.random() * 9000).toString(),
        expiry: '12/26',
        type: 'Mastercard',
        status: 'Active',
        limit: 1000
      };
      setCards(prev => [...prev, newCard]);
      setLoading(false);
      onNotification("Card Issued", "New Virtual Trade Card created for global procurement.", "success");
    }, 2000);
  };

  const handleSendP2P = () => {
    const amountNum = parseFloat(p2pAmount);
    if (!selectedRecipient) {
      onNotification("Select Recipient", "Please choose a merchant to receive the funds.", "warning");
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      onNotification("Invalid Amount", "Please enter a valid amount to transfer.", "warning");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNotification("Transfer Sent", `GH₵ ${amountNum.toLocaleString()} sent successfully to ${selectedRecipient}.`, "success");
      setP2pAmount('0');
      setSelectedRecipient(null);
    }, 1800);
  };

  const handleRequestContactsAccess = () => {
    setContactsLoading(true);
    // Simulate requesting contacts permission
    setTimeout(() => {
      setContactsLoading(false);
      // Simulate permission granted (in real app, this would be actual permission request)
      setContactsPermission('granted');
      onNotification("Contacts Access Granted", "Successfully synced your phone contacts. Found 4 verified CrediGhana merchants.", "success");
    }, 2000);
  };

  const handleSelectContact = (contact: { id: string; name: string; phone: string; verified: boolean }) => {
    setSelectedRecipient(contact.name);
    setShowContactsModal(false);
    onNotification("Contact Selected", `${contact.name} selected for transfer.`, "info");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Financial Tools</h2>
        <p className="text-slate-500 max-w-2xl">Modern banking tools adapted for the Ghanaian entrepreneur. Manage Susu, pay in installments, and trade globally.</p>
      </div>

      {/* Internal Navigation */}
      <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <NavButton active={activeSubTab === 'susu'} onClick={() => setActiveSubTab('susu')} icon={<PiggyBank size={18} />} label="Susu 2.0" />
        <NavButton active={activeSubTab === 'bnpl'} onClick={() => setActiveSubTab('bnpl')} icon={<ShoppingBag size={18} />} label="Pay Later" />
        <NavButton active={activeSubTab === 'cards'} onClick={() => setActiveSubTab('cards')} icon={<CreditCard size={18} />} label="Global Cards" />
        <NavButton active={activeSubTab === 'p2p'} onClick={() => setActiveSubTab('p2p')} icon={<Send size={18} />} label="Send Money" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeSubTab === 'susu' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Target size={24} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Modern Susu Goals</h3>
                <p className="text-slate-500 text-sm mb-8">AI-optimized savings targets with auto-contributions from every MoMo sale.</p>
                
                <div className="space-y-6">
                  {goals.map(goal => (
                    <div key={goal.id} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{goal.icon}</span>
                          <div>
                            <div className="font-bold text-slate-900">{goal.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Goal GH₵ {goal.target.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-indigo-600">GH₵ {goal.current.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{Math.round((goal.current / goal.target) * 100)}% Complete</div>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                          style={{ width: `${(goal.current / goal.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddSusuGoal}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold flex items-center justify-center hover:border-indigo-300 hover:text-indigo-600 transition-all"
                  >
                    <Plus size={20} className="mr-2" /> Start New Susu Goal
                  </button>
                </div>
              </div>

              {/* Auto-Roundups Functional Card */}
              <div className={`rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between transition-colors duration-500 ${isRoundupActive ? 'bg-indigo-900' : 'bg-slate-800 opacity-90'}`}>
                <div className="space-y-2 mb-6 md:mb-0">
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={20} className={isRoundupActive ? "text-emerald-400" : "text-slate-500"} />
                    <h4 className="font-bold text-lg">
                      Auto-Roundups {isRoundupActive ? 'Active' : 'Paused'}
                    </h4>
                  </div>
                  <p className="text-indigo-100 text-sm max-w-sm">
                    {isRoundupActive 
                      ? "Rounding every sale to the nearest GH₵ 10 and saving the change automatically." 
                      : "Automatic roundups are currently paused. Enable to build your savings faster."}
                    {isRoundupActive && (
                      <span className="block mt-1">
                        You've saved <span className="text-white font-black">GH₵ {roundupSavings.toFixed(2)}</span> this week!
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                   <button 
                    onClick={handleToggleRoundups}
                    className={`flex items-center space-x-2 px-6 py-3 font-bold rounded-2xl transition shadow-xl ${isRoundupActive ? 'bg-indigo-700 text-white hover:bg-indigo-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                  >
                    {isRoundupActive ? <ToggleRight size={24} className="mr-2" /> : <ToggleLeft size={24} className="mr-2" />}
                    <span>{isRoundupActive ? 'Active' : 'Enable'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'bnpl' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xl font-bold">Inventory Installments</h3>
                    <p className="text-slate-500 text-sm">Stock up now, pay as you sell in 4 interest-free installments.</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">BNPL Approved</div>
                </div>

                <div className="space-y-4">
                  {bnplOrders.map(order => (
                    <div key={order.id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <ShoppingBag size={20} className="text-slate-600" />
                          </div>
                          <div>
                            <div className="font-bold">{order.merchant}</div>
                            <div className="text-xs text-slate-500">Order #{order.id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-bold uppercase">Next Payout</div>
                          <div className="font-bold text-slate-900">{order.nextInstallmentDate}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                          <span>Progress</span>
                          <span>GH₵ {order.paidAmount} / {order.totalAmount}</span>
                        </div>
                        <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(order.paidAmount / order.totalAmount) * 100}%` }} />
                        </div>
                      </div>

                      <button 
                        disabled={loading || order.status === 'Completed'}
                        onClick={() => handlePayInstallment(order.id)}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-sm disabled:opacity-50 flex items-center justify-center"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                        {order.status === 'Completed' ? 'Fully Repaid' : 'Pay Installment GH₵ 750.00'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={handleScanToStock}
                  className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition"
                >
                  <div>
                    <div className="font-bold">Scan to Stock</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">At Registered Wholesalers</div>
                  </div>
                  <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                    <Scan size={20} />
                  </div>
                </div>
                <div 
                  onClick={handleBrowseCatalog}
                  className="p-6 bg-indigo-600 rounded-[2rem] text-white flex items-center justify-between group cursor-pointer hover:bg-indigo-700 transition"
                >
                  <div>
                    <div className="font-bold">Browse Catalog</div>
                    <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-widest">Verified Partners</div>
                  </div>
                  <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'cards' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold mb-2">Virtual Trade Cards</h3>
                <p className="text-slate-500 text-sm mb-8">Instant VISA/Mastercard for international procurement. Pay in Cedis, settle in USD/CNY.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {cards.map(card => (
                    <div key={card.id} className="aspect-[1.6/1] bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-6 text-white relative shadow-xl overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Globe size={80} />
                      </div>
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                          <div className="font-black text-xl italic">{card.type}</div>
                          <div className="w-10 h-8 bg-amber-400/80 rounded flex items-center justify-center">
                            <div className="w-6 h-4 border border-amber-900/20 rounded"></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-lg tracking-[0.2em] font-mono mb-1">•••• •••• •••• {card.lastFour}</div>
                          <div className="flex justify-between items-end">
                            <div className="text-[10px] uppercase font-bold text-indigo-300">
                              Expiry: {card.expiry}
                            </div>
                            <button 
                              onClick={() => onNotification("Card Security", `Displaying details for card *${card.lastFour}. Enter PIN to view full CVV.`, "info")}
                              className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition backdrop-blur-sm"
                            >
                              <Lock size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    disabled={loading}
                    onClick={handleCreateVirtualCard}
                    className="aspect-[1.6/1] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all p-6 text-center space-y-2 group disabled:opacity-50"
                  >
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition">
                      {loading ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                    </div>
                    <span className="font-bold text-sm">Create Global Trade Card</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">GH₵ 10 Setup Fee</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4">Security Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={handleToggleInstantFreeze}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${instantFreezeEnabled ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-indigo-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Lock size={16} className={instantFreezeEnabled ? "text-emerald-600" : "text-slate-400"} />
                      <div className={`w-8 h-4 rounded-full relative p-0.5 transition-colors ${instantFreezeEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${instantFreezeEnabled ? 'left-4' : 'left-0.5'}`}></div>
                      </div>
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-widest ${instantFreezeEnabled ? 'text-emerald-700' : 'text-slate-500'}`}>Instant Freeze</div>
                    <div className="text-[10px] text-slate-400 mt-1">{instantFreezeEnabled ? 'Enabled' : 'Disabled'}</div>
                  </div>
                  
                  <div 
                    onClick={handleToggleSmsVerification}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${smsVerificationEnabled ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-indigo-200'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Smartphone size={16} className={smsVerificationEnabled ? "text-emerald-600" : "text-slate-400"} />
                      <div className={`w-8 h-4 rounded-full relative p-0.5 transition-colors ${smsVerificationEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${smsVerificationEnabled ? 'left-4' : 'left-0.5'}`}></div>
                      </div>
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-widest ${smsVerificationEnabled ? 'text-emerald-700' : 'text-slate-500'}`}>SMS Verification</div>
                    <div className="text-[10px] text-slate-400 mt-1">{smsVerificationEnabled ? 'Enabled' : 'Disabled'}</div>
                  </div>
                  
                  <div 
                    onClick={handleViewUsageHistory}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <History size={16} className="text-indigo-600" />
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-700">Usage History</div>
                    <div className="text-[10px] text-slate-400 mt-1">View Transactions</div>
                  </div>
                </div>
                
                {/* Card Freeze Button */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-800">Card Status Control</div>
                      <div className="text-xs text-slate-500">Freeze or unfreeze your virtual card instantly</div>
                    </div>
                    {cards.map(card => (
                      <button
                        key={card.id}
                        onClick={() => handleFreezeCard(card.id)}
                        className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                          card.status === 'Active' 
                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' 
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {card.status === 'Active' ? 'Freeze Card' : 'Unfreeze Card'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'p2p' && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-2">Community Transfer</h3>
                <p className="text-slate-500 text-sm">Send funds instantly to other verified merchants in the CrediGhana network.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Select Recipient</label>
                    {selectedRecipient && (
                      <button onClick={() => setSelectedRecipient(null)} className="text-[10px] font-bold text-rose-500 flex items-center">
                        <X size={10} className="mr-1" /> Clear
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                    <div 
                      onClick={() => setShowContactsModal(true)}
                      className="flex flex-col items-center space-y-2 shrink-0 cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-indigo-200 flex items-center justify-center text-indigo-600 cursor-pointer hover:bg-indigo-50 transition">
                        <Plus size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">Add New</span>
                    </div>
                    {['Adjoa (Kiosk)', 'Kojo Logistics', 'Makola Textiles', 'Akwasi Provisions'].map((name, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedRecipient(name)}
                        className="flex flex-col items-center space-y-2 shrink-0 cursor-pointer group"
                      >
                        <div className={`relative w-14 h-14 rounded-full transition-all ${selectedRecipient === name ? 'p-1 bg-indigo-600' : 'p-0 bg-transparent'}`}>
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=merch${i}`} 
                            className="w-full h-full rounded-full border-2 border-white shadow-sm" 
                            alt={name}
                          />
                          {selectedRecipient === name && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                              <CheckCircle2 size={14} className="text-indigo-600" />
                            </div>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold transition-colors whitespace-nowrap ${selectedRecipient === name ? 'text-indigo-600' : 'text-slate-700'}`}>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                  <div className="text-center space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount to Send</div>
                    <div className="text-4xl font-black text-slate-900 flex items-center justify-center">
                      <span className="text-lg mr-1">GH₵</span>
                      <input 
                        type="number" 
                        value={p2pAmount}
                        onChange={(e) => setP2pAmount(e.target.value)}
                        className="bg-transparent border-none outline-none w-32 text-center"
                        onFocus={() => p2pAmount === '0' && setP2pAmount('')}
                        onBlur={() => p2pAmount === '' && setP2pAmount('0')}
                      />
                    </div>
                    {selectedRecipient && (
                      <div className="text-xs font-bold text-indigo-600 mt-2">Sending to: {selectedRecipient}</div>
                    )}
                  </div>
                  <button 
                    disabled={loading}
                    onClick={handleSendP2P}
                    className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                    {loading ? 'Processing...' : `Send GH₵ ${p2pAmount || 0} Now`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h4 className="font-bold text-slate-900 flex items-center"><Info size={16} className="mr-2 text-indigo-600" /> Usage Tips</h4>
            <div className="space-y-4">
              <TipItem 
                title="Boost Your Grade" 
                desc="Active virtual card usage for inventory increases your AI credit grade by 5% monthly."
              />
              <TipItem 
                title="Interest Free BNPL" 
                desc="Always pay installments 24 hours early to unlock higher credit limits."
              />
              <TipItem 
                title="Community Trust" 
                desc="Successful P2P transfers within the Makola market hub build your business 'Trust Network' score."
              />
            </div>
          </div>

          <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-50 space-y-4">
            <div className="p-2 bg-white/20 rounded-xl w-fit">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="font-bold text-lg leading-tight">Your Financial Vault is 85% Optimized</h4>
            <p className="text-emerald-100 text-xs">You're in the top 10% of merchants using modern tools in Accra.</p>
            <div className="pt-2">
              <button 
                onClick={handleViewFullHealthCheck}
                className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition"
              >
                View Full Health Check
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      
      {/* Usage History Modal */}
      {showUsageHistory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setShowUsageHistory(false)} 
              className="absolute top-6 right-6 z-50 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition"
            >
              <X size={24} className="text-slate-400" />
            </button>
            
            <div className="p-8 border-b border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                  <History size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Usage History</h3>
                  <p className="text-slate-500 font-medium text-sm">Your virtual card transactions</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {cardTransactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition mb-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <Globe size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{transaction.merchant}</div>
                      <div className="text-xs text-slate-400">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">GH₵ {transaction.amount.toLocaleString()}</div>
                    <div className="text-xs text-emerald-600 font-bold">{transaction.status}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center">
                <div className="text-sm font-bold text-slate-500">Total Spent</div>
                <div className="text-xl font-black text-slate-900">
                  GH₵ {cardTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Health Check Modal */}
      {showHealthCheck && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowHealthCheck(false)} 
              className="absolute top-6 right-6 z-50 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition"
            >
              <X size={24} className="text-slate-400" />
            </button>
            
            <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Business Health Check</h3>
                  <p className="text-emerald-100 font-medium text-sm">Comprehensive financial analysis for Kyntin73 IT</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Overall Score */}
              <div className="text-center p-6 bg-slate-50 rounded-[2rem]">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Health Score</div>
                <div className="text-5xl font-black text-emerald-600">85%</div>
                <div className="text-sm font-bold text-emerald-700 mt-2">Excellent - Top 10% of Merchants</div>
              </div>

              {/* Health Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <HealthMetric 
                  title="Credit Score" 
                  value="742" 
                  grade="A" 
                  status="Excellent"
                  color="emerald"
                />
                <HealthMetric 
                  title="Payment History" 
                  value="98%" 
                  grade="A" 
                  status="On Time"
                  color="emerald"
                />
                <HealthMetric 
                  title="Credit Utilization" 
                  value="23%" 
                  grade="B" 
                  status="Good"
                  color="indigo"
                />
                <HealthMetric 
                  title="Trust Network" 
                  value="156" 
                  grade="A" 
                  status="Strong"
                  color="emerald"
                />
              </div>

              {/* Cash Flow Summary */}
              <div className="p-6 rounded-[2rem] border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                  <TrendingUp size={18} className="mr-2 text-emerald-600" />
                  Cash Flow Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Monthly Inflow</span>
                    <span className="font-bold text-emerald-600">GH₵ 12,450.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Monthly Outflow</span>
                    <span className="font-bold text-rose-600">GH₵ 8,230.00</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700">Net Cash Flow</span>
                    <span className="font-black text-emerald-600">+GH₵ 4,220.00</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-6 rounded-[2rem] bg-indigo-50 border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-4 flex items-center">
                  <Zap size={18} className="mr-2 text-indigo-600" />
                  AI Recommendations
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                    <p className="text-sm text-indigo-800">Your BNPL payments are consistently on time. Consider requesting a credit limit increase.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                    <p className="text-sm text-indigo-800">Auto-roundups are helping you save. You're on track to hit your shop rent goal by December.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <TrendingUp size={16} className="text-emerald-600 mt-0.5" />
                    <p className="text-sm text-indigo-800">P2P transaction volume increased 15% this month. Your Trust Network score is growing!</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowHealthCheck(false)}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition"
              >
                Close Health Check
              </button>
            </div>
          </div>
        </div>
      )}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setIsScanModalOpen(false)} 
              className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-slate-100 rounded-full transition"
            >
              <X size={24} className="text-slate-400" />
            </button>

            {scanningStatus === 'scanning' ? (
              <div className="p-12 flex flex-col items-center space-y-8">
                <div className="relative w-64 h-64 border-4 border-dashed border-indigo-200 rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-slate-50 flex items-center justify-center opacity-20">
                    <Camera size={100} className="text-indigo-600 animate-pulse" />
                  </div>
                  {/* Scanning Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.8)] animate-scan-y"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Scanning Stock...</h3>
                  <p className="text-slate-500 font-medium">Point your camera at the wholesaler's certified QR code.</p>
                </div>
                <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Synchronizing with NIA Database</span>
                </div>
              </div>
            ) : (
              <div className="p-12 space-y-8 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                  <Package size={40} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black text-slate-900">Product Detected</h3>
                  <div className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                    <CheckCircle2 size={14} className="mr-2" /> Verified Wholesaler
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Description</div>
                      <div className="font-bold text-slate-800">Premium Dutch Wax (Bulk - 50 Yards)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wholesale Price</div>
                      <div className="font-black text-xl text-slate-900">GH₵ 1,250.00</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex items-center space-x-3 text-[10px] font-bold text-indigo-600">
                    <Zap size={14} />
                    <span>Eligible for 4-Installment Pay Later with 0% interest.</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button 
                    onClick={confirmScannedItem}
                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
                  >
                    Confirm & Add to Pay Later
                  </button>
                  <button 
                    onClick={() => setIsScanModalOpen(false)}
                    className="w-full py-4 bg-white text-slate-400 font-bold rounded-[1.5rem] hover:text-slate-600 transition"
                  >
                    Cancel Scan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Catalog Modal */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl relative h-[90vh] flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Wholesale Marketplace</h3>
                  <p className="text-slate-500 font-medium text-sm">Stock your shop directly from verified suppliers via CrediGhana BNPL.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCatalogModalOpen(false)} 
                className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition shadow-sm"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-6 custom-scrollbar">
              {catalogItems.map(item => (
                <div key={item.id} className="p-6 rounded-[2.5rem] border border-slate-100 bg-slate-50 group hover:border-indigo-200 transition-all flex space-x-6 items-center">
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-inner shrink-0 relative">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{item.supplier}</div>
                      <h4 className="text-lg font-black text-slate-900 leading-tight">{item.name}</h4>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-slate-900">GH₵ {item.price.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Wholesale Price</span>
                    </div>
                    <button 
                      onClick={() => placeCatalogOrder(item)}
                      disabled={loading}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm w-full"
                    >
                      <Tag size={14} />
                      <span>Order with Pay Later</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-emerald-600 font-bold text-xs">
                <ShieldCheck size={18} />
                <span>Secure 256-bit encrypted logistics tracking included.</span>
              </div>
              <button 
                onClick={() => setIsCatalogModalOpen(false)}
                className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition"
              >
                Return to Tools
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan-y {
          0% { transform: translateY(0); }
          50% { transform: translateY(256px); }
          100% { transform: translateY(0); }
        }
        .animate-scan-y {
          animation: scan-y 2.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const SecurityFeature = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group cursor-pointer hover:bg-white hover:border-indigo-100 transition-all">
    <div className="text-indigo-600 group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{label}</span>
  </div>
);

const TipItem = ({ title, desc }: { title: string, desc: string }) => (
  <div className="space-y-1">
    <div className="text-sm font-bold text-slate-800">{title}</div>
    <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const HealthMetric = ({ title, value, grade, status, color }: { title: string, value: string, grade: string, status: string, color: 'emerald' | 'indigo' }) => (
  <div className={`p-4 rounded-2xl border ${color === 'emerald' ? 'bg-emerald-50 border-emerald-100' : 'bg-indigo-50 border-indigo-100'}`}>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</div>
    <div className="flex items-end justify-between">
      <div className={`text-2xl font-black ${color === 'emerald' ? 'text-emerald-600' : 'text-indigo-600'}`}>{value}</div>
      <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
        Grade {grade}
      </div>
    </div>
    <div className="text-[10px] font-bold text-slate-500 mt-1">{status}</div>
  </div>
);

export default FinanceTools;
