import { SafeUrl } from "@angular/platform-browser";

export interface Entreprise {
    id?: number;
    name: string;
    sector: string;
    location: string;
    description: string;
    email: string;
    phone: string;
    website?: string;
    logo?: string | SafeUrl;
    latitude?:number;
    longitude?: number;
  }

  export interface PageResponse<T> {
    forEach(arg0: (entreprise: any) => void): unknown;
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // Current page (0-based)
    size: number;   // Items per page
  }
  