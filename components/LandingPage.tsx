
import React from 'react';
import { ShieldCheck, Zap, TrendingUp, Users, ArrowRight, Smartphone, Building2, Star, CheckCircle2, PlayCircle, Heart } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              CG
            </div>
            <span className="text-xl font-bold tracking-tight">CrediGhana <span className="text-indigo-600">AI</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition">How it Works</a>
            <a href="#partners" className="hover:text-indigo-600 transition">Partners</a>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onLogin} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition">Log In</button>
            <button onClick={onGetStarted} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-wider">
              <Zap size={14} className="animate-pulse" />
              <span>Financial Inclusion for all Ghanaians</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.05]">
              Empowering <span className="text-indigo-600">Ghanaian Trade</span> with AI.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Your daily transactions are your greatest asset. CrediGhana AI analyzes your mobile money patterns to unlock the capital you need to scale your business.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={onGetStarted} className="px-8 py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-2xl transition-all flex items-center justify-center group active:scale-95">
                Apply for GH₵ 5,000 Now
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView()} className="px-8 py-5 bg-white text-slate-700 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition flex items-center justify-center">
                <PlayCircle size={18} className="mr-2 text-indigo-600" />
                See How it Works
              </button>
            </div>
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img 
                    key={i} 
                    className="w-10 h-10 rounded-full border-4 border-white bg-slate-100" 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=trader${i}`} 
                    alt="Trader avatar" 
                  />
                ))}
              </div>
              <div className="text-sm font-medium text-slate-500">
                <span className="text-slate-900 font-bold">12,500+</span> traders already verified
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-indigo-50 rounded-full opacity-40 blur-3xl"></div>
            <div className="relative z-10">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Ghanaian Market Trader" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-white/50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">LK</div>
                      <div className="text-xs font-bold text-slate-900">Loveland K. (Kyntin73 IT)</div>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Verified Merchant</div>
                  </div>
                  <div className="flex items-center justify-between text-slate-900 font-black text-xl">
                    <span>GH₵ 2,400</span>
                    <span className="text-emerald-500 flex items-center text-xs"><TrendingUp size={14} className="mr-1" />+15% Growth</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-indigo-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-black mb-1">GH₵ 50M+</div>
            <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Loans Disbursed</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black mb-1">98.4%</div>
            <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Repayment Rate</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black mb-1">5 MINS</div>
            <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Avg. Approval</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black mb-1">24/7</div>
            <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Support Access</div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Three Steps to Capital</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">We've removed the bureaucracy. Get started with just your phone number.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100 border border-slate-100 group-hover:-translate-y-2 transition-transform duration-300">
                <Smartphone size={32} />
              </div>
              <h3 className="text-xl font-bold">1. Connect your MoMo</h3>
              <p className="text-slate-500 leading-relaxed">Securely link your MTN, Vodafone, or AirtelTigo accounts. Our AI reads your transaction history instantly.</p>
            </div>
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100 border border-slate-100 group-hover:-translate-y-2 transition-transform duration-300">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold">2. AI Credit Scoring</h3>
              <p className="text-slate-500 leading-relaxed">Our advanced models evaluate your business consistency, utility payments, and trade patterns to generate a fair score.</p>
            </div>
            <div className="space-y-6 group">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-100 border border-slate-100 group-hover:-translate-y-2 transition-transform duration-300">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold">3. Instant Payout</h3>
              <p className="text-slate-500 leading-relaxed">Once approved, choose your loan amount and receive funds directly to your wallet. No paperwork required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features with Real-World Imagery */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000" 
                  alt="Small Business in Ghana" 
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-3xl font-bold">Built for Growth</h3>
              <p className="text-lg text-slate-500 leading-relaxed">
                Whether you are a wholesaler in Makola or a small kiosk owner in Osu, our platform scales with your ambition. We provide the analytics tools to help you understand your cashflow.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-700 font-semibold">
                  <CheckCircle2 className="text-indigo-600 mr-2" size={18} /> Daily Transaction Analytics
                </li>
                <li className="flex items-center text-slate-700 font-semibold">
                  <CheckCircle2 className="text-indigo-600 mr-2" size={18} /> Dynamic Interest Rates
                </li>
                <li className="flex items-center text-slate-700 font-semibold">
                  <CheckCircle2 className="text-indigo-600 mr-2" size={18} /> Business Health Checks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">What Our Traders Say</h2>
            <p className="text-indigo-300">Real stories from the heart of Ghanaian commerce.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              text="CrediGhana changed everything. I used to buy stock on high-interest credit from suppliers. Now I have my own capital."
              author="Serwaa Bonsu"
              business="Fabric Import, Kumasi"
            />
            <TestimonialCard 
              text="The AI score actually helps me manage my shop better. I can see when I'm spending too much on personal things."
              author="Yaw Appiah"
              business="Electronics, Circle"
            />
            <TestimonialCard 
              text="Fast approval! I applied at 8 AM and by 8:15 AM I had the money to pay for a new delivery of shea butter."
              author="Abena Mensah"
              business="Agro-Processing, Tamale"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Ready to Build Your Digital <span className="text-indigo-600">Financial Future?</span>
          </h2>
          <p className="text-lg text-slate-500">Join thousands of Ghanaian merchants securing their business with modern credit technology.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={onGetStarted} className="px-12 py-5 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:bg-indigo-700 transition active:scale-95">
              Apply Now
            </button>
            <button onClick={onLogin} className="px-12 py-5 bg-white text-slate-900 border-2 border-slate-200 font-bold rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition">
              Merchant Login
            </button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">Our Strategic Partners</p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
            <PartnerLogo icon={<Building2 />} name="Sinapi Aba" />
            <PartnerLogo icon={<ShieldCheck />} name="Advans" />
            <PartnerLogo icon={<Star />} name="GTBank" />
            <PartnerLogo icon={<Users />} name="MTN MoMo" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">CG</div>
              <span className="font-bold text-xl">CrediGhana AI</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              Empowering Ghana's informal economy through innovative credit scoring and inclusive financial technology. Licensed for sandbox operations.
            </p>
            <div className="flex space-x-4">
              <button className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition"><Smartphone size={20} /></button>
              <button className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition"><Heart size={20} /></button>
              <button className="p-2 bg-slate-100 rounded-lg hover:bg-indigo-600 hover:text-white transition"><Users size={20} /></button>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Press Kit</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Compliance</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li><a href="#" className="hover:text-indigo-600 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition">Merchant Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          <span>© 2024 CrediGhana AI. All rights reserved.</span>
          <span className="mt-4 md:mt-0">Built for the future of West African Trade.</span>
        </div>
      </footer>
    </div>
  );
};

const TestimonialCard = ({ text, author, business }: { text: string, author: string, business: string }) => (
  <div className="bg-slate-800 p-8 rounded-[2rem] text-left space-y-6 hover:bg-indigo-900 transition-colors duration-300">
    <div className="flex text-amber-400">
      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
    </div>
    <p className="text-slate-300 leading-relaxed italic">"{text}"</p>
    <div className="flex items-center space-x-3 border-t border-slate-700 pt-6">
      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold">{author.charAt(0)}</div>
      <div>
        <div className="font-bold">{author}</div>
        <div className="text-xs text-indigo-400 font-bold">{business}</div>
      </div>
    </div>
  </div>
);

const PartnerLogo = ({ icon, name }: { icon: React.ReactNode, name: string }) => (
  <div className="flex items-center space-x-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-default group">
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-xl font-bold tracking-tight">{name}</span>
  </div>
);

export default LandingPage;
