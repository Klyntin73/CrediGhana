import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'MoMo' | 'Utility' | 'Inventory' | 'LoanRepayment' | 'Savings' | 'Transfer';
  amount: number;
  date: Date;
  description: string;
  status: 'Completed' | 'Pending' | 'Failed';
  isPositive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['MoMo', 'Utility', 'Inventory', 'LoanRepayment', 'Savings', 'Transfer'],
    required: true 
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Completed', 'Pending', 'Failed'],
    default: 'Completed'
  },
  isPositive: { type: Boolean, required: true }
}, { timestamps: true });

TransactionSchema.index({ userId: 1, date: -1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

