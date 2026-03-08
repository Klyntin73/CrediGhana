import { Loan, ILoan } from '../models';

export class LoanRepository {
  async create(loanData: Partial<ILoan>): Promise<ILoan> {
    const loan = new Loan(loanData);
    return await loan.save();
  }

  async findById(id: string): Promise<ILoan | null> {
    return await Loan.findById(id);
  }

  async findByUserId(userId: string): Promise<ILoan[]> {
    return await Loan.find({ userId }).sort({ createdAt: -1 });
  }

  async findActiveLoans(userId: string): Promise<ILoan[]> {
    return await Loan.find({ userId, status: 'Active' });
  }

  async findPendingLoans(): Promise<ILoan[]> {
    return await Loan.find({ status: 'Pending Approval' }).populate('userId', 'name email');
  }

  async findByStatus(userId: string, status: ILoan['status']): Promise<ILoan[]> {
    return await Loan.find({ userId, status });
  }

  async update(id: string, loanData: Partial<ILoan>): Promise<ILoan | null> {
    return await Loan.findByIdAndUpdate(id, loanData, { new: true });
  }

  async approveLoan(id: string): Promise<ILoan | null> {
    return await Loan.findByIdAndUpdate(
      id,
      { status: 'Active', disbursedDate: new Date() },
      { new: true }
    );
  }

  async completeLoan(id: string): Promise<ILoan | null> {
    return await Loan.findByIdAndUpdate(
      id,
      { status: 'Completed', completionDate: new Date() },
      { new: true }
    );
  }

  async defaultLoan(id: string): Promise<ILoan | null> {
    return await Loan.findByIdAndUpdate(
      id,
      { status: 'Defaulted' },
      { new: true }
    );
  }

  async getTotalActiveDebt(userId: string): Promise<number> {
    const result = await Loan.aggregate([
      { $match: { userId: userId, status: 'Active' } },
      { $group: { _id: null, total: { $sum: '$repaymentAmount' } } }
    ]);
    return result[0]?.total || 0;
  }

  async getLoanStats(userId: string) {
    const totalLoans = await Loan.countDocuments({ userId });
    const activeLoans = await Loan.countDocuments({ userId, status: 'Active' });
    const pendingLoans = await Loan.countDocuments({ userId, status: 'Pending Approval' });
    const completedLoans = await Loan.countDocuments({ userId, status: 'Completed' });
    const defaultedLoans = await Loan.countDocuments({ userId, status: 'Defaulted' });
    const totalDebt = await this.getTotalActiveDebt(userId);

    return {
      totalLoans,
      activeLoans,
      pendingLoans,
      completedLoans,
      defaultedLoans,
      totalDebt
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await Loan.findByIdAndDelete(id);
    return !!result;
  }

  async getUpcomingPayments(userId: string, days: number = 7): Promise<ILoan[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await Loan.find({
      userId,
      status: 'Active',
      dueDate: { $lte: futureDate, $gte: new Date() }
    }).sort({ dueDate: 1 });
  }
}

export const loanRepository = new LoanRepository();

