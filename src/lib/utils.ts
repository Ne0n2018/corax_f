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

export function cleanSubcategories(input: any): string[] | null {
  if (!input) return null;

  let items: any[] = [];

  // 1. Если пришла строка, пробуем распарсить JSON (даже если он был застрингован дважды)
  if (typeof input === "string") {
    try {
      let parsed = JSON.parse(input);
      if (typeof parsed === "string") parsed = JSON.parse(parsed); // защита от двойной строки
      if (Array.isArray(parsed)) items = parsed;
    } catch {
      // Если это просто обычная одиночная строка-ID
      if (input.trim() && !input.includes("[")) {
        items = [input.trim()];
      }
    }
  } else if (Array.isArray(input)) {
    items = input;
  }

  // 2. Отбираем ТОЛЬКО валидные ID (длиной > 1 символа, без мусорных знаков)
  const validIds = items
      .flatMap((item) => {
        if (typeof item === "string" && (item.startsWith("[") || item.includes('"'))) {
          try {
            const p = JSON.parse(item);
            return Array.isArray(p) ? p : item;
          } catch {
            return item;
          }
        }
        return item;
      })
      .filter((item): item is string => {
        if (typeof item !== "string") return false;
        const trimmed = item.trim();
        // Настоящий ID категории всегда длиннее 1 символа и не содержит JSON-мусор
        return (
            trimmed.length > 1 &&
            !["[", "]", '"', "\\", ",", " "].some((badChar) => trimmed.includes(badChar))
        );
      });

  return validIds.length > 0 ? validIds : null;
}
