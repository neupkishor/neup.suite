
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FolderKanban, CheckSquare, FileText, Receipt, LifeBuoy, Users, Contact, Target, BarChart, MessageCircle, Megaphone, Lightbulb, Bot } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const features = [
    { icon: FolderKanban, title: "Project Management", description: "Organize, track, and manage projects from start to finish with powerful Kanban boards and lists." },
    { icon: CheckSquare, title: "Task Tracking", description: "Create, assign, and monitor tasks with sub-tasks, deadlines, and multiple assignees." },
    { icon: FileText, title: "Document Repository", description: "A centralized place for all your files, contracts, and assets with version control." },
    { icon: Receipt, title: "Billing & Invoicing", description: "Streamline your finances with integrated invoicing, payment tracking, and billing history." },
    { icon: Users, title: "Team & Client Management", description: "Manage your team members and client contacts in one organized directory." },
    { icon: MessageCircle, title: "Discussions & Feedback", description: "Foster collaboration with threaded discussions and a dedicated space for client feedback." },
    { icon: Bot, title: "AI-Powered Assistance", description: "Get intelligent suggestions for next steps and answers to common questions with our integrated AI." },
    { icon: Target, title: "Goals & Milestones", description: "Set, track, and achieve your project goals and important milestones with clarity." },
];

const faqs = [
  { question: "Is there a free trial available?", answer: "Yes, we offer a 14-day free trial on our Pro plan. No credit card required to get started." },
  { question: "Can I switch plans later?", answer: "Absolutely! You can upgrade, downgrade, or cancel your plan at any time from your account settings." },
  { question: "How does the client portal work?", answer: "Your clients get a secure, branded portal where they can view project progress, access files, pay invoices, and communicate with your team." },
  { question: "Is my data secure?", answer: "We take data security seriously. All data is encrypted in transit and at rest, and we use industry-standard security practices to protect your information." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
        <section className="w-full bg-background">
            <div className="container mx-auto max-w-[1440px] py-20 text-center sm:py-32">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline">
                    The All-in-One <span className="text-primary">Client Collaboration</span> Platform
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                    Stop juggling dozens of tools. Neup.Suite brings projects, communication, billing, and file sharing into one streamlined workspace for you and your clients.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/home">Get Started for Free</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#">Request a Demo</Link>
                    </Button>
                </div>
            </div>
        </section>

        <section id="features" className="w-full bg-muted/50 py-16 sm:py-24">
            <div className="container mx-auto max-w-[1440px]">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Everything You Need to Succeed</h2>
                    <p className="mt-4 text-lg text-muted-foreground">One platform to run your entire client-based business.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <Card key={feature.title} className="text-center">
                            <CardHeader>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-lg font-bold">{feature.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        <section id="testimonials" className="w-full bg-background py-16 sm:py-24">
             <div className="container mx-auto max-w-[1440px]">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Loved by Agencies and Freelancers</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Don't just take our word for it. Here's what our customers say.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <p className="italic">"Neup.Suite has revolutionized how we manage our clients. Everything is in one place, and our clients love the transparency of the portal."</p>
                            <div className="mt-4 flex items-center gap-4">
                                <Avatar><AvatarImage src="https://picsum.photos/seed/t1/40/40" alt="Sarah J." /><AvatarFallback>SJ</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-semibold">Sarah Jennings</p>
                                    <p className="text-sm text-muted-foreground">CEO, Creative Minds Agency</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                             <p className="italic">"As a freelancer, staying organized is key. This tool saves me hours every week on admin tasks so I can focus on billable work."</p>
                             <div className="mt-4 flex items-center gap-4">
                                <Avatar><AvatarImage src="https://picsum.photos/seed/t2/40/40" alt="Mark R." /><AvatarFallback>MR</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-semibold">Mark Reynolds</p>
                                    <p className="text-sm text-muted-foreground">Freelance Web Developer</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <p className="italic">"The AI assistant is a game-changer. It helps us stay ahead of deadlines and provides actionable insights we wouldn't have seen otherwise."</p>
                            <div className="mt-4 flex items-center gap-4">
                                <Avatar><AvatarImage src="https://picsum.photos/seed/t3/40/40" alt="Emily K." /><AvatarFallback>EK</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-semibold">Emily Carter</p>
                                    <p className="text-sm text-muted-foreground">Project Manager, TechForward</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section id="pricing" className="w-full bg-muted/50 py-16 sm:py-24">
            <div className="container mx-auto max-w-[1440px]">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Simple, Transparent Pricing</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Choose the plan that's right for your business.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-headline">Starter</CardTitle>
                            <p className="text-4xl font-bold">$49<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 5 projects</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 3 Team Members</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Client Portal</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Support</li>
                            </ul>
                        </CardContent>
                        <CardFooter><Button className="w-full">Choose Starter</Button></CardFooter>
                    </Card>
                     <Card className="border-primary ring-2 ring-primary">
                        <CardHeader className="text-center">
                            <Badge className="w-fit mx-auto mb-2">Most Popular</Badge>
                            <CardTitle className="text-2xl font-headline">Pro</CardTitle>
                            <p className="text-4xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Projects</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 10 Team Members</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> AI Assistant</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> White-Labeling</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                            </ul>
                        </CardContent>
                        <CardFooter><Button className="w-full">Choose Pro</Button></CardFooter>
                    </Card>
                     <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-headline">Enterprise</CardTitle>
                            <p className="text-4xl font-bold">Contact Us</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Everything in Pro</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Team Members</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Dedicated Account Manager</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced Security & SSO</li>
                            </ul>
                        </CardContent>
                        <CardFooter><Button variant="outline" className="w-full">Contact Sales</Button></CardFooter>
                    </Card>
                </div>
            </div>
        </section>

        <section id="faq" className="w-full bg-background py-16 sm:py-24">
            <div className="container mx-auto max-w-4xl">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full mt-12">
                    {faqs.map((faq, i) => (
                        <AccordionItem value={`item-${i}`} key={i}>
                            <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>

        <section className="w-full bg-primary text-primary-foreground">
            <div className="container mx-auto max-w-[1440px] py-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Ready to transform your client workflow?</h2>
                <p className="mt-4 text-lg opacity-90">Start your free trial today. No credit card required.</p>
                <div className="mt-8">
                     <Button size="lg" variant="secondary" asChild>
                        <Link href="/home">Get Started Now</Link>
                    </Button>
                </div>
            </div>
        </section>
    </div>
  );
}
