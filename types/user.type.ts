import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name too long")
        .regex(/^[a-zA-Z0-9\s]+$/, "Name can only contain letters, numbers, and spaces"),
    email: z.email("Invalid email format").nonempty("Email is required").toLowerCase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    profileImageUrl: z.string("Invalid URL format").optional(),

    isVerified: z.boolean().default(false),
    otp: z.string().optional(),
    otpExpiry: z.date().optional(),

    educationLevel: z.enum(['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Other']).optional(),

    //TODO: Decided by AI later by parsing CV
    experienceLevel: z.enum(['Fresher', 'Junior', 'Mid', 'Senior']).default('Fresher'),
    cvText: z.string().optional(),

    // TODO: Added by AI later by parsing CV and separate object for easier querying
    skills: z.array(z.string()).default([]),
    experiences: z.array(z.string()).default([]),
    desiredJobRoles: z.array(z.string()).default([]),
    desiredLocations: z.array(z.string()).default([]),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type SafeUser = Omit<User, 'password' | 'otp' | 'otpExpiry' | 'googleId'>;