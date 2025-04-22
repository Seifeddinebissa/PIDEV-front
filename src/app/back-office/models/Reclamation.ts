export interface Reclamation {
    id?: number;             // Optionnel pour la création
    subject: string;         // Sujet de la réclamation
    description: string;     // Description
    dateSubmitted: Date;     // Date de soumission
    status: string;          // Statut
    //solution?: string;       // Solution textuelle (optionnelle)
    solutionPdfPath?: string; // Chemin du fichier PDF de la solution (optionnel)
    userId?: number;         // ID de l'utilisateur (optionnel)
  }