import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format ZOOZ amount in new format: 10z instead of ZOOZ 10
 */
export const formatZooz = (amount: number): string => {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}kz`;
  }
  return `${amount}z`;
};
