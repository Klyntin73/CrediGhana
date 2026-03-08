import mongoose, { Schema, Document } from 'mongoose';

export interface ISavingsGoal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  target: number;
  current: number;
  icon: string;
  deadline: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SavingsGoalSchema = new Schema<ISavingsGoal>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  icon: { type: String, default: 'PiggyBank' },
  deadline: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

SavingsGoalSchema.index({ userId: 1 });

export const SavingsGoal = mongoose.model<ISavingsGoal>('SavingsGoal', SavingsGoalSchema);

