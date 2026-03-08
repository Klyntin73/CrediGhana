
import React, { useState, useEffect } from 'react';
import { Lock, Smartphone, X, Shield, AlertCircle, Loader2, Mail } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLogin: (phone: string, pin: string) => void;
  error: string;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLogin, error }) => {
  const [stage, setStage] = useState<'credentials' | 'otp'>('credentials');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, resendTimer]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !pin) return;
    
    setLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setStage('otp');
      setResendTimer(30);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`admin-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) return;
    
    setLoading(true);
    
    // Verify OTP and login
    setTimeout(() => {
      setLoading(false);
      onLogin(phone, pin);
    }, 1000);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setLoading(true);
    
    // Simulate resending OTP
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    setStage('credentials');
    setOtp(['', '', '', '']);
    setOtpSent(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-amber-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {stage === 'credentials' ? 'Admin Access' : 'Verify Identity'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {stage === 'credentials' 
              ? 'Enter your admin credentials to access the dashboard' 
              : `We sent a verification code to ${phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')}`}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-start animate-in shake duration-300">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {stage === 'credentials' ? (
          /* Credentials Form */
          <form onSubmit={handleCredentialsSubmit} className="space-y-5">
            <div className="relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition" size={18} />
              <input 
                type="tel" 
                placeholder="Admin Phone Number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition outline-none text-sm font-medium"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition" size={18} />
              <input 
                type="password" 
                inputMode="numeric"
                placeholder="Admin PIN (4 digits)" 
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition outline-none text-sm font-medium"
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !phone || !pin}
              className="w-full py-4 bg-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-100 hover:bg-amber-600 transition flex items-center justify-center active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Shield size={18} className="mr-2" />
                  Verify & Continue
                </>
              )}
            </button>
          </form>
        ) : (
          /* OTP Form */
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex justify-center space-x-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`admin-otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && i > 0) {
                      document.getElementById(`admin-otp-${i - 1}`)?.focus();
                    }
                  }}
                  className="w-14 h-16 text-center text-2xl font-black bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 focus:bg-white outline-none transition-all"
                />
              ))}
            </div>

            <button 
              type="submit"
              disabled={loading || otp.join('').length < 4}
              className="w-full py-4 bg-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-100 hover:bg-amber-600 transition flex items-center justify-center active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield size={18} className="mr-2" />
                  Verify & Login
                </>
              )}
            </button>

            <div className="text-center">
              <button 
                type="button"
                disabled={resendTimer > 0 || loading}
                onClick={handleResend}
                className="text-sm font-bold text-amber-600 hover:text-amber-800 disabled:text-slate-400 transition"
              >
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>

            <button 
              type="button"
              onClick={handleBack}
              className="w-full py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition"
            >
              ← Back to credentials
            </button>
          </form>
        )}

        {/* Security Note */}
        <p className="text-xs text-slate-400 text-center mt-6">
          This area is restricted to authorized administrators only.<br />
          Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginModal;

