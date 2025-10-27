/// <reference types="vite/client" />

export const capitalise = (word: string | null): string => {
  if (!word || typeof word !== 'string') return '';
  const firstWord = word.slice(0, 1).toUpperCase();
  const remaining = word.slice(1).toLowerCase();
  return (firstWord + remaining) || '';
};

// Typed access to Vite env. Falls back to empty string when the var is not set.
export const backend_url: string = import.meta.env.VITE_API_URL ?? '';