
import React from 'react';
import { CreditReport } from '../types';
import { Building2, CheckCircle2, Star, ExternalLink, ShieldCheck } from 'lucide-react';

interface PartnerBanksProps {
  report: CreditReport | null;
}

const PARTNERS = [
  { 
    name: "Sinapi Aba Trust", 
    type: "Microfinance", 
    minGrade: "C", 
    maxLoan: "GH₵ 15,000",
    description: "Specialized in market trader support and inventory loans."
  },
  { 
    name: "Advans Ghana", 
    type: "Savings & Loans", 
    minGrade: "B", 
    maxLoan: "GH₵ 50,000",
    description: "Fast digital disbursement for established SMEs."
  },
  { 
    name: "Opportunity Int.", 
    type: "Microfinance", 
    minGrade: "D", 
    maxLoan: "GH₵ 5,000",
    description: "Inclusive lending for start-up traders and farmers."
  },
  { 
    name: "GTBank Ghana", 
    type: "Commercial Bank", 
    minGrade: "A", 
    maxLoan: "GH₵ 250,000",
    description: "Premium banking for high-scoring digital entrepreneurs."
  }
];

const PartnerBanks: React.FC<PartnerBanksProps> = ({ report }) => {
  const currentGrade = report?.grade || 'C';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Pre-Qualified Partners</h2>
          <p className="text-slate-500 max-w-md">Based on your Grade {currentGrade} credit profile, these institutions are ready to support your business expansion.</p>
        </div>
        <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center">
          <ShieldCheck className="mr-2" size={20} />
          Certified Identity
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PARTNERS.map((partner, i) => {
          const isEligible = currentGrade <= partner.minGrade; // Grades A < B < C etc
          return (
            <div key={i} className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl ${isEligible ? 'bg-white border-slate-100' : 'bg-slate-50/50 border-slate-200 opacity-75'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
                  <Building2 size={24} />
                </div>
                {isEligible ? (
                  <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                    <CheckCircle2 size={12} className="mr-1" /> Qualified
                  </div>
                ) : (
                  <div className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-xs font-bold">
                    Need Grade {partner.minGrade}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{partner.name}</h3>
              <p className="text-xs text-indigo-600 font-bold mb-3 uppercase tracking-wider">{partner.type}</p>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">{partner.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Max Financing</div>
                  <div className="text-base font-bold text-slate-900">{partner.maxLoan}</div>
                </div>
                <button className={`p-3 rounded-xl transition-colors ${isEligible ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PartnerBanks;
