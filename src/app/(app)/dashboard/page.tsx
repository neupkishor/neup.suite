import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AIAssistant } from "./components/ai-assistant";
import { ProjectProgress } from "./components/project-progress";
import { AssignedTasks } from "./components/assigned-tasks";
import { UpcomingMilestones } from "./components/upcoming-milestones";
import { KeyContacts } from "./components/key-contacts";
import { PaymentStatus } from "./components/payment-status";

export default function DashboardPage() {
  const projectData = `
    - Project "Phoenix": 85% complete. UI/UX design phase finished. Backend development in progress. Next milestone: API integration (Due: 1 week).
    - Task "Create landing page mockups": Assigned to client for review. Pending feedback for 2 days.
    - Invoice #INV-2024-003: Amount $2,500. Due in 5 days.
    - Contract "Annual Maintenance": Renewal due in 25 days.
  `;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Welcome, Jane</CardTitle>
            <CardDescription>
              Here's a summary of your projects and pending actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIAssistant projectData={projectData} />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <PaymentStatus />
        <ProjectProgress />
      </div>
       <div className="space-y-6 lg:col-span-3">
         <AssignedTasks />
      </div>
       <div className="space-y-6 lg:col-span-2">
         <KeyContacts />
      </div>
       <div className="space-y-6">
        <UpcomingMilestones />
      </div>
    </div>
  );
}
