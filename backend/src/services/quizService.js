import UserRepository from "../repositories/userRepository.js";
import AnswerRepository from "../repositories/answerRepository.js";

export default class QuizService {
  constructor(connection) {
    this.userRepo = new UserRepository(connection);
    this.answerRepo = new AnswerRepository(connection);
  }

  async submitAnswers(mail, quizz1, quizz2) {
    const userId = await this.userRepo.createUser(mail);

    if (quizz1 === "ニンジャ") {
      await this.answerRepo.addAnswer(userId, 1); 
    }
    if (quizz2 === "shinobi") {
      await this.answerRepo.addAnswer(userId, 2); 
    }

    return { userId, quizz1, quizz2 };
  }

  async proveAnswer(answer) {
      if (answer === "ニンジャ"){
        return true;
      }
      return false;
  }
}
