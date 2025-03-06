export interface Reclamation {
    id?: number;             // Optionnel pour la création
    subject: string;         // Sujet de la réclamation
    description: string;     // Description
    dateSubmitted: Date;     // Date de soumission
    status: string;          // Statut
  }