export interface Feedback {
    id: number;
    rating: number;
    comment: string;
    date: Date; 
    formation_id: number; 
    is_hidden?: boolean;
  }