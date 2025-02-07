import { 
  type Project, type InsertProject,
  type Review, type InsertReview,
  type Template, type InsertTemplate
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project>;
  
  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByProject(projectId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Templates
  getTemplate(id: number): Promise<Template | undefined>;
  getTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private reviews: Map<number, Review>;
  private templates: Map<number, Template>;
  private currentProjectId: number;
  private currentReviewId: number;
  private currentTemplateId: number;

  constructor() {
    this.projects = new Map();
    this.reviews = new Map();
    this.templates = new Map();
    this.currentProjectId = 1;
    this.currentReviewId = 1;
    this.currentTemplateId = 1;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const newProject = { ...project, id, approvalStatus: false, currentStageData: {} };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, update: Partial<Project>): Promise<Project> {
    const project = await this.getProject(id);
    if (!project) throw new Error("Project not found");
    
    const updatedProject = { ...project, ...update };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByProject(projectId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.projectId === projectId);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const newReview = { ...review, id };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const newTemplate = { ...template, id };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }
}

export const storage = new MemStorage();
