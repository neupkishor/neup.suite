import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export function AssignedTasks() {
  const tasks = [
    { id: "task1", label: "Review landing page mockups", priority: "High" },
    { id: "task2", label: "Provide feedback on copy", priority: "Medium" },
    { id: "task3", label: "Submit final brand assets", priority: "Low" },
    { id: "task4", label: "Approve Q3 budget", priority: "High" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Your Tasks</CardTitle>
        <CardDescription>Actions waiting for your input.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 rounded-lg border p-3">
            <Checkbox id={task.id} className="mt-1" />
            <div className="grid gap-0.5">
                <label htmlFor={task.id} className="text-sm font-medium leading-none cursor-pointer">
                    {task.label}
                </label>
            </div>
            <Badge variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "secondary" : "outline"} className="ml-auto shrink-0">
              {task.priority}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
