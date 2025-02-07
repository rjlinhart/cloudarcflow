import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertReviewSchema } from "@shared/schema";

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
