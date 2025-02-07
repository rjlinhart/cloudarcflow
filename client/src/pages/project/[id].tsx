import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ProjectSteps } from "@/components/projects/ProjectSteps";
import type { Project } from "@shared/schema";

export default function ProjectDetails() {
  const [, params] = useRoute("/project/:id");
  const projectId = params?.id;

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId
  });

  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground mt-2">{project.description}</p>
      </div>

      <ProjectSteps project={project} />
    </div>
  );
}
