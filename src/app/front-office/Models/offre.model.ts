// src/app/front-office/Models/offre.model.ts
export interface Offre {
  id: number;
  title: string;
  description: string;
  salary: number;
  location: string;
  datePosted: string;
  dateExpiration: string;
  contractType: string;
  experienceLevel: string;
  jobFunction: string;
  jobType: string;
  jobShift: string;
  jobSchedule: string;
  educationLevel: string;
  entrepriseId: number;
  entreprise?: Entreprise;
  favorites: Favorite[]; // Replace isFavorite with favorites to match backend
}

export interface Entreprise {
  id: number;
  name?: string; // Optional, add if returned by backend
  sector?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
}

export interface Favorite {
  id: number;
  studentId: number;
  offre: Offre;
}