import { Cours } from "./cours";
import { ScoreQuiz } from "./ScoreQuiz";

export class User {
  idUser!: number;
  nom!: string;
  coursList!: Cours[];  // Liste des cours associés
  scores!: ScoreQuiz[];  // Liste des scores de quiz associés
}
