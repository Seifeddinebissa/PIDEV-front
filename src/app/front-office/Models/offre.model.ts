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
  application?: Application;
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
  latitude?:number;
  longitude?: number;
}

export interface Favorite {
  id: number;
  studentId: number;
  offre: Offre;
}

export interface Application {
  id: number;
  studentId: number;
  offre: Offre;
  status?: string;
  appointment?: Appointment;
  
}

export interface Appointment {
  id: number;
  interviewDate: string; // ISO format from backend
  location: string;
  details: string;
  calendarEventId?: string;
}
