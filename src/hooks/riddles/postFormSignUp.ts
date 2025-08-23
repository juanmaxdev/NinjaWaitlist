export type UserDataProps = {
  mail: string;
  riddleSecretJapan?: string;
  riddleRainLetters?: string;
};

export type FormSignUpResponse = {
  message: string;
  [key: string]: unknown;
};

export const postFormSignUp = async (data: UserDataProps): Promise<string> => {
  const url = '';

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 503) {
      throw new Error('Este email ya ha sido introducido.');
    } else {
      throw new Error(`Hubo un error en la solicitud: ${response.status} ${response.statusText}`);
    }
  }

  const raw = await response.json();
  const payload: FormSignUpResponse = typeof raw?.body === 'string' ? JSON.parse(raw.body) : raw;

  if (!payload?.message || typeof payload.message !== 'string') {
    throw new Error('Respuesta inválida: falta el campo "message"');
  }

  return payload.message;
};
