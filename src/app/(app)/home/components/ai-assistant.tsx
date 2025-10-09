
"use client";

import { suggestActions } from "@/ai/flows/ai-suggested-actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoc } from "@/firebase";
import { saveAiSuggestion } from "@/firebase/firestore/ai-suggestions";
import { useFirestore } from "@/firebase/provider";
import { doc } from "firebase/firestore";
import { AlertCircle, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";

type AssistantState = {
  suggestedActions: string;
  pendingDeadlines: string;
};

const SUGGESTION_DOC_ID = "latest";

export function AIAssistant({ projectData }: { projectData: string }) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<AssistantState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const firestore = useFirestore();

  const suggestionRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "ai_suggestions", SUGGESTION_DOC_ID);
  }, [firestore]);

  const { data: savedSuggestion, loading } = useDoc(suggestionRef);

  const getSuggestions = () => {
    startTransition(async () => {
      setError(null);
      try {
        const result = await suggestActions({ projectData });
        if (firestore) {
          saveAiSuggestion(firestore, SUGGESTION_DOC_ID, result);
        }
        setState(result);
      } catch (e: any) {
        console.error(e);
        setError("Could not get AI suggestions. Please check your API key and try again.");
        setState(null);
      }
    });
  };

  useEffect(() => {
    if (!loading) {
      if (savedSuggestion) {
        setState(savedSuggestion as AssistantState);
      } else {
        getSuggestions();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, savedSuggestion, projectData]);

  if (error) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-destructive">
                <AlertCircle />
                <h3 className="font-semibold">Something went wrong</h3>
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" onClick={getSuggestions} disabled={isPending}>
                {isPending ? <RefreshCw className="animate-spin" /> : <RefreshCw />}
                Retry
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <Lightbulb className="text-primary" />
          AI Suggested Actions
        </h3>
        {loading || (isPending && !state) ? (
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
        {loading || (isPending && !state) ? (
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
