
export type TransactionType = 'MoMo' | 'Utility' | 'Inventory' | 'LoanRepayment' | 'Savings' | 'Transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  status: 'Completed' | 'Pending' | 'Failed';
  isPositive: boolean;
}

export interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  status: 'Active' | 'Completed' | 'Defaulted' | 'Pending Approval';
  disbursedDate: string;
  completionDate?: string;
  purpose: string;
  repaymentAmount: number;
  dueDate: string;
}

export interface CreditReport {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: string;
  keyFactors: {
    factor: string;
    impact: 'Positive' | 'Negative';
    description: string;
  }[];
}

export interface WealthProfile {
  wealthScore: number; // 0-100
  tier: 'Seedling' | 'Sprouter' | 'Flourishing' | 'Harvest' | 'Kingdom';
  pillars: {
    resilience: number;
    consistency: number;
    efficiency: number;
    identity: number;
  };
  recommendation: string;
}

export interface UserProfile {
  name: string;
  location: string;
  region?: string; // Ghana region for localized greetings
  businessType: string;
  memberSince: string;
  isVerified?: boolean;
  ghanaCardNumber?: string;
  clearanceStatus?: 'Verified' | 'Pending' | 'Not Requested' | 'Suspended' | 'Revoked';
  momoAccounts?: string[];
  dataPermissions?: {
    momo: boolean;
    nia: boolean;
    bureau: boolean;
  };
}

export interface BusinessDocument {
  id: string;
  name: string;
  status: 'Not Verified' | 'Pending' | 'Verified';
  type: 'Registration' | 'Tax' | 'ID';
}

export interface AdvisorMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
  deadline: string;
}

export interface BNPLOrder {
  id: string;
  merchant: string;
  totalAmount: number;
  paidAmount: number;
  nextInstallmentDate: string;
  status: 'Active' | 'Completed';
}

export interface VirtualCard {
  id: string;
  lastFour: string;
  expiry: string;
  type: 'VISA' | 'Mastercard';
  status: 'Active' | 'Frozen';
  limit: number;
}

// User Roles for Admin
export type UserRole = 'user' | 'admin' | 'super_admin';

export interface AdminStats {
  totalUsers: number;
  totalLoans: number;
  activeLoans: number;
  defaultedLoans: number;
  totalTransactionVolume: number;
  pendingApprovals: number;
}

export interface SystemLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  details: string;
}
