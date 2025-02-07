import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums for project stages
export const ProjectStage = {
  INTAKE: "intake",
  DESIGN: "design", 
  PRICING: "pricing",
  PROCUREMENT: "procurement",
  DEV_ENV: "dev_environment",
  PIPELINE: "pipeline",
  SECURITY: "security",
  PRODUCTION: "production"
} as const;

// Convert ProjectStage to array for enum type
const PROJECT_STAGE_VALUES = Object.values(ProjectStage);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  businessCase: text("business_case").notNull(),
  stage: text("stage").notNull().$type<typeof PROJECT_STAGE_VALUES[number]>(),
  currentStageData: jsonb("current_stage_data"),
  approvalStatus: boolean("approval_status").default(false),
  cloudProvider: text("cloud_provider").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  stage: text("stage").notNull().$type<typeof PROJECT_STAGE_VALUES[number]>(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).notNull(),
  comments: text("comments"),
  reviewedBy: text("reviewed_by"),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["architecture", "pipeline", "security"] }).notNull(),
  content: jsonb("content").notNull(),
});

// Schema types
export const insertProjectSchema = createInsertSchema(projects)
  .omit({ id: true, currentStageData: true, approvalStatus: true });

export const insertReviewSchema = createInsertSchema(reviews)
  .omit({ id: true });

export const insertTemplateSchema = createInsertSchema(templates)
  .omit({ id: true });

// Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;