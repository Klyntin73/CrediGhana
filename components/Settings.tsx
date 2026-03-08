
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  User, 
  Shield, 
  Bell, 
  Database, 
  Lock, 
  Smartphone, 
  ChevronRight, 
  ArrowUpRight, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

// Fix: Make children optional in the type definition to resolve TS missing children error in JSX
const Modal = ({ title, onClose, children }: { title: string, onClose: () => void, children?: React.ReactNode }) => (
  <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// Fix: Define sub-components before they are used to ensure proper type inference
const SettingsItem = ({ 
  icon, 
  label, 
  value, 
  isToggle = false, 
  active = false, 
  onToggle,
  onClick
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  isToggle?: boolean,
  active?: boolean,
  onToggle?: () => void,
  onClick?: () => void
}) => (
  <div 
    onClick={() => !isToggle && onClick?.()}
    className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group"
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      {isToggle ? (
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
          className={`w-10 h-6 rounded-full relative p-1 transition-colors ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
        >
          <div className={`absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'left-5' : 'left-1'}`}></div>
        </button>
      ) : (
        <>
          <span className="text-xs font-bold text-slate-400">{value}</span>
          <ChevronRight size={16} className="text-slate-300" />
        </>
      )}
    </div>
  </div>
);

// Fix: Define sub-components before they are used
const PermissionItem = ({ label, desc, active, onToggle }: { label: string, desc: string, active: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="space-y-0.5">
      <div className="text-sm font-bold text-slate-800">{label}</div>
      <div className="text-[10px] text-slate-500 font-medium">{desc}</div>
    </div>
    <button 
      onClick={onToggle}
      className={`w-10 h-6 rounded-full relative p-1 transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}
    >
      <div className={`absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'left-5' : 'left-1'}`}></div>
    </button>
  </div>
);

interface SettingsProps {
  user: UserProfile;
  onLogout: () => void;
  onUserUpdate: (u: UserProfile) => void;
  onNotification: (title: string, message: string, type: 'info' | 'success' | 'warning') => void;
  remindersEnabled: boolean;
  scoreAlertsEnabled: boolean;
  setRemindersEnabled: (v: boolean) => void;
  setScoreAlertsEnabled: (v: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  user, 
  onLogout, 
  onUserUpdate,
  onNotification,
  remindersEnabled, 
  scoreAlertsEnabled, 
  setRemindersEnabled, 
  setScoreAlertsEnabled 
}) => {
  const [activeModal, setActiveModal] = useState<'info' | 'momo' | 'data' | 'pin' | null>(null);
  
  // Temporary form states
  const [editName, setEditName] = useState(user.name);
  const [editBusiness, setEditBusiness] = useState(user.businessType);
  const [newMomo, setNewMomo] = useState('');
  const [pinCurrent, setPinCurrent] = useState('');
  const [pinNew, setPinNew] = useState('');

  const saveInfo = () => {
    onUserUpdate({ ...user, name: editName, businessType: editBusiness });
    setActiveModal(null);
    onNotification("Profile Updated", "Your business identity has been synchronized with the bureau.", "success");
  };

  const addMomo = () => {
    if (!/^0\d{9}$/.test(newMomo)) {
      onNotification("Invalid Number", "Please enter a valid 10-digit Ghanaian mobile number.", "warning");
      return;
    }
    const current = user.momoAccounts || [];
    onUserUpdate({ ...user, momoAccounts: [...current, newMomo] });
    setNewMomo('');
    onNotification("MoMo Linked", `Number ${newMomo} successfully linked to your digital score.`, "success");
  };

  const removeMomo = (num: string) => {
    const current = user.momoAccounts || [];
    onUserUpdate({ ...user, momoAccounts: current.filter(n => n !== num) });
    onNotification("Number Removed", "This wallet will no longer contribute to your credit scoring.", "info");
  };

  const updatePin = () => {
    if (pinNew.length !== 4) {
      onNotification("Invalid PIN", "PIN must be exactly 4 digits.", "warning");
      return;
    }
    setActiveModal(null);
    setPinCurrent('');
    setPinNew('');
    onNotification("PIN Updated", "Your digital signature PIN has been reset.", "success");
  };

  const togglePermission = (key: keyof NonNullable<UserProfile['dataPermissions']>) => {
    const perms = user.dataPermissions || { momo: true, nia: true, bureau: false };
    onUserUpdate({
      ...user,
      dataPermissions: { ...perms, [key]: !perms[key] }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
      
      {/* Profile Section */}
      <section className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex items-center space-x-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.businessType}</p>
          </div>
        </div>
        <div className="p-2">
          <SettingsItem 
            icon={<User size={18} />} 
            label="Personal Information" 
            value="Edit Profile" 
            onClick={() => setActiveModal('info')}
          />
          <SettingsItem 
            icon={<Smartphone size={18} />} 
            label="Linked MoMo Numbers" 
            value={`${user.momoAccounts?.length || 0} Accounts`} 
            onClick={() => setActiveModal('momo')}
          />
        </div>
      </section>

      {/* Security & Data */}
      <section className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Security & Trust</h3>
        </div>
        <div className="p-2">
          <SettingsItem icon={<Shield size={18} />} label="Biometric Authentication" value="Enabled" isToggle active={true} />
          <SettingsItem 
            icon={<Database size={18} />} 
            label="Data Sharing Permissions" 
            value="Manage Sources" 
            onClick={() => setActiveModal('data')}
          />
          <SettingsItem 
            icon={<Lock size={18} />} 
            label="Digital Signature PIN" 
            value="Update" 
            onClick={() => setActiveModal('pin')}
          />
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Notifications</h3>
        </div>
        <div className="p-2">
          <SettingsItem 
            icon={<Bell size={18} />} 
            label="Loan Repayment Reminders" 
            value={remindersEnabled ? "Active" : "Disabled"} 
            isToggle 
            active={remindersEnabled}
            onToggle={() => setRemindersEnabled(!remindersEnabled)}
          />
          <SettingsItem 
            icon={<ArrowUpRight size={18} />} 
            label="Credit Score Alerts" 
            value={scoreAlertsEnabled ? "Active" : "Disabled"} 
            isToggle 
            active={scoreAlertsEnabled}
            onToggle={() => setScoreAlertsEnabled(!scoreAlertsEnabled)}
          />
        </div>
      </section>
      
      <div className="text-center">
        <button 
          onClick={onLogout}
          className="text-rose-600 font-bold text-sm px-6 py-3 rounded-2xl hover:bg-rose-50 transition-colors"
        >
          Log Out of Digital Vault
        </button>
      </div>

      {/* Modals */}
      {activeModal === 'info' && (
        <Modal title="Personal Information" onClose={() => { setActiveModal(null); }}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Display Name</label>
              <input 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Business Category</label>
              <input 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                value={editBusiness}
                onChange={e => setEditBusiness(e.target.value)}
              />
            </div>
            <button 
              onClick={saveInfo}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
            >
              Save Profile Changes
            </button>
          </div>
        </Modal>
      )}

      {activeModal === 'momo' && (
        <Modal title="Linked MoMo Wallets" onClose={() => { setActiveModal(null); }}>
          <div className="space-y-6">
            <div className="space-y-3">
              {user.momoAccounts?.map(acc => (
                <div key={acc} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-3 font-bold text-slate-800">
                    <Smartphone size={16} className="text-indigo-600" />
                    <span>{acc}</span>
                  </div>
                  <button onClick={() => removeMomo(acc)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Add New Wallet</label>
              <div className="flex space-x-2">
                <input 
                  placeholder="e.g. 0244123456"
                  className="flex-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold" 
                  value={newMomo}
                  onChange={e => setNewMomo(e.target.value.replace(/\D/g, ''))}
                />
                <button 
                  onClick={addMomo}
                  className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition"
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'data' && (
        <Modal title="Data Access Rights" onClose={() => { setActiveModal(null); }}>
          <div className="space-y-4">
            <PermissionItem 
              label="Mobile Money History" 
              desc="Required for alternative credit scoring." 
              active={user.dataPermissions?.momo || false} 
              onToggle={() => togglePermission('momo')} 
            />
            <PermissionItem 
              label="NIA Identity Check" 
              desc="Syncs name and age with Ghana Card." 
              active={user.dataPermissions?.nia || false} 
              onToggle={() => togglePermission('nia')} 
            />
            <PermissionItem 
              label="Central Bureau Access" 
              desc="Pulls data from legacy credit systems." 
              active={user.dataPermissions?.bureau || false} 
              onToggle={() => togglePermission('bureau')} 
            />
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3 mt-4">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 leading-tight font-medium">Revoking access to primary data sources may result in an immediate decrease of your Credit Grade.</p>
            </div>
          </div>
        </Modal>
      )}

      {activeModal === 'pin' && (
        <Modal title="Update Digital PIN" onClose={() => { setActiveModal(null); }}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Current PIN</label>
              <input 
                type="password" 
                maxLength={4}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black tracking-widest text-center" 
                value={pinCurrent}
                onChange={e => setPinCurrent(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">New 4-Digit PIN</label>
              <input 
                type="password" 
                maxLength={4}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black tracking-widest text-center" 
                value={pinNew}
                onChange={e => setPinNew(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button 
              onClick={updatePin}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition mt-4"
            >
              Securely Update PIN
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Settings;
