
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarIcon, Loader2, Trash2, PlusCircle } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { contactSchema, type Contact } from '@/schemas/contact';
import { addContact } from '@/actions/contacts/add-contact';
import { updateContact } from '@/actions/contacts/update-contact';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

type ContactFormValues = z.infer<typeof contactSchema>;

// Convert date strings to Date objects for form
const prepareDataForForm = (contact?: Contact & { id?: string }): ContactFormValues => {
    if (!contact) {
        return {
            name: { firstName: '', middleName: '', lastName: '' },
            role: '',
            avatarUrl: '',
            notes: '',
            emails: [],
            phoneNumbers: [],
            addresses: [],
            socialProfiles: [],
            messaging: [],
            importantDates: [],
        };
    }
    return {
        ...contact,
        name: {
            firstName: contact.name.firstName || '',
            middleName: contact.name.middleName || '',
            lastName: contact.name.lastName || '',
        },
        role: contact.role || '',
        avatarUrl: contact.avatarUrl || '',
        notes: contact.notes || '',
        importantDates: contact.importantDates?.map(d => ({
            ...d,
            date: new Date(d.date),
        })) || [],
    };
}


export function ContactForm({ contact }: { contact?: Contact & {id: string} }) {
  const firestore = useFirestore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: prepareDataForForm(contact),
  });

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control: form.control, name: 'emails' });
  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: 'phoneNumbers' });
  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({ control: form.control, name: 'addresses' });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: 'socialProfiles' });
  const { fields: messagingFields, append: appendMessaging, remove: removeMessaging } = useFieldArray({ control: form.control, name: 'messaging' });
  const { fields: dateFields, append: appendDate, remove: removeDate } = useFieldArray({ control: form.control, name: 'importantDates' });

  useEffect(() => {
    if (contact) {
      form.reset(prepareDataForForm(contact));
    }
  }, [contact, form]);

  async function onSubmit(values: ContactFormValues) {
    if (!firestore) return;
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Convert dates back to string format if necessary for Firestore
    const dataToSubmit = {
        ...values,
        importantDates: values.importantDates?.map(d => ({
            ...d,
            date: format(d.date, 'yyyy-MM-dd'),
        }))
    }

    try {
      if (contact?.id) {
        await updateContact(firestore, contact.id, dataToSubmit as any);
      } else {
        await addContact(firestore, dataToSubmit as any);
      }
      router.push('/contacts');
    } catch (error) {
      console.error(error)
      setIsSubmitting(false);
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        
        <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className='space-y-4'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="name.firstName" render={({ field }) => (
                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="Jane" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="name.middleName" render={({ field }) => (
                        <FormItem><FormLabel>Middle Name</FormLabel><FormControl><Input placeholder="" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="name.lastName" render={({ field }) => (
                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem><FormLabel>Role / Job Title</FormLabel><FormControl><Input placeholder="e.g. Project Manager" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                    <FormItem><FormLabel>Photo URL</FormLabel><FormControl><Input placeholder="https://example.com/photo.jpg" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <FormLabel>Email Addresses</FormLabel>
                    {emailFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end mt-2">
                           <FormField control={form.control} name={`emails.${index}.label`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="text-xs">Label</FormLabel><FormControl><Input placeholder="Work" {...field} /></FormControl></FormItem>
                           )}/>
                           <FormField control={form.control} name={`emails.${index}.email`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="text-xs">Email</FormLabel><FormControl><Input placeholder="jane.doe@example.com" {...field} /></FormControl></FormItem>
                           )}/>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeEmail(index)}><Trash2/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendEmail({label: '', email: ''})}><PlusCircle className="mr-2"/> Add Email</Button>
                </div>
                 <div>
                    <FormLabel>Phone Numbers</FormLabel>
                    {phoneFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end mt-2">
                           <FormField control={form.control} name={`phoneNumbers.${index}.label`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="text-xs">Label</FormLabel><FormControl><Input placeholder="Mobile" {...field} /></FormControl></FormItem>
                           )}/>
                           <FormField control={form.control} name={`phoneNumbers.${index}.phone`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="text-xs">Number</FormLabel><FormControl><Input placeholder="+1 (555) 123-4567" {...field} /></FormControl></FormItem>
                           )}/>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removePhone(index)}><Trash2/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendPhone({label: '', phone: ''})}><PlusCircle className="mr-2"/> Add Phone Number</Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Other Online Profiles</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <FormLabel>Social Profiles</FormLabel>
                    {socialFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end mt-2">
                           <FormField control={form.control} name={`socialProfiles.${index}.label`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="text-xs">Platform</FormLabel><FormControl><Input placeholder="LinkedIn" {...field} /></FormControl></FormItem>
                           )}/>
                           <FormField control={form.control} name={`socialProfiles.${index}.url`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="text-xs">URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/username" {...field} /></FormControl></FormItem>
                           )}/>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeSocial(index)}><Trash2/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendSocial({label: '', url: ''})}><PlusCircle className="mr-2"/> Add Social Profile</Button>
                </div>
                <div>
                    <FormLabel>Messaging Apps</FormLabel>
                    {messagingFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end mt-2">
                           <FormField control={form.control} name={`messaging.${index}.label`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="text-xs">App</FormLabel><FormControl><Input placeholder="WhatsApp" {...field} /></FormControl></FormItem>
                           )}/>
                           <FormField control={form.control} name={`messaging.${index}.address`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="text-xs">Username/ID</FormLabel><FormControl><Input placeholder="+15551234567" {...field} /></FormControl></FormItem>
                           )}/>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeMessaging(index)}><Trash2/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendMessaging({label: '', address: ''})}><PlusCircle className="mr-2"/> Add Messaging App</Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Additional Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <FormLabel>Important Dates</FormLabel>
                    {dateFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-end mt-2">
                           <FormField control={form.control} name={`importantDates.${index}.label`} render={({ field }) => (
                                <FormItem className="flex-1"><FormLabel className="text-xs">Label</FormLabel><FormControl><Input placeholder="Birthday" {...field} /></FormControl></FormItem>
                           )}/>
                            <FormField control={form.control} name={`importantDates.${index}.date`} render={({ field }) => (
                                <FormItem className="flex flex-col flex-1"><FormLabel className="text-xs">Date</FormLabel>
                                <Popover><PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                        {field.value ? (format(field.value, 'PPP')) : (<span>Pick a date</span>)}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                </Popover><FormMessage /></FormItem>
                           )}/>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeDate(index)}><Trash2/></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendDate({label: '', date: new Date()})}><PlusCircle className="mr-2"/> Add Date</Button>
                </div>
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea placeholder="Any relevant notes about this contact..." {...field} rows={5} /></FormControl><FormMessage /></FormItem>
                )}/>
            </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {contact ? 'Update Contact' : 'Save Contact'}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contacts">Cancel</Link>
          </Button>
        </div>
        {submitError && (
          <p className="text-sm font-medium text-destructive">
            {submitError}
          </p>
        )}
      </form>
    </Form>
  );
}

    