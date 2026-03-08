import { CreditReport, ICreditReport } from '../models';

export class CreditReportRepository {
  async create(reportData: Partial<ICreditReport>): Promise<ICreditReport> {
    const report = new CreditReport(reportData);
    return await report.save();
  }

  async findById(id: string): Promise<ICreditReport | null> {
    return await CreditReport.findById(id);
  }

  async findByUserId(userId: string): Promise<ICreditReport | null> {
    return await CreditReport.findOne({ userId });
  }

  async update(userId: string, reportData: Partial<ICreditReport>): Promise<ICreditReport | null> {
    return await CreditReport.findOneAndUpdate(
      { userId },
      { ...reportData, bureauSyncDate: new Date() },
      { new: true, upsert: true }
    );
  }

  async updateScore(userId: string, score: number, grade: ICreditReport['grade']): Promise<ICreditReport | null> {
    const riskLevel = score >= 700 ? 'Low' : score >= 500 ? 'Medium' : 'High';
    
    return await CreditReport.findOneAndUpdate(
      { userId },
      { score, grade, riskLevel, bureauSyncDate: new Date() },
      { new: true, upsert: true }
    );
  }

  async getTopScorers(limit: number = 10): Promise<ICreditReport[]> {
    return await CreditReport.find()
      .sort({ score: -1 })
      .limit(limit)
      .populate('userId', 'name location businessType');
  }

  async getScoreDistribution() {
    const distribution = await CreditReport.aggregate([
      {
        $bucket: {
          groupBy: '$score',
          boundaries: [0, 300, 500, 700, 850, 1001],
          default: 'Other',
          output: { count: { $sum: 1 } }
        }
      }
    ]);
    return distribution;
  }

  async getAverageScore(): Promise<number> {
    const result = await CreditReport.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    return result[0]?.avgScore || 0;
  }

  async delete(userId: string): Promise<boolean> {
    const result = await CreditReport.findOneAndDelete({ userId });
    return !!result;
  }

  async syncWithBureau(userId: string): Promise<ICreditReport | null> {
    // This would integrate with external credit bureau APIs
    // For now, it just updates the sync date
    return await CreditReport.findOneAndUpdate(
      { userId },
      { bureauSyncDate: new Date() },
      { new: true }
    );
  }
}

export const creditReportRepository = new CreditReportRepository();

