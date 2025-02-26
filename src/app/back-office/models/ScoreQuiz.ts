
import { Quiz } from "./Quiz";
import { User } from "./User";

export class ScoreQuiz {
  idScoreQuiz!: number;
  score!: number;
  user!: User;    // Association avec un utilisateur
  quiz!: Quiz;  // Association avec un quiz
}
