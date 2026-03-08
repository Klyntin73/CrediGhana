
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, CreditReport, AdvisorMessage, WealthProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Type for wealth tier
type WealthTier = 'Seedling' | 'Sprouter' | 'Flourishing' | 'Harvest' | 'Kingdom';

export const analyzeCreditScore = async (
  transactions: Transaction[],
  userProfile: any
): Promise<CreditReport> => {
  const prompt = `
    Analyze the following financial transaction history for a user in Ghana and determine their alternative credit score (300-850).
    
    User Profile:
    - Name: ${userProfile.name}
    - Location: ${userProfile.location}
    - Business: ${userProfile.businessType}
    - Verification Status: ${userProfile.isVerified ? 'Verified/Registered' : 'Informal/Not Registered'}

    Transactions:
    ${JSON.stringify(transactions, null, 2)}

    Consider:
    1. Consistency of Mobile Money (MoMo) inflows.
    2. Punctuality of utility payments.
    3. Business growth/Inventory turnover patterns.
    4. Previous loan repayment behavior.
    5. Registration status (Verified business usually yields higher trust).
    6. Participation in Susu savings and use of trade-specific tools.

    Return a JSON response with:
    - score: number (300-850)
    - grade: string (A-F)
    - riskLevel: string (Low, Medium, High)
    - explanation: string (A concise summary of why this score was given)
    - keyFactors: Array of { factor, impact, description }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          grade: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          explanation: { type: Type.STRING },
          keyFactors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                factor: { type: Type.STRING },
                impact: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ['factor', 'impact', 'description'],
            },
          },
        },
        required: ['score', 'grade', 'riskLevel', 'explanation', 'keyFactors'],
      },
    },
  });

  try {
    return JSON.parse(response.text.trim()) as CreditReport;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return {
      score: 550,
      grade: 'C',
      riskLevel: 'Medium',
      explanation: 'Unable to analyze credit profile accurately at this time.',
      keyFactors: []
    };
  }
};

export const performWealthCheck = async (
  transactions: Transaction[],
  susuBalance: number
): Promise<WealthProfile> => {
  // Check if API key is available
  const apiKey = process.env.API_KEY;
  
  // Calculate metrics from transactions for fallback
  const totalInflow = transactions.filter(t => t.isPositive).reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = transactions.filter(t => !t.isPositive).reduce((sum, t) => sum + t.amount, 0);
  const netFlow = totalInflow - totalOutflow;
  const savingsRatio = susuBalance / (totalOutflow + 1);
  const transactionCount = transactions.length;
  const avgTransaction = totalInflow / (transactionCount || 1);
  
  // Calculate pillar scores based on transaction patterns
  const resilience = Math.min(100, Math.round(savingsRatio * 20 + (netFlow > 0 ? 20 : 0)));
  const consistency = Math.min(100, Math.round(Math.min(transactionCount * 10, 80) + (avgTransaction > 500 ? 20 : 0)));
  const efficiency = netFlow > 0 ? Math.min(100, Math.round(50 + (netFlow / totalOutflow) * 30)) : Math.max(20, 50 - Math.abs(netFlow / totalOutflow) * 30);
  const identity = 45; // Default based on having MoMo accounts
  
  // Calculate overall wealth score
  const wealthScore = Math.round((resilience + consistency + efficiency + identity) / 4);
  
  // Determine tier based on wealth score using proper typing
  let tier: WealthTier;
  if (wealthScore >= 90) tier = 'Kingdom';
  else if (wealthScore >= 75) tier = 'Harvest';
  else if (wealthScore >= 50) tier = 'Flourishing';
  else if (wealthScore >= 30) tier = 'Sprouter';
  else tier = 'Seedling';
  
  // Generate personalized recommendation
  let recommendation = '';
  if (resilience < 40) {
    recommendation = "Focus on building your Susu savings buffer. Aim to save at least 20% of your monthly inflows to create a resilience fund for market shocks.";
  } else if (consistency < 50) {
    recommendation = "Increase your transaction frequency and maintain regular business hours. Consistent daily inflows improve your wealth tier.";
  } else if (efficiency < 50) {
    recommendation = "Review your business expenses and reduce unnecessary costs. Focus on reinvesting profits rather than immediate withdrawals.";
  } else if (wealthScore >= 75) {
    recommendation = "Excellent progress! Consider expanding your digital footprint with Virtual Cards for international trade and diversify your income sources.";
  } else {
    recommendation = "You're on the right track! Continue maintaining positive cash flow and increasing your Susu contributions to build long-term wealth.";
  }

  // Return mock data if no API key
  if (!apiKey) {
    return {
      wealthScore,
      tier,
      pillars: { 
        resilience: Math.max(10, resilience), 
        consistency: Math.max(10, consistency), 
        efficiency: Math.max(10, efficiency), 
        identity 
      },
      recommendation
    };
  }

  const prompt = `
    Evaluate the "Financial Wealth" of a Ghanaian merchant based on their MoMo transactions and Susu savings.
    Wealth is not just credit; it's resilience, equity, and consistency.

    Susu Balance: GH₵ ${susuBalance}
    Transactions: ${JSON.stringify(transactions)}

    Assess across 4 pillars (0-100):
    1. Resilience: Ability to survive market shocks (Savings vs Outflows).
    2. Consistency: Regularity of business income over time.
    3. Efficiency: Profit-making potential vs operational costs.
    4. Identity: Strength of their digital financial footprint.

    Tiers: Seedling (<30), Sprouter (30-50), Flourishing (50-75), Harvest (75-90), Kingdom (>90).

    Return JSON:
    - wealthScore: number (0-100)
    - tier: string (one of the tiers above)
    - pillars: { resilience: number, consistency: number, efficiency: number, identity: number }
    - recommendation: string (Practical advice to move to the next wealth tier)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wealthScore: { type: Type.NUMBER },
            tier: { type: Type.STRING },
            pillars: {
              type: Type.OBJECT,
              properties: {
                resilience: { type: Type.NUMBER },
                consistency: { type: Type.NUMBER },
                efficiency: { type: Type.NUMBER },
                identity: { type: Type.NUMBER }
              },
              required: ['resilience', 'consistency', 'efficiency', 'identity']
            },
            recommendation: { type: Type.STRING }
          },
          required: ['wealthScore', 'tier', 'pillars', 'recommendation']
        }
      }
    });

    return JSON.parse(response.text.trim()) as WealthProfile;
  } catch (e) {
    return {
      wealthScore,
      tier,
      pillars: { 
        resilience: Math.max(10, resilience), 
        consistency: Math.max(10, consistency), 
        efficiency: Math.max(10, efficiency), 
        identity 
      },
      recommendation
    };
  }
};

export const getFinancialAdvice = async (
  messages: AdvisorMessage[],
  transactions: Transaction[],
  report: CreditReport | null
): Promise<string> => {
  // Check if API key is available
  const apiKey = process.env.API_KEY;
  
  // Return fallback advice if no API key
  if (!apiKey) {
    const score = report?.score || 550;
    const grade = report?.grade || 'C';
    
    // Get last user message for context
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.text || '';
    const lowerMessage = lastUserMessage.toLowerCase();
    
    // Context-aware fallback responses
    if (lowerMessage.includes('loan') || lowerMessage.includes('borrow') || lowerMessage.includes('credit')) {
      return `Based on your current credit score of ${score} (Grade ${grade}), I recommend focusing on improving your score before applying for a large loan. Your Grade ${grade} profile suggests you could qualify for loans with interest rates around ${grade === 'A' ? '2.5%' : grade === 'B' ? '4%' : '7%'} per month. 

💡 Tip: Use the "Apply for Loan" button on your dashboard to start a digital application. The AI will instantly calculate your eligibility and proposed terms.`;
    }
    
    if (lowerMessage.includes('save') || lowerMessage.includes('susu') || lowerMessage.includes('investment')) {
      return `Great question about savings! With your current profile, I recommend:

1. **Susu Savings**: Use our Financial Tools tab to set up automatic savings goals
2. **Emergency Fund**: Aim for 3-6 months of business expenses
3. **Diversify**: Consider multiple income streams to build wealth

Your Susu balance of GH₵8,400 is a solid foundation. Keep building it consistently!`;
    }
    
    if (lowerMessage.includes('score') || lowerMessage.includes('credit') || lowerMessage.includes('grade')) {
      return `Your credit score is currently ${score} (Grade ${grade}). This score is calculated based on:
• Transaction consistency
• Loan repayment history  
• Business stability
• Verification status

💡 To improve: Maintain regular inflows, pay utility bills on time, and consider getting verified with your GhanaCard.`;
    }
    
    if (lowerMessage.includes('grow') || lowerMessage.includes('expand') || lowerMessage.includes('business')) {
      return `Here are strategies to grow your business:

1. **Increase Transaction Volume**: More consistent daily MoMo inflows = higher trust score
2. **Use BNPL**: Our Buy Now Pay Later feature can help you stock more inventory
3. **Virtual Cards**: For international trade, consider applying for a virtual card
4. **Reinvest Profits**: Rather than withdrawing, put profits back into your business

Your Wealth Check tier gives you additional insights into your business resilience.`;
    }
    
    return `Akwaaba! I'm your CrediGhana Advisor. Based on your profile (Score: ${score}, Grade: ${grade}), I'm here to help with:

• Loan applications and eligibility
• Savings strategies (Susu 2.0)
• Business growth tips
• Credit score improvement

What would you like to know more about? Try asking about loans, savings, or how to grow your business!`;
  }

  const context = `
    You are a professional financial advisor for small business owners in Ghana.
    The user's current credit score is ${report?.score || 'unknown'} (${report?.grade || 'N/A'}).
    The platform now includes modern features: Susu 2.0 (Savings Goals), BNPL (Buy Now Pay Later for Inventory), and Virtual Cards for international trade.
    
    Answer the user's questions about loans, savings, and business growth. Be encouraging and practical.
    Suggest using the "Financial Tools" tab for Susu or BNPL if they ask about saving or stocking up.
    Use Ghanaian context (Cedis, MoMo, local markets).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    })),
    config: {
      systemInstruction: context
    }
  });

  return response.text || "I'm sorry, I couldn't process that request.";
};

export const getGrowthForecast = async (
  transactions: Transaction[]
): Promise<string> => {
  // Check if API key is available
  const apiKey = process.env.API_KEY;
  
  // Calculate metrics for the forecast
  const totalInflow = transactions.filter(t => t.isPositive).reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = transactions.filter(t => !t.isPositive).reduce((sum, t) => sum + t.amount, 0);
  const netFlow = totalInflow - totalOutflow;
  const growthRate = netFlow > 0 ? 8 : netFlow < 0 ? -5 : 2;
  
  // Return fallback forecast if no API key
  if (!apiKey) {
    return `Based on your transaction patterns, your business shows a ${netFlow > 0 ? 'positive' : 'challenging'} cash flow trend. 

With average monthly inflows of GH₵${totalInflow.toLocaleString()} and outflows of GH₵${totalOutflow.toLocaleString()}, we project a ${growthRate > 0 ? '+' : ''}${growthRate}% growth in the coming month.

💡 Tactical Recommendation: Consider increasing your Susu savings by 10% this month to build a stronger financial buffer. This will not only improve your creditworthiness but also provide resilience against market fluctuations.

📊 Visit the Analytics tab for more detailed insights about your financial health.`;
  }

  const prompt = `
    Based on these transactions: ${JSON.stringify(transactions)}
    Provide a 1-month financial growth forecast for this Ghanaian small business. 
    Predict revenue trends and suggest one tactical move to improve cash flow using our new tools (Susu, BNPL, or Virtual Cards). Keep it under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No forecast available.";
  } catch (error) {
    // Fallback to calculated response if API call fails
    return `Based on your transaction patterns, your business shows a ${netFlow > 0 ? 'positive' : 'challenging'} cash flow trend. 
    
With average monthly inflows of GH₵${totalInflow.toLocaleString()} and outflows of GH₵${totalOutflow.toLocaleString()}, we project a ${growthRate > 0 ? '+' : ''}${growthRate}% growth in the coming month.

💡 Tactical Recommendation: Consider increasing your Susu savings by 10% this month to build a stronger financial buffer. This will not only improve your creditworthiness but also provide resilience against market fluctuations.`;
  }
};
