import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

type ClassValue = string | undefined | null | false | Record<string, boolean>

export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes))
}
