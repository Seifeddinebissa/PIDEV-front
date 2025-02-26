import { Question } from "./Question";

export class Reponse {
  idReponse!: number;
  contenu!: string;
  isCorrect!: boolean;
  question!: Question;  // Association avec une question
}