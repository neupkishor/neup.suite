import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Chatbot } from "./components/chatbot";

export default function SupportPage() {
  const knowledgeBase = `
    Onboarding Process:
    1. Register your company profile.
    2. Complete the KYC (Know Your Client) form.
    3. Upload required documents: Certificate of Incorporation, ID of directors.
    4. Our team reviews the documents (1-2 business days).
    5. Sign the digital master service agreement.
    6. Once signed, your account is fully active.

    Billing Cycles:
    - We bill on the 1st of every month for recurring services.
    - Project-based work is billed 50% upfront and 50% on completion.
    - Invoices are due within 15 days of receipt.
    - Accepted payment methods: Credit Card, Bank Transfer.

    Support Channels:
    - For urgent issues, use the in-app chat and tag @support.
    - For non-urgent questions, email support@neupsuite.com.
    - Our support hours are 9 AM to 6 PM UTC, Monday to Friday.
  `;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Knowledge Base AI</CardTitle>
          <CardDescription>
            Have a question? Ask our AI assistant for instant answers based on our
            internal documentation.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <Chatbot knowledgeBase={knowledgeBase} />
        </CardContent>
      </Card>
    </div>
  );
}
