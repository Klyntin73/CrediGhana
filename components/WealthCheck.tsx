
import React, { useState, useEffect } from 'react';
import { Transaction, WealthProfile } from '../types';
import { performWealthCheck } from '../services/geminiService';
import { jsPDF } from 'jspdf';
import { 
  Trophy, 
  Crown, 
  Sprout, 
  Leaf, 
  Wheat, 
  ArrowUp, 
  Zap, 
  ShieldCheck, 
  Gem, 
  Loader2,
  RefreshCw,
  Info,
  Download
} from 'lucide-react';

interface WealthCheckProps {
  transactions: Transaction[];
  susuBalance: number;
}

const WealthCheck: React.FC<WealthCheckProps> = ({ transactions, susuBalance }) => {
  const [profile, setProfile] = useState<WealthProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const runCheck = async () => {
    setLoading(true);
    try {
      const data = await performWealthCheck(transactions, susuBalance);
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!profile) return;
    
    setDownloading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(245, 158, 11); // Amber
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('PROSPERITY STRATEGY REPORT', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('CrediGhana AI - Wealth Assessment', pageWidth / 2, 35, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(30, 41, 59);
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, 20, 55);
      
      // Wealth Tier Section
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.text('Your Wealth Tier', 20, 70);
      
      doc.setFontSize(32);
      doc.setTextColor(245, 158, 11); // Amber color
      doc.text(profile.tier.toUpperCase(), 20, 85);
      
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(`Estate Score: ${profile.wealthScore}/100`, 20, 95);
      
      // Pillar Scores Section
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Wealth Pillars Breakdown', 20, 115);
      
      const pillars = [
        { name: 'Resilience Buffer', value: profile.pillars.resilience, desc: 'Ability to survive market shocks using Susu liquidity.' },
        { name: 'Capital Efficiency', value: profile.pillars.efficiency, desc: 'How effectively your loans convert to business equity.' },
        { name: 'Transaction Velocity', value: profile.pillars.consistency, desc: 'Frequency and stability of your daily MoMo inflows.' },
        { name: 'Digital Sovereignty', value: profile.pillars.identity, desc: 'Strength of your verified identity across Ghana\'s bureaus.' }
      ];
      
      let yPos = 130;
      pillars.forEach((pillar) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(pillar.name, 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`${pillar.value}%`, 100, yPos);
        
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(pillar.desc, 20, yPos + 6);
        
        // Progress bar background
        doc.setFillColor(226, 232, 240);
        doc.roundedRect(20, yPos + 10, 100, 6, 1, 1, 'F');
        
        // Progress bar fill
        const fillColor = pillar.value >= 75 ? [16, 185, 129] : pillar.value >= 50 ? [245, 158, 11] : [239, 68, 68];
        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
        doc.roundedRect(20, yPos + 10, pillar.value, 6, 1, 1, 'F');
        
        yPos += 28;
      });
      
      // AI Recommendation Section
      yPos += 10;
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Wealth Strategy', 20, yPos);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      
      const recommendationLines = doc.splitTextToSize(profile.recommendation, 170);
      doc.text(recommendationLines, 20, yPos + 12);
      
      // Actionable Tips Section
      yPos += 40 + (recommendationLines.length * 5);
      
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.text('Action Plan to Advance Your Tier', 20, yPos);
      
      const tips = getActionTips(profile);
      yPos += 15;
      
      tips.forEach((tip, index) => {
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}.`, 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        const tipLines = doc.splitTextToSize(tip, 165);
        doc.text(tipLines, 28, yPos);
        
        yPos += tipLines.length * 5 + 3;
      });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('This report is generated by CrediGhana AI and is for informational purposes only.', pageWidth / 2, 285, { align: 'center' });
      doc.text('Consult with a financial advisor for personalized advice.', pageWidth / 2, 290, { align: 'center' });
      
      // Save the PDF
      doc.save(`Prosperity_Strategy_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error('Failed to generate PDF:', e);
    } finally {
      setDownloading(false);
    }
  };

  // Helper function to generate action tips based on pillar scores
  const getActionTips = (profile: WealthProfile): string[] => {
    const tips: string[] = [];
    
    if (profile.pillars.resilience < 50) {
      tips.push('Build your Susu savings buffer - aim to save at least 20% of monthly inflows for market shocks.');
    } else if (profile.pillars.resilience < 75) {
      tips.push('Increase your emergency fund to cover 3-6 months of business expenses for greater resilience.');
    }
    
    if (profile.pillars.consistency < 50) {
      tips.push('Maintain regular business hours to establish consistent daily MoMo inflow patterns.');
    } else if (profile.pillars.consistency < 75) {
      tips.push('Diversify income sources to stabilize cash flow during slow seasons.');
    }
    
    if (profile.pillars.efficiency < 50) {
      tips.push('Review business expenses and cut unnecessary costs to improve profit margins.');
    } else if (profile.pillars.efficiency < 75) {
      tips.push('Reinvest profits into inventory or equipment to increase capital efficiency.');
    }
    
    if (profile.pillars.identity < 50) {
      tips.push('Complete your GhanaCard verification to unlock higher credit limits and trust benefits.');
    } else if (profile.pillars.identity < 75) {
      tips.push('Register your business with Registrar General to strengthen your digital financial footprint.');
    }
    
    if (profile.wealthScore >= 75) {
      tips.push('Consider applying for Virtual Cards for international trade and expand globally.');
      tips.push('Explore BNPL options for inventory expansion to scale your business.');
    }
    
    // Always add at least one general tip
    if (tips.length < 3) {
      tips.push('Continue tracking transactions regularly to improve your wealth assessment accuracy.');
    }
    
    return tips.slice(0, 5); // Return max 5 tips
  };

  useEffect(() => {
    runCheck();
  }, [transactions, susuBalance]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Kingdom': return <Crown size={48} className="text-amber-500" />;
      case 'Harvest': return <Wheat size={48} className="text-amber-400" />;
      case 'Flourishing': return <Leaf size={48} className="text-emerald-500" />;
      case 'Sprouter': return <Sprout size={48} className="text-emerald-400" />;
      default: return <Sprout size={48} className="text-slate-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Kingdom': return 'from-amber-400 to-amber-600';
      case 'Harvest': return 'from-amber-200 to-amber-500';
      case 'Flourishing': return 'from-emerald-400 to-emerald-600';
      case 'Sprouter': return 'from-indigo-400 to-indigo-600';
      default: return 'from-slate-400 to-slate-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center">
            <Gem className="mr-3 text-amber-500" />
            Wealth Assessment
          </h2>
          <p className="text-slate-500 font-medium">Measuring your business resilience and generational prosperity.</p>
        </div>
        <button 
          onClick={runCheck}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          <span>Recalculate Wealth Tier</span>
        </button>
      </div>

      {!profile && loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 size={48} className="text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">Aggregating Global Assets & Local Resilience...</p>
        </div>
      ) : profile ? (
        <div className="space-y-8">
          {/* Hero Tier Card */}
          <div className={`relative overflow-hidden rounded-[3rem] p-10 text-white bg-gradient-to-br ${getTierColor(profile.tier)} shadow-2xl`}>
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Trophy size={200} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                {getTierIcon(profile.tier)}
              </div>
              <div className="text-center md:text-left space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Current Wealth Estate</div>
                <h3 className="text-5xl font-black tracking-tighter">{profile.tier} Tier</h3>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-sm">
                    Estate Score: {profile.wealthScore}/100
                  </div>
                  <div className="flex items-center text-xs font-bold text-amber-200">
                    <ArrowUp size={14} className="mr-1" />
                    +4 pts this month
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PillarCard 
              icon={<ShieldCheck className="text-indigo-600" />} 
              label="Resilience Buffer" 
              value={profile.pillars.resilience} 
              desc="Ability to survive market shocks using Susu liquidity."
            />
            <PillarCard 
              icon={<Zap className="text-amber-500" />} 
              label="Capital Efficiency" 
              value={profile.pillars.efficiency} 
              desc="How effectively your loans convert to business equity."
            />
            <PillarCard 
              icon={<RefreshCw className="text-emerald-500" />} 
              label="Transaction Velocity" 
              value={profile.pillars.consistency} 
              desc="Frequency and stability of your daily MoMo inflows."
            />
            <PillarCard 
              icon={<Crown size={20} className="text-indigo-400" />} 
              label="Digital Sovereignity" 
              value={profile.pillars.identity} 
              desc="Strength of your verified identity across Ghana's bureaus."
            />
          </div>

          {/* AI Recommendation */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start space-x-6 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
              <Info size={28} />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-slate-900">Wealth Path Insight</h4>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {profile.recommendation}
              </p>
              <button 
                onClick={downloadReport}
                disabled={downloading || !profile}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition pt-2 flex items-center disabled:opacity-50"
              >
                {downloading ? <Loader2 size={12} className="mr-1 animate-spin" /> : <Download size={12} className="mr-1" />}
                Download Prosperity Strategy Report
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const PillarCard = ({ icon, label, value, desc }: { icon: React.ReactNode, label: string, value: number, desc: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4 hover:border-indigo-100 transition">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
        <span className="font-bold text-slate-800 text-sm">{label}</span>
      </div>
      <span className="text-lg font-black text-slate-900">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
      <div 
        className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
        style={{ width: `${value}%` }} 
      />
    </div>
    <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">{desc}</p>
  </div>
);

export default WealthCheck;
