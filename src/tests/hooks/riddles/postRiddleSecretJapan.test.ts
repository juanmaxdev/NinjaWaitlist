import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postRiddleSecretJapan } from '../../../hooks/riddles';

describe('postRiddleSecretJapan', () => {
  const mockAnswer = 'SHINOBI';

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return correct=true with answer', async () => {
    const fakeResponse = { correct: true, answer: 'SHINOBI' };
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ body: JSON.stringify(fakeResponse) }),
        } as Response)
      )
    );

    const result = await postRiddleSecretJapan(mockAnswer);
    expect(result).toEqual(fakeResponse);
    expect(fetch).toHaveBeenCalledWith(
      'https://alrb7n2xna.execute-api.eu-west-2.amazonaws.com/Dev/answer',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: mockAnswer }),
      })
    );
  });

  it('should return correct=true without answer if missing or empty', async () => {
    const fakeResponse = { correct: true };
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ body: JSON.stringify(fakeResponse) }),
        } as Response)
      )
    );

    const result = await postRiddleSecretJapan(mockAnswer);
    expect(result).toEqual({ correct: true });
  });

  it('should return correct=false', async () => {
    const fakeResponse = { correct: false };
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ body: JSON.stringify(fakeResponse) }),
        } as Response)
      )
    );

    const result = await postRiddleSecretJapan(mockAnswer);
    expect(result).toEqual({ correct: false });
  });

  it('should throw error on non-ok HTTP response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, status: 400, statusText: 'Bad Request' } as Response))
    );

    await expect(postRiddleSecretJapan(mockAnswer)).rejects.toThrow('Hubo un error en la solicitud: 400 Bad Request');
  });

  it('should throw error if response missing "correct"', async () => {
    const fakeResponse = { answer: 'SHINOBI' };
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ body: JSON.stringify(fakeResponse) }),
        } as Response)
      )
    );

    await expect(postRiddleSecretJapan(mockAnswer)).rejects.toThrow('Respuesta inválida: falta el boolean "correct"');
  });

  it('should handle response.body as object directly', async () => {
    const fakeResponse = { correct: true, answer: 'SHINOBI' };
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fakeResponse),
        } as Response)
      )
    );

    const result = await postRiddleSecretJapan(mockAnswer);
    expect(result).toEqual(fakeResponse);
  });
});
