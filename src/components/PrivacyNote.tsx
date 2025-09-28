import React from 'react';

interface PrivacyNoteProps {
  type?: 'age' | 'general';
  className?: string;
}

export const PrivacyNote: React.FC<PrivacyNoteProps> = ({ type = 'age', className = '' }) => {
  const messages = {
    age: "Your birthdate is never shown—only your age, quietly calculated.",
    general: "Your privacy is protected—sensitive information is never displayed publicly."
  };

  return (
    <p className={`text-xs text-muted-foreground ${className}`}>
      {messages[type]}
    </p>
  );
};