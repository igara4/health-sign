import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatToJST = (utcString: string): string => {
  if (!utcString) return "";

  const normalized = utcString.endsWith("Z") ? utcString : `${utcString}Z`;
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return "";

  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000); //UTC＋9時間の処理
  return jst.toISOString().slice(0, 16).replace("T", " ");
};
