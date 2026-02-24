
'use client';
import { useState, useEffect } from 'react';
import { errorLogger, type AppError } from '@/lib/error-logger';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';

export default function ErrorLogPage() {
    const [errors, setErrors] = useState<AppError[]>([]);

    useEffect(() => {
        setErrors(errorLogger.getErrors());
        const unsubscribe = errorLogger.subscribe(setErrors);
        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-6">
            <CardHeader className="p-0">
                <CardTitle className="font-headline text-2xl">Error Log</CardTitle>
                <CardDescription>A list of errors that have occurred in the application for debugging.</CardDescription>
            </CardHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Application Error Log</CardTitle>
                    <CardDescription>
                        A list of errors that have occurred in the application.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {errors.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                           No errors logged yet.
                        </div>
                    ) : (
                        <Accordion type="single" collapsible className="w-full">
                            {errors.map((error, index) => (
                                <AccordionItem value={`item-${index}`} key={error.id}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between w-full pr-4">
                                        <span className="truncate font-mono text-sm">{error.message}</span>
                                        <span className="text-xs text-muted-foreground flex-shrink-0">{format(error.timestamp, 'Pp')}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                    <div className='p-4 bg-muted/50 rounded-md'>
                                            <h4 className="font-semibold">Context</h4>
                                            {error.context ? (
                                                <pre className="mt-2 text-xs bg-background p-2 rounded-sm overflow-auto">
                                                    {JSON.stringify(error.context, null, 2)}
                                                </pre>
                                            ) : <p className="text-xs text-muted-foreground">No context provided.</p>}
                                            
                                            <h4 className="font-semibold mt-4">Stack Trace</h4>
                                            <pre className="mt-2 text-xs bg-background p-2 rounded-sm overflow-auto">
                                                {error.stack || "No stack trace available."}
                                            </pre>
                                    </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
