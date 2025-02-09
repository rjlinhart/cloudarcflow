// Language: TypeScript
import { 
  type Project, 
  type InsertProject,
  type Review, 
  type InsertReview,
  type Template, 
  type InsertTemplate,
  type StageApproval, 
  type InsertStageApproval,
  projects, 
  reviews, 
  templates, 
  stageApprovals, 
  ProjectStage
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Storage interface definition for local use
export interface IStorage {
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Stage Approvals
  getStageApproval(projectId: number, stage: ProjectStage): Promise<StageApproval | undefined>;
  createStageApproval(approval: InsertStageApproval): Promise<StageApproval>;
  approveStage(projectId: number, stage: ProjectStage, approvedBy: string, comments?: string): Promise<StageApproval>;

  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByProject(projectId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Templates
  getTemplate(id: number): Promise<Template | undefined>;
  getTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
}

// Local database implementation using drizzle-orm (with your local db connection)
export class DatabaseStorage implements IStorage {
  async getProject(id: number): Promise<Project | undefined> {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      return await db.select().from(projects);
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  async createProject(project: InsertProject): Promise<Project> {
    try {
      const [newProject] = await db.insert(projects).values(project).returning();
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id: number, update: Partial<Project>): Promise<Project> {
    try {
      const [updatedProject] = await db
        .update(projects)
        .set(update)
        .where(eq(projects.id, id))
        .returning();
      if (!updatedProject) throw new Error(`Project with id ${id} not found`);
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      await db.delete(projects).where(eq(projects.id, id));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async getStageApproval(projectId: number, stage: ProjectStage): Promise<StageApproval | undefined> {
    try {
      const [approval] = await db
        .select()
        .from(stageApprovals)
        .where(
          and(
            eq(stageApprovals.projectId, projectId),
            eq(stageApprovals.stage, stage)
          )
        );
      return approval;
    } catch (error) {
      console.error('Error getting stage approval:', error);
      throw error;
    }
  }

  async createStageApproval(approval: InsertStageApproval): Promise<StageApproval> {
    try {
      const [newApproval] = await db
        .insert(stageApprovals)
        .values({
          ...approval,
          // For local development, ensure default values are set appropriately
          approved: false,
          approvedAt: null,
          approvedBy: null
        })
        .returning();
      return newApproval;
    } catch (error) {
      console.error('Error creating stage approval:', error);
      throw error;
    }
  }

  async approveStage(
    projectId: number, 
    stage: ProjectStage, 
    approvedBy: string, 
    comments?: string
  ): Promise<StageApproval> {
    try {
      let approval = await this.getStageApproval(projectId, stage);

      if (!approval) {
        approval = await this.createStageApproval({
          projectId,
          stage,
          comments,
          requirements: {},
          approved: false,
          approvedAt: null,
          approvedBy: null
        });
      }

      const [updatedApproval] = await db
        .update(stageApprovals)
        .set({
          approved: true,
          approvedBy,
          approvedAt: new Date(),
          comments: comments || approval.comments
        })
        .where(
          and(
            eq(stageApprovals.projectId, projectId),
            eq(stageApprovals.stage, stage)
          )
        )
        .returning();

      return updatedApproval;
    } catch (error) {
      console.error('Error approving stage:', error);
      throw error;
    }
  }

  async getReview(id: number): Promise<Review | undefined> {
    try {
      const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
      return review;
    } catch (error) {
      console.error('Error getting review:', error);
      throw error;
    }
  }

  async getReviewsByProject(projectId: number): Promise<Review[]> {
    try {
      return await db.select().from(reviews).where(eq(reviews.projectId, projectId));
    } catch (error) {
      console.error('Error getting reviews by project:', error);
      throw error;
    }
  }

  async createReview(review: InsertReview): Promise<Review> {
    try {
      const [newReview] = await db.insert(reviews).values(review).returning();
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    try {
      const [template] = await db.select().from(templates).where(eq(templates.id, id));
      return template;
    } catch (error) {
      console.error('Error getting template:', error);
      throw error;
    }
  }

  async getTemplates(): Promise<Template[]> {
    try {
      return await db.select().from(templates);
    } catch (error) {
      console.error('Error getting templates:', error);
      throw error;
    }
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    try {
      const [newTemplate] = await db.insert(templates).values(template).returning();
      return newTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();