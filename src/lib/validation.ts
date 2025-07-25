import { z } from "zod";

// User profile validation schemas
export const profileSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
  
  age: z.number()
    .min(18, "Must be at least 18 years old")
    .max(120, "Age must be realistic")
    .optional(),
  
  location: z.string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  
  occupation: z.string()
    .max(100, "Occupation must be less than 100 characters")
    .optional(),
  
  education: z.string()
    .max(100, "Education must be less than 100 characters")
    .optional(),
  
  interests: z.array(z.string()
    .min(1, "Interest cannot be empty")
    .max(50, "Interest must be less than 50 characters")
  ).max(20, "Maximum 20 interests allowed").optional(),
  
  photos: z.array(z.string().url("Invalid photo URL"))
    .max(10, "Maximum 10 photos allowed")
    .optional(),
});

// Message validation
export const messageSchema = z.object({
  content: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be less than 1000 characters")
    .refine(
      (content) => !/<script|javascript:|on\w+=/i.test(content),
      "Message contains potentially harmful content"
    ),
});

// Sanitization helper
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Email validation
export const emailSchema = z.string()
  .email("Invalid email address")
  .max(254, "Email too long");

// Password validation (stronger requirements)
export const passwordSchema = z.string()
  .min(12, "Password must be at least 12 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    "Password must contain uppercase, lowercase, number, and special character");