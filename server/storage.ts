import { 
  type Project, type InsertProject,
  type Review, type InsertReview,
  type Template, type InsertTemplate,
  type StageApproval, type InsertStageApproval,
  projects, reviews, templates, stageApprovals
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project>;

  // Stage Approvals
  getStageApproval(projectId: number, stage: string): Promise<StageApproval | undefined>;
  createStageApproval(approval: InsertStageApproval): Promise<StageApproval>;
  approveStage(projectId: number, stage: string, approvedBy: string, comments?: string): Promise<StageApproval>;

  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByProject(projectId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Templates
  getTemplate(id: number): Promise<Template | undefined>;
  getTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
}

export class DatabaseStorage implements IStorage {
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, update: Partial<Project>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set(update)
      .where(eq(projects.id, id))
      .returning();
    if (!updatedProject) throw new Error("Project not found");
    return updatedProject;
  }

  async getStageApproval(projectId: number, stage: string): Promise<StageApproval | undefined> {
    const [approval] = await db
      .select()
      .from(stageApprovals)
      .where(and(
        eq(stageApprovals.projectId, projectId),
        eq(stageApprovals.stage, stage)
      ));
    return approval;
  }

  async createStageApproval(approval: InsertStageApproval): Promise<StageApproval> {
    const [newApproval] = await db
      .insert(stageApprovals)
      .values(approval)
      .returning();
    return newApproval;
  }

  async approveStage(projectId: number, stage: string, approvedBy: string, comments?: string): Promise<StageApproval> {
    const [approval] = await db
      .update(stageApprovals)
      .set({
        approved: true,
        approvedBy,
        approvedAt: new Date(),
        comments
      })
      .where(and(
        eq(stageApprovals.projectId, projectId),
        eq(stageApprovals.stage, stage)
      ))
      .returning();
    if (!approval) throw new Error("Stage approval not found");
    return approval;
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewsByProject(projectId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.projectId, projectId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db.insert(templates).values(template).returning();
    return newTemplate;
  }
}

export const storage = new DatabaseStorage();