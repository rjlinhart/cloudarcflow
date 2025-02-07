import { PROJECT_STAGES } from "@/lib/constants";
import { StageCard } from "./StageCard";
import type { Project } from "@shared/schema";

interface ProjectStepsProps {
  project: Project;
}

export function ProjectSteps({ project }: ProjectStepsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(PROJECT_STAGES).map(([key, stage]) => (
        <StageCard
          key={key}
          stage={key}
          isActive={project.stage === key}
          isComplete={false}
          {...stage}
        />
      ))}
    </div>
  );
}
