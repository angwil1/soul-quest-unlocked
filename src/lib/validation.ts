import { z } from "zod";

// Malicious content detection
const containsMaliciousContent = (content: string): boolean => {
  if (!content || typeof content !== 'string') return false;
  
  const maliciousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /data:(?!image\/)/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<link/gi,
    /<meta/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /@import/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi,
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(content));
};

// Basic spam detection
const containsSpam = (content: string): boolean => {
  if (!content || typeof content !== 'string') return false;
  
  const spamPatterns = [
    /(.)\1{10,}/g, // Repeated characters
    /https?:\/\/[^\s]{20,}/g, // Long URLs
    /(buy now|click here|free money|guaranteed|act now)/gi,
    /[A-Z]{5,}.*[A-Z]{5,}/g, // Excessive caps
  ];
  
  // Check for excessive URLs
  const urlCount = (content.match(/https?:\/\/\S+/g) || []).length;
  if (urlCount > 2) return true;
  
  return spamPatterns.some(pattern => pattern.test(content));
};

// Check for common password patterns
const containsCommonPatterns = (password: string): boolean => {
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /monkey/i,
    /dragon/i,
  ];
  
  return commonPatterns.some(pattern => pattern.test(password));
};

// Enhanced user profile validation schemas with security
export const profileSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
    .refine(content => !containsMaliciousContent(content), "Invalid content detected"),
  
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .refine(content => !containsMaliciousContent(content), "Invalid content detected")
    .refine(content => !containsSpam(content), "Bio appears to be spam")
    .optional(),
  
  age: z.number()
    .min(18, "Must be at least 18 years old")
    .max(120, "Age must be realistic")
    .optional(),
  
  location: z.string()
    .max(100, "Location must be less than 100 characters")
    .regex(/^[a-zA-Z\s,.-]+$/, "Location contains invalid characters")
    .refine(content => !containsMaliciousContent(content), "Invalid content detected")
    .optional(),
  
  occupation: z.string()
    .max(100, "Occupation must be less than 100 characters")
    .refine(content => !containsMaliciousContent(content), "Invalid content detected")
    .optional(),
  
  education: z.string()
    .max(100, "Education must be less than 100 characters")
    .refine(content => !containsMaliciousContent(content), "Invalid content detected")
    .optional(),
  
  interests: z.array(z.string()
    .min(1, "Interest cannot be empty")
    .max(50, "Interest must be less than 50 characters")
    .refine(interest => !containsMaliciousContent(interest), "Invalid interest detected")
  ).max(20, "Maximum 20 interests allowed").optional(),
  
  photos: z.array(z.string().url("Invalid photo URL"))
    .max(10, "Maximum 10 photos allowed")
    .optional(),
});

// Enhanced message validation with comprehensive security
export const messageSchema = z.object({
  content: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be less than 1000 characters")
    .refine(content => !containsMaliciousContent(content), "Invalid content detected")
    .refine(content => !containsSpam(content), "Message appears to be spam"),
});

// Quiet note validation with enhanced security
export const quietNoteSchema = z.object({
  note: z.string()
    .min(10, "Note must be at least 10 characters")
    .max(375, "Note must be less than 375 characters")
    .refine(content => !containsMaliciousContent(content), "Invalid content detected")
    .refine(content => !containsSpam(content), "Note appears to be spam"),
});

// Report validation schema
export const reportSchema = z.object({
  reason: z.string().min(1, "Please select a reason"),
  description: z.string()
    .max(1000, "Details must be less than 1000 characters")
    .refine(content => !containsMaliciousContent(content), "Invalid content detected")
    .optional(),
});

// Enhanced sanitization helper with comprehensive cleaning
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/data:(?!image\/)/gi, '') // Remove data: URLs (except images)
    .replace(/vbscript:/gi, '') // Remove vbscript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/expression\s*\(/gi, '') // Remove CSS expressions
    .replace(/url\s*\(/gi, '') // Remove CSS url()
    .replace(/@import/gi, '') // Remove CSS @import
    .replace(/eval\s*\(/gi, '') // Remove eval calls
    .replace(/Function\s*\(/gi, '') // Remove Function constructor
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .trim();
};

// Secure content sanitization for database storage
export const sanitizeForStorage = (input: string): string => {
  const sanitized = sanitizeInput(input);
  return sanitized.substring(0, 5000); // Limit length for storage
};

// Enhanced email validation with security checks
export const emailSchema = z.string()
  .email("Invalid email address")
  .max(254, "Email too long")
  .refine(email => !email.includes('<') && !email.includes('>'), "Invalid email format")
  .refine(email => !containsMaliciousContent(email), "Invalid email content");

// Enhanced password validation with security patterns
export const passwordSchema = z.string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    "Password must contain uppercase, lowercase, number, and special character")
  .refine(password => !containsCommonPatterns(password), "Password is too common or predictable");

// Export security helper functions
export { containsMaliciousContent, containsSpam };