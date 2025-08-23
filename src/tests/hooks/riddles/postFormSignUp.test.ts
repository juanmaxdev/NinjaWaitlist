import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postFormSignUp, UserDataProps } from '../../../hooks/riddles';

describe('postFormSignUp', () => {
  const mockData: UserDataProps = { mail: 'test@example.com' };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return message when response is successful', async () => {
    const fakeResponse = { message: 'Usuario creado correctamente' };
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ body: JSON.stringify(fakeResponse) }),
        } as Response)
      )
    );

    const result = await postFormSignUp(mockData);
    expect(result).toBe(fakeResponse.message);
    expect(fetch).toHaveBeenCalledWith(
      'https://alrb7n2xna.execute-api.eu-west-2.amazonaws.com/Dev/user',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockData),
      })
    );
  });

  it('should throw specific error on 503 status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, status: 503, statusText: 'Service Unavailable' } as Response))
    );

    await expect(postFormSignUp(mockData)).rejects.toThrow('Este email ya ha sido introducido.');
  });

  it('should throw generic error on other HTTP errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, status: 400, statusText: 'Bad Request' } as Response))
    );

    await expect(postFormSignUp(mockData)).rejects.toThrow('Hubo un error en la solicitud: 400 Bad Request');
  });

  it('should throw error if response message is missing', async () => {
    const fakeResponse = { notMessage: 'oops' };
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ body: JSON.stringify(fakeResponse) }),
        } as Response)
      )
    );

    await expect(postFormSignUp(mockData)).rejects.toThrow('Respuesta inválida: falta el campo "message"');
  });

  it('should handle response.body as object directly', async () => {
    const fakeResponse = { message: 'Direct object message' };
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fakeResponse),
        } as Response)
      )
    );

    const result = await postFormSignUp(mockData);
    expect(result).toBe(fakeResponse.message);
  });
});
