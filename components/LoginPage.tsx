
import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ChevronLeft, 
  ShieldCheck, 
  User, 
  Store, 
  CheckCircle2, 
  CreditCard,
  MessageSquareText,
  RefreshCcw
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  initialMode?: 'login' | 'signup';
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [stage, setStage] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [otpValue, setOtpValue] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);

  // Form States
  const [form, setForm] = useState({
    name: '',
    businessType: '',
    phone: '',
    pin: '',
    ghanaCard: ''
  });

  useEffect(() => {
    let interval: any;
    if (stage === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, resendTimer]);

  const validate = () => {
    if (mode === 'signup') {
      if (form.name.trim().length < 3) return 'Full Name must be at least 3 characters.';
      if (!form.businessType) return 'Please select your business type.';
      if (!/^GHA-\d{9}-\d$/.test(form.ghanaCard)) return 'Invalid Ghana Card format. Expected: GHA-700000000-0';
    }
    if (!/^0\d{9}$/.test(form.phone)) return 'Phone must be 10 digits starting with 0.';
    if (!/^\d{4}$/.test(form.pin)) return 'PIN must be exactly 4 numeric digits.';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setStage('otp');
      setResendTimer(30);
    }, 1500);
  };

  // Simulate sending credentials via SMS
  const sendCredentialsSms = (phone: string, pin: string) => {
    console.log(`[SMS] To: ${phone} - Welcome! Your CrediGhana PIN is: ${pin}`);
  };

  // Simulate sending credentials via Email
  const sendCredentialsEmail = (name: string, email: string, pin: string) => {
    console.log(`[EMAIL] To: ${email} - Welcome ${name}! Your CrediGhana PIN is: ${pin}`);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValue.join('');
    if (fullOtp.length < 4) {
      setError('Please enter the complete 4-digit code.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate OTP Verification + Final Bureau Check
    setTimeout(() => {
      setLoading(false);
      if (mode === 'signup') {
        // Generate a PIN for the new user
        const userPin = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Send credentials via SMS and Email
        sendCredentialsSms(form.phone, userPin);
        sendCredentialsEmail(form.name, form.ghanaCard.replace('GHA-', '') + '@example.com', userPin);
        
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess();
        }, 2500);
      } else {
        onLoginSuccess();
      }
    }, 2000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValue];
    newOtp[index] = value.slice(-1);
    setOtpValue(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setError('');
    // Simulate resending
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-12 text-center space-y-6 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Identity Verified!</h2>
          <p className="text-slate-500">Bureau check complete. Your Ghana Card <span className="font-bold text-indigo-600">{form.ghanaCard}</span> is valid. Welcome, {form.name.split(' ')[0]}.</p>
          <div className="flex justify-center items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
            <Loader2 className="animate-spin" size={16} />
            <span>Opening Financial Vault...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        <button 
          onClick={stage === 'form' ? onBack : () => setStage('form')}
          className="group flex items-center text-slate-400 hover:text-indigo-600 font-bold text-sm transition"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform mr-1" />
          {stage === 'form' ? 'Back to Home' : 'Back to Details'}
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm relative z-10">
              {stage === 'form' ? <ShieldCheck size={32} /> : <MessageSquareText size={32} />}
            </div>
            <h2 className="text-2xl font-bold relative z-10">
              {stage === 'form' 
                ? (mode === 'login' ? 'Merchant Login' : 'Bureau Enrollment') 
                : 'Security Check'}
            </h2>
            <p className="text-indigo-100 text-sm mt-1 relative z-10">
              {stage === 'form'
                ? (mode === 'login' ? 'Secure Biometric Access' : 'Linked to NIA & Financial Bureaus')
                : `We sent a code to ${form.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')}`}
            </p>
          </div>

          {stage === 'form' ? (
            <>
              {/* Mode Switcher */}
              <div className="flex p-1 bg-slate-100 m-6 rounded-2xl">
                <button 
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  LOG IN
                </button>
                <button 
                  onClick={() => { setMode('signup'); setError(''); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  SIGN UP
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-start animate-in shake duration-300">
                    <span className="mr-2 mt-0.5">⚠️</span> 
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {mode === 'signup' && (
                    <>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition" size={18} />
                        <input 
                          type="text" 
                          placeholder="Full Name (As on Ghana Card)" 
                          value={form.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none text-sm font-medium"
                        />
                      </div>

                      <div className="relative group">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition" size={18} />
                        <input 
                          type="text" 
                          placeholder="Ghana Card (GHA-XXXXXXXXX-X)" 
                          value={form.ghanaCard}
                          onChange={(e) => handleInputChange('ghanaCard', e.target.value.toUpperCase())}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none text-sm font-medium"
                        />
                      </div>

                      <div className="relative group">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition" size={18} />
                        <select 
                          value={form.businessType}
                          onChange={(e) => handleInputChange('businessType', e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none text-sm font-medium appearance-none"
                        >
                          <option value="" disabled>Select Business Type</option>
                          <option value="Retail">Retail Merchant</option>
                          <option value="Food">Food / Catering</option>
                          <option value="Textile">Textile Trading</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Agriculture">Agriculture / Farming</option>
                          <option value="Service">Service Provider</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition" size={18} />
                    <input 
                      type="tel" 
                      placeholder="Phone Number (Registered with Card)" 
                      value={form.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none text-sm font-medium"
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition" size={18} />
                    <input 
                      type="password" 
                      inputMode="numeric"
                      placeholder="Vault PIN (4 digits)" 
                      value={form.pin}
                      onChange={(e) => handleInputChange('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition flex items-center justify-center active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      <span>Requesting OTP...</span>
                    </div>
                  ) : (
                    <>
                      {mode === 'login' ? 'Send OTP & Login' : 'Enroll & Send OTP'}
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* OTP STAGE */
            <form onSubmit={handleOtpVerify} className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold flex items-start animate-in shake duration-300">
                  <span className="mr-2 mt-0.5">⚠️</span> 
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                {otpValue.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    className="w-14 h-16 text-center text-2xl font-black bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white outline-none transition-all"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition flex items-center justify-center active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <>
                      Verify & Proceed
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button 
                    type="button"
                    disabled={resendTimer > 0 || loading}
                    onClick={handleResend}
                    className="flex items-center justify-center mx-auto text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:text-slate-400 transition"
                  >
                    <RefreshCcw size={14} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
                    {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend OTP Code'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="text-center space-y-4">
          <p className="text-xs text-slate-400 font-medium leading-relaxed px-6">
            CrediGhana uses encrypted SMS gateways for secure two-factor authentication.<br />
            Carriers: MTN, Vodafone, AirtelTigo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
