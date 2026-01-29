import { z } from 'zod';

// Task A-2: Strict validation for the onboarding flow
export const wizardSchema = z.object({
  // Step 1: Identity (min 2 chars enforced)
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  
  // Step 2: Location (mandatory selection)
  region: z.string().min(1, "Region is required"),
  city: z.string().min(1, "City is required"),
  
  // Step 3: Role (mandatory selection)
  userRoles: z.array(z.string()).min(1, "Please select at least one role"),
});

export type WizardSchema = z.infer<typeof wizardSchema>;