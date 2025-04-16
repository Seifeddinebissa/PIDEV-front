export interface User {
  id: number;
  username: string;
  email?: string;
  password?: string;
}

export interface Feedback {
  id: number;
  rating: number;
  comment: string;
  date: Date;
  formation_id: number;
  is_hidden?: boolean;
  user?: User; // Added user property
}