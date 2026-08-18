import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidLatitude(lat: number) {
  return Number.isFinite(lat) && lat >= -90 && lat <= 90
}

export function isValidLongitude(lng: number) {
  return Number.isFinite(lng) && lng >= -180 && lng <= 180
}

export function isValidCoordinate(lat: number, lng: number) {
  return isValidLatitude(lat) && isValidLongitude(lng)
}
