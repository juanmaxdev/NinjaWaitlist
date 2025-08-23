export default class AnswerRepository {
  constructor(connection) {
    this.conn = connection;
  }

  async addAnswer(userId, quizzId) {
    await this.conn.execute(
      "INSERT INTO answer (id_user, id_quizz) VALUES (?, ?)",
      [userId, quizzId]
    );
  }
}
