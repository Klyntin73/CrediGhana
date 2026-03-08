import mongoose, { Schema, Document } from 'mongoose';

export interface IKeyFactor {
  factor: string;
  impact: 'Positive' | 'Negative';
  description: string;
}

export interface ICreditReport extends Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: string;
  keyFactors: IKeyFactor[];
  bureauSyncDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const KeyFactorSchema = new Schema<IKeyFactor>({
  factor: { type: String, required: true },
  impact: { type: String, enum: ['Positive', 'Negative'], required: true },
  description: { type: String, required: true }
}, { _id: false });

const CreditReportSchema = new Schema<ICreditReport>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  score: { type: Number, required: true, min: 0, max: 1000 },
  grade: { 
    type: String, 
    enum: ['A', 'B', 'C', 'D', 'F'],
    required: true 
  },
  riskLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    required: true 
  },
  explanation: { type: String, required: true },
  keyFactors: [KeyFactorSchema],
  bureauSyncDate: { type: Date, default: Date.now }
}, { timestamps: true });

CreditReportSchema.index({ userId: 1 });
CreditReportSchema.index({ score: -1 });

export const CreditReport = mongoose.model<ICreditReport>('CreditReport', CreditReportSchema);

