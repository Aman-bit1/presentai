import { users, type User, type InsertUser, type Evaluation, type InsertEvaluation, type UpdateEvaluation, type FeedbackItem, type AnalysisDetails } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getEvaluation(id: number): Promise<Evaluation | undefined>;
  getEvaluationsByUserId(userId: number): Promise<Evaluation[]>;
  createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation>;
  updateEvaluation(id: number, update: UpdateEvaluation): Promise<Evaluation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private evaluations: Map<number, Evaluation>;
  private userIdCounter: number;
  private evaluationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.evaluations = new Map();
    this.userIdCounter = 1;
    this.evaluationIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> { return this.users.get(id); }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEvaluation(id: number): Promise<Evaluation | undefined> { return this.evaluations.get(id); }

  async getEvaluationsByUserId(userId: number): Promise<Evaluation[]> {
    return Array.from(this.evaluations.values())
      .filter(evaluation => evaluation.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
  }

  async createEvaluation(insertEvaluation: InsertEvaluation): Promise<Evaluation> {
    const id = this.evaluationIdCounter++;
    const evaluation: Evaluation = {
      id,
      userId: insertEvaluation.userId ?? null,
      title: insertEvaluation.title,
      videoUrl: insertEvaluation.videoUrl,
      createdAt: new Date(),
      status: "processing",
      overallScore: null,
      confidenceScore: null,
      facialExpressionsScore: null,
      eyeContactScore: null,
      bodyLanguageScore: null,
      feedback: null,
      analysisDetails: null
    };
    this.evaluations.set(id, evaluation);
    return evaluation;
  }

  async updateEvaluation(id: number, update: UpdateEvaluation): Promise<Evaluation | undefined> {
    const evaluation = this.evaluations.get(id);
    if (!evaluation) return undefined;

    const feedbackData: FeedbackItem[] | null = update.feedback
      ? (Array.isArray(update.feedback) ? update.feedback as FeedbackItem[] : null)
      : evaluation.feedback;

    const detailsData: AnalysisDetails | null = update.analysisDetails
      ? (update.analysisDetails as AnalysisDetails)
      : evaluation.analysisDetails;

    const updated: Evaluation = {
      id: evaluation.id,
      userId: evaluation.userId,
      title: evaluation.title,
      videoUrl: evaluation.videoUrl,
      createdAt: evaluation.createdAt,
      status: update.status ?? evaluation.status,
      overallScore: update.overallScore ?? evaluation.overallScore,
      confidenceScore: update.confidenceScore ?? evaluation.confidenceScore,
      facialExpressionsScore: update.facialExpressionsScore ?? evaluation.facialExpressionsScore,
      eyeContactScore: update.eyeContactScore ?? evaluation.eyeContactScore,
      bodyLanguageScore: update.bodyLanguageScore ?? evaluation.bodyLanguageScore,
      feedback: feedbackData,
      analysisDetails: detailsData
    };
    this.evaluations.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
