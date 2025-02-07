import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { PROJECT_STAGES } from "@/lib/constants";

interface StageCardProps {
  stage: string;
  isActive?: boolean;
  isComplete?: boolean;
  title?: string;
  description?: string;
}

export function StageCard({ 
  stage,
  isActive = false,
  isComplete = false,
  title,
  description 
}: StageCardProps) {
  const stageInfo = PROJECT_STAGES[stage as keyof typeof PROJECT_STAGES];
  
  return (
    <Card className={cn(
      "transition-colors",
      isActive && "border-primary",
      isComplete && "bg-primary/5"
    )}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Circle className={cn(
              "h-5 w-5",
              isActive ? "text-primary" : "text-muted-foreground"
            )} />
          )}
          <CardTitle className="text-lg">
            {title || stageInfo?.title}
          </CardTitle>
        </div>
        <CardDescription>
          {description || stageInfo?.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
