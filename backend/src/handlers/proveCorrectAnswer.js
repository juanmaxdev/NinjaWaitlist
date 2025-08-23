import { getConnection } from "../db.js";
import QuizService from "../services/quizService.js";

export const handler = async (event) => {
  let connection;

  try {
    const body = JSON.parse(event.body || "{}");
    const { answer } = body;

    if (!answer) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing answer" }),
      };
    }

    connection = await getConnection();
    const quizService = new QuizService(connection);

    const result = await quizService.proveAnswer(answer);

    if (result){
      return {
        statusCode: 201,
        body: JSON.stringify({
          correct: result,
          answer: answer,
          }),
      }
    }else{
      return {
        statusCode: 201,
        body: JSON.stringify({
          correct: result
          }),
      }
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
