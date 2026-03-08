import { Transaction, ITransaction } from '../models';

export class TransactionRepository {
  async create(transactionData: Partial<ITransaction>): Promise<ITransaction> {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  async findById(id: string): Promise<ITransaction | null> {
    return await Transaction.findById(id);
  }

  async findByUserId(userId: string, limit: number = 50): Promise<ITransaction[]> {
    return await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(limit);
  }

  async findByUserIdAndDateRange(
    userId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<ITransaction[]> {
    return await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
  }

  async findByType(userId: string, type: ITransaction['type']): Promise<ITransaction[]> {
    return await Transaction.find({ userId, type }).sort({ date: -1 });
  }

  async getTotalIncome(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const query: any = { userId, isPositive: true };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const result = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result[0]?.total || 0;
  }

  async getTotalExpenses(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const query: any = { userId, isPositive: false };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const result = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result[0]?.total || 0;
  }

  async getTransactionStats(userId: string) {
    const totalIncome = await this.getTotalIncome(userId);
    const totalExpenses = await this.getTotalExpenses(userId);
    
    return {
      totalIncome,
      totalExpenses,
      netFlow: totalIncome - totalExpenses
    };
  }

  async update(id: string, transactionData: Partial<ITransaction>): Promise<ITransaction | null> {
    return await Transaction.findByIdAndUpdate(id, transactionData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Transaction.findByIdAndDelete(id);
    return !!result;
  }

  async getRecentTransactions(userId: string, limit: number = 10): Promise<ITransaction[]> {
    return await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(limit);
  }
}

export const transactionRepository = new TransactionRepository();

