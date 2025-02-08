import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectSteps } from "@/components/projects/ProjectSteps";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: [`/api/projects/${id}`]
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="p-8">
      <head>
        <title>Project Details</title>
      </head>
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectSteps project={project} />
        </CardContent>
      </Card>
    </div>
  );
}
