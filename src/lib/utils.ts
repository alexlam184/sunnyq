import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomInt(max: number) {
  // max-exclusive
  return Math.floor(Math.random() * max);
}

export function validateUsername(name: string) {
  name = name.trim();
  const minChars = 1;
  const maxChars = 15;
  const regex = new RegExp(`^[0-9a-zA-Z ]{${minChars},${maxChars}}$`);
  return name.match(regex);
}
