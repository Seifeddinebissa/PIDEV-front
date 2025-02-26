import { Cours } from "./cours";
import { Question } from "./Question";
import { ScoreQuiz } from "./ScoreQuiz";
export class Quiz {
    idQuiz!: number;
    titre!: string;
    description!: string;
    cours!: Cours;  // Association avec un cours
    questions!: Question[];  // Liste des questions
    scores!: ScoreQuiz[]; 

  }