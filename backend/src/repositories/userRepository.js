export default class UserRepository {
  constructor(connection) {
    this.conn = connection;
  }

  async createUser(mail) {
    const [result] = await this.conn.execute(
      "INSERT INTO users (mail) VALUES (?)",
      [mail]
    );
    return result.insertId;
  }
}
