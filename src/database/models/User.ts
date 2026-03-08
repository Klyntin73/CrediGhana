import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  location: string;
  region?: string;
  businessType: string;
  memberSince: Date;
  isVerified: boolean;
  ghanaCardNumber?: string;
  clearanceStatus: 'Verified' | 'Pending' | 'Not Requested' | 'Suspended' | 'Revoked';
  momoAccounts: string[];
  dataPermissions: {
    momo: boolean;
    nia: boolean;
    bureau: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  region: { type: String },
  businessType: { type: String, required: true },
  memberSince: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  ghanaCardNumber: { type: String },
  clearanceStatus: { 
    type: String, 
    enum: ['Verified', 'Pending', 'Not Requested', 'Suspended', 'Revoked'],
    default: 'Not Requested'
  },
  momoAccounts: [{ type: String }],
  dataPermissions: {
    momo: { type: Boolean, default: false },
    nia: { type: Boolean, default: false },
    bureau: { type: Boolean, default: false }
  }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);

