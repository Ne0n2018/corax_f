import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function splitDisplayName(displayName?: string) {
  if (!displayName?.trim()) {
    return { firstName: "-", lastName: "-" };
  }

  const parts = displayName.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || 'не указано'; // Если слово одно, parts.slice(1) вернет пустой массив, а join — ""

  return { firstName, lastName };
}

export function concatName (firstName: string, lastName: string) {
  if (lastName.length === 0) return firstName;
  return  lastName + ' ' + firstName;
}

export function formatDateToShort(dateInput?: string | Date | null): string {
  if (!dateInput) return '';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // Проверка на валидность даты
  if (isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()) // Две последние цифры года

  return `${day}.${month}.${year}`;
}
