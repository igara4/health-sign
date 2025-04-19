import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatToJST = (utcString: string) => {
  const date = new Date(utcString);
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000); //UTC＋9時間の処理
  return jst.toISOString().slice(0, 16).replace("T", " ");
};
