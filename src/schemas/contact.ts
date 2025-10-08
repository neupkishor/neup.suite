
import { z } from 'zod';

export const contactNameSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

export const contactEmailSchema = z.object({
  label: z.string().optional(),
  email: z.string().email('Invalid email address').or(z.literal('')),
});

export const contactPhoneSchema = z.object({
  label: z.string().optional(),
  phone: z.string().optional(),
});

export const contactAddressSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
});

export const contactSocialProfileSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    url: z.string().url('Invalid URL'),
});

export const contactMessagingSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    address: z.string().min(1, 'Address is required'),
});

export const contactDateSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    date: z.date(),
});


export const contactSchema = z.object({
  name: contactNameSchema.refine(
    (data) => !!data.firstName || !!data.lastName,
    {
      message: 'At least a first name or last name is required.',
      path: ['firstName'], 
    }
  ),
  role: z.string().optional(),
  emails: z.array(contactEmailSchema).optional(),
  phoneNumbers: z.array(contactPhoneSchema).optional(),
  addresses: z.array(contactAddressSchema).optional(),
  socialProfiles: z.array(contactSocialProfileSchema).optional(),
  messaging: z.array(contactMessagingSchema).optional(),
  importantDates: z.array(contactDateSchema).optional(),
  notes: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export type Contact = z.infer<typeof contactSchema>;

    