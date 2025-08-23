export type RiddleSecretJapanResponse = {
  correct: boolean;
  answer?: string;
};

export const postRiddleSecretJapan = async (answer: string): Promise<RiddleSecretJapanResponse> => {
  const url = '';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer }),
  });

  if (!response.ok) {
    throw new Error(`Hubo un error en la solicitud: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json();

  const payload = typeof raw?.body === 'string' ? JSON.parse(raw.body) : raw;

  if (typeof payload?.correct !== 'boolean') {
    throw new Error('Respuesta inválida: falta el boolean "correct"');
  }

  const result: RiddleSecretJapanResponse = {
    correct: payload.correct,
    ...(payload.correct && typeof payload.answer === 'string' && payload.answer.trim()
      ? { answer: payload.answer }
      : {}),
  };

  return result;
};
