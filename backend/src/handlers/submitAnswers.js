import { getConnection } from "../db.js";
import QuizService from "../services/quizService.js";

export const handler = async (event) => {
  let connection;

  try {
    const body = JSON.parse(event.body || "{}");
    const { mail, riddleSecretJapan, riddleRainLetters } = body;

    if (!mail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing mail" }),
      };
    }

    connection = await getConnection();
    const quizService = new QuizService(connection);

    const result = await quizService.submitAnswers(mail, riddleSecretJapan, riddleRainLetters);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "All correct",
        result,
      }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Backend error" }),
    };
  } finally {
    if (connection) await connection.end();
  }
};
