import { Quiz } from "./Quiz";

export class Cours {
    idCours!: number;
    titre!: string;
    description!: string;
    image!: string;
    enrollment!: number;
    contenu!: string[];  // Liste de chaînes de caractères
    idUser!: number;  // Stocke seulement l'ID de l'utilisateur
    quizList!: Quiz[]; 
    
    constructor() {}// Liste des quiz associés
  }
  