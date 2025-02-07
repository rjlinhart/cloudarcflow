import { type ProjectStage } from "@shared/schema";

export const CLOUD_PROVIDERS = [
  { label: "AWS", value: "aws" },
  { label: "Google Cloud", value: "gcp" },
] as const;

export const PROJECT_STAGES: Record<ProjectStage, {
  title: string;
  description: string;
}> = {
  intake: {
    title: "Project Intake",
    description: "Gather business requirements and initial specifications"
  },
  design: {
    title: "Architecture Design",
    description: "Collaborative design sessions and template selection"
  },
  pricing: {
    title: "Cost Analysis",
    description: "Resource pricing and cost estimation"
  },
  procurement: {
    title: "Procurement",
    description: "Vendor selection and quote management"
  },
  dev_environment: {
    title: "Development Environment",
    description: "Set up and configure development environment"
  },
  pipeline: {
    title: "Pipeline Setup",
    description: "CI/CD pipeline configuration"
  },
  security: {
    title: "Security Review",
    description: "Security assessment and compliance checks"
  },
  production: {
    title: "Production",
    description: "Production environment deployment"
  }
} as const;
