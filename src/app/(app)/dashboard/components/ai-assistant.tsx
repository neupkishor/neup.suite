"use client";

import { suggestActions } from "@/ai/flows/ai-suggested-actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ArrowRight, Lightbulb, RefreshCw } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

type AssistantState = {
  suggestedActions: string;
  pendingDeadlines: string;
};

export function AIAssistant({ projectData }: { projectData: string }) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<AssistantState | null>(null);

  const getSuggestions = () => {
    startTransition(async () => {
      const result = await suggestActions({ projectData });
      setState(result);
    });
  };

  useEffect(() => {
    getSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <Lightbulb className="text-primary" />
          AI Suggested Actions
        </h3>
        {isPending && !state ? (
          <div className="mt-2 space-y-3">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : (
          state?.suggestedActions && (
            <ul className="mt-2 list-inside list-disc space-y-2 text-sm text-muted-foreground">
              {state.suggestedActions.split('\n').map((action, index) => action.trim() && <li key={index}>{action.replace(/^- /, '')}</li>)}
            </ul>
          )
        )}
      </div>

      <div>
        <h3 className="flex items-center gap-2 font-semibold text-destructive">
          <AlertTriangle className="text-destructive" />
          Pending Deadlines
        </h3>
        {isPending && !state ? (
          <div className="mt-2 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
           state?.pendingDeadlines && (
            <p className="mt-2 text-sm text-muted-foreground">
              {state.pendingDeadlines}
            </p>
           )
        )}
      </div>

      <Button variant="outline" size="sm" onClick={getSuggestions} disabled={isPending}>
        {isPending ? <RefreshCw className="animate-spin" /> : <RefreshCw />}
        Refresh Suggestions
      </Button>
    </div>
  );
}
