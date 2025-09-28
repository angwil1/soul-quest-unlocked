/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string | Date): number => {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Check if user meets minimum age requirement
 */
export const meetsAgeRequirement = (dateOfBirth: string | Date, minAge: number = 18): boolean => {
  return calculateAge(dateOfBirth) >= minAge;
};

/**
 * Format date of birth for display (without revealing actual birth date)
 */
export const formatAgeForDisplay = (dateOfBirth: string | Date): string => {
  const age = calculateAge(dateOfBirth);
  return `${age} years old`;
};