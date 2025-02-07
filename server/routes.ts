import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertReviewSchema, insertStageApprovalSchema, ProjectStage } from "@shared/schema";

export function registerRoutes(app: Express) {
  const router = app;

  // Projects
  router.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  router.get("/api/projects/:id", async (req, res) => {
    const project = await storage.getProject(parseInt(req.params.id));
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  router.post("/api/projects", async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error });
    }
    const project = await storage.createProject(parsed.data);
    res.json(project);
  });

  router.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(parseInt(req.params.id), req.body);
      res.json(project);
    } catch (err) {
      res.status(404).json({ message: "Project not found" });
    }
  });

  // Stage Approvals
  router.get("/api/projects/:id/stages/:stage/approval", async (req, res) => {
    const approval = await storage.getStageApproval(
      parseInt(req.params.id),
      req.params.stage
    );
    if (!approval) return res.status(404).json({ message: "Stage approval not found" });
    res.json(approval);
  });

  router.post("/api/projects/:id/stages/:stage/approval", async (req, res) => {
    const parsed = insertStageApprovalSchema.safeParse({
      ...req.body,
      projectId: parseInt(req.params.id),
      stage: req.params.stage
    });
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error });
    }
    const approval = await storage.createStageApproval(parsed.data);
    res.json(approval);
  });

  router.post("/api/projects/:id/stages/:stage/approve", async (req, res) => {
    try {
      const { approvedBy, comments } = req.body;
      const approval = await storage.approveStage(
        parseInt(req.params.id),
        req.params.stage,
        approvedBy,
        comments
      );

      // After successful approval, update the project's stage to the next one
      const currentProject = await storage.getProject(parseInt(req.params.id));
      if (currentProject) {
        const stages = Object.values(ProjectStage);
        const currentIndex = stages.indexOf(currentProject.stage as any);
        if (currentIndex < stages.length - 1) {
          const nextStage = stages[currentIndex + 1];
          await storage.updateProject(currentProject.id, { 
            stage: nextStage as typeof stages[number]
          });
        }
      }

      res.json(approval);
    } catch (err) {
      console.error('Stage approval error:', err);
      res.status(500).json({ message: "Failed to approve stage" });
    }
  });

  // Reviews
  router.get("/api/projects/:id/reviews", async (req, res) => {
    const reviews = await storage.getReviewsByProject(parseInt(req.params.id));
    res.json(reviews);
  });

  router.post("/api/reviews", async (req, res) => {
    const parsed = insertReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error });
    }
    const review = await storage.createReview(parsed.data);
    res.json(review);
  });

  // Templates
  router.get("/api/templates", async (req, res) => {
    const templates = await storage.getTemplates();
    res.json(templates);
  });

  return createServer(app);
}