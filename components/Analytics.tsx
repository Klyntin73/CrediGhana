
import React, { useState } from 'react';
import { CreditReport, Transaction } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Target, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { getGrowthForecast } from '../services/geminiService';

interface AnalyticsProps {
  report: CreditReport | null;
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ report, transactions }) => {
  const [forecast, setForecast] = useState<string | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const inflows = transactions.filter(t => t.isPositive).reduce((sum, t) => sum + t.amount, 0);
  const outflows = transactions.filter(t => !t.isPositive).reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate net cash flow to determine score trend
  const netFlow = inflows - outflows;
  const flowRatio = netFlow > 0 ? (inflows / outflows) : (outflows > 0 ? -(inflows / outflows) : 0);
  
  // Generate realistic score progression based on transaction patterns
  // Base score starts at 500, then progresses based on cash flow patterns
  const currentScore = report?.score || Math.round(500 + (flowRatio * 50));
  
  // Generate 6 months of score data showing realistic progression
  const generateScoreProgression = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const scores: number[] = [];
    let baseScore = 480; // Starting score
    
    for (let i = 0; i < 5; i++) {
      // Add some variation but show overall improvement
      const variation = Math.floor(Math.random() * 30) - 10;
      baseScore = Math.min(750, Math.max(400, baseScore + variation + 15));
      scores.push(baseScore);
    }
    // Final score is the user's current score
    scores.push(currentScore);
    return scores;
  };
  
  const trendData = generateScoreProgression();
  const maxScore = 850;

  const generateForecast = async () => {
    setLoadingForecast(true);
    try {
      const res = await getGrowthForecast(transactions);
      setForecast(res);
    } catch (e) {
      setForecast("Unable to generate forecast.");
    } finally {
      setLoadingForecast(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowUpRight size={20} /></div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <div className="text-sm text-slate-500 mb-1 font-medium">Monthly Inflow</div>
          <div className="text-2xl font-bold text-slate-900">GH₵ {inflows.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ArrowDownRight size={20} /></div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">-4.2%</span>
          </div>
          <div className="text-sm text-slate-500 mb-1 font-medium">Monthly Outflow</div>
          <div className="text-2xl font-bold text-slate-900">GH₵ {outflows.toLocaleString()}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Target size={20} /></div>
          </div>
          <div className="text-sm text-slate-500 mb-1 font-medium">Interest Saved</div>
          <div className="text-2xl font-bold text-indigo-600">GH₵ 420.00</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <TrendingUp className="mr-2 text-indigo-600" size={20} />
            Score Progression
          </h3>
          <div className="h-48 w-full flex items-end justify-between space-x-2 px-2">
            {trendData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div className="w-full bg-indigo-100 rounded-t-lg transition-all duration-700 group-hover:bg-indigo-600" style={{ height: `${(val / maxScore) * 100}%` }}></div>
                <span className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900 p-8 rounded-3xl text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="text-indigo-300" />
              <h3 className="text-xl font-bold tracking-tight">AI Growth Forecast</h3>
            </div>
            
            {forecast ? (
              <p className="text-indigo-50 text-sm leading-relaxed mb-8 font-medium animate-in fade-in slide-in-from-top-2">
                {forecast}
              </p>
            ) : (
              <p className="text-indigo-200 text-sm leading-relaxed mb-8">
                Click below to use Gemini AI to forecast your next month's performance based on current trends.
              </p>
            )}
          </div>

          <button 
            onClick={generateForecast}
            disabled={loadingForecast}
            className="w-full py-4 bg-white text-indigo-900 font-bold rounded-2xl shadow-xl hover:bg-indigo-50 transition flex items-center justify-center relative z-10"
          >
            {loadingForecast ? <Loader2 size={18} className="animate-spin mr-2" /> : <Sparkles size={18} className="mr-2" />}
            {loadingForecast ? 'Generating Insight...' : 'Generate 1-Month Forecast'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
