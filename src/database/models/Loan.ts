import mongoose, { Schema, Document } from 'mongoose';

export interface ILoan extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  interestRate: number;
  status: 'Active' | 'Completed' | 'Defaulted' | 'Pending Approval';
  disbursedDate: Date;
  completionDate?: Date;
  purpose: string;
  repaymentAmount: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Completed', 'Defaulted', 'Pending Approval'],
    default: 'Pending Approval'
  },
  disbursedDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  purpose: { type: String, required: true },
  repaymentAmount: { type: Number, required: true },
  dueDate: { type: Date, required: true }
}, { timestamps: true });

LoanSchema.index({ userId: 1, status: 1 });

export const Loan = mongoose.model<ILoan>('Loan', LoanSchema);

