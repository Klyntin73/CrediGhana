import { User, IUser } from '../models';

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return await User.findOne({ phone });
  }

  async findByGhanaCard(ghanaCardNumber: string): Promise<IUser | null> {
    return await User.findOne({ ghanaCardNumber });
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  async updateClearanceStatus(id: string, status: IUser['clearanceStatus']): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { clearanceStatus: status }, { new: true });
  }

  async updateDataPermissions(id: string, permissions: IUser['dataPermissions']): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { dataPermissions: permissions }, { new: true });
  }

  async addMomoAccount(id: string, account: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { $addToSet: { momoAccounts: account } },
      { new: true }
    );
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}

export const userRepository = new UserRepository();

