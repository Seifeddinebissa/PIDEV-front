
import { Quiz } from "./Quiz";
import { Reponse } from "./Reponse";

export class Question {
    idQuestion!: number;
    contenu!: string;
    score!: number;
    correctAnswer!: CorrectAnswer;
    quiz!: Quiz;  // Association avec un quiz
    reponses!: Reponse[];  // Liste des réponses possibles
  }
  
  // Enum pour les réponses correctes
  export enum CorrectAnswer {
    A = "A",
    B = "B",
    C = "C",
    D = "D"
  }