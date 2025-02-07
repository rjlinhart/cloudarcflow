import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PROJECT_STAGES } from "@/lib/constants";
import { StageCard } from "./StageCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Project, StageApproval } from "@shared/schema";

interface ProjectStepsProps {
  project: Project;
}

interface ApproveDialogProps {
  projectId: number;
  stage: string;
  isOpen: boolean;
  onClose: () => void;
}

function ApproveDialog({ projectId, stage, isOpen, onClose }: ApproveDialogProps) {
  const [comments, setComments] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/projects/${projectId}/stages/${stage}/approve`, {
        approvedBy: "Current User", // TODO: Replace with actual user
        comments
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/stages/${stage}/approval`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      toast({
        title: "Stage Approved",
        description: "The stage has been approved successfully."
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Stage</DialogTitle>
          <DialogDescription>
            Add any comments or requirements that were met for this stage.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter approval comments..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}>
            Approve Stage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectSteps({ project }: ProjectStepsProps) {
  const [approvalStage, setApprovalStage] = useState<string | null>(null);

  const { data: stageApproval } = useQuery<StageApproval>({
    queryKey: [`/api/projects/${project.id}/stages/${project.stage}/approval`],
    enabled: !!project.id
  });

  const showApprovalDialog = (stage: string) => {
    setApprovalStage(stage);
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(PROJECT_STAGES).map(([key, stage]) => {
          const isCurrentStage = project.stage === key;
          const isApproved = stageApproval?.approved ?? false;

          return (
            <div key={key} className="space-y-2">
              <StageCard
                stage={key}
                isActive={isCurrentStage}
                isComplete={false}
                {...stage}
              />
              {isCurrentStage && !isApproved && (
                <Button 
                  className="w-full"
                  onClick={() => showApprovalDialog(key)}
                >
                  Approve Stage
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {approvalStage && (
        <ApproveDialog
          projectId={project.id}
          stage={approvalStage}
          isOpen={true}
          onClose={() => setApprovalStage(null)}
        />
      )}
    </>
  );
}