export const capitalise = (word: string | null): string => {
  if (!word || typeof word !== "string") return "";
  const firstWord = word.slice(0, 1).toUpperCase();
  const remaining = word.slice(1).toLowerCase();
  return (firstWord + remaining) || "";
}