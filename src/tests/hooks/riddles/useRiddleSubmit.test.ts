import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRiddleSubmit } from '../../../hooks/riddles';
import * as api from '../../../hooks/riddles';

describe('useRiddleSubmit hook', () => {
  const mockAnswer = 'SHINOBI';
  const mockUserData = { mail: 'ninja@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkRiddle', () => {
    it('should set riddleResult and isCheckingRiddle on success', async () => {
      const fakeResponse = { correct: true, answer: 'SHINOBI' };
      vi.spyOn(api, 'postRiddleSecretJapan').mockResolvedValue(fakeResponse);

      const { result } = renderHook(() => useRiddleSubmit());

      await act(async () => {
        const response = await result.current.checkRiddle(mockAnswer);
        expect(response).toEqual(fakeResponse);
      });

      expect(result.current.riddleResult).toEqual(fakeResponse);
      expect(result.current.riddleError).toBeNull();
      expect(result.current.isCheckingRiddle).toBe(false);
    });

    it('should set riddleError on failure', async () => {
      const error = new Error('Riddle failed');
      vi.spyOn(api, 'postRiddleSecretJapan').mockRejectedValue(error);

      const { result } = renderHook(() => useRiddleSubmit());

      await act(async () => {
        await expect(result.current.checkRiddle(mockAnswer)).rejects.toThrow(error);
      });

      expect(result.current.riddleResult).toBeNull();
      expect(result.current.riddleError).toBe('Riddle failed');
      expect(result.current.isCheckingRiddle).toBe(false);
    });
  });

  describe('submitSignUp', () => {
    it('should set formMessage and isSubmittingForm on success', async () => {
      const fakeMessage = 'Usuario registrado correctamente';
      vi.spyOn(api, 'postFormSignUp').mockResolvedValue(fakeMessage);

      const { result } = renderHook(() => useRiddleSubmit());

      await act(async () => {
        const response = await result.current.submitSignUp(mockUserData);
        expect(response).toBe(fakeMessage);
      });

      expect(result.current.formMessage).toBe(fakeMessage);
      expect(result.current.formError).toBeNull();
      expect(result.current.isSubmittingForm).toBe(false);
    });

    it('should set formError on failure', async () => {
      const error = new Error('Email ya existe');
      vi.spyOn(api, 'postFormSignUp').mockRejectedValue(error);

      const { result } = renderHook(() => useRiddleSubmit());

      await act(async () => {
        await expect(result.current.submitSignUp(mockUserData)).rejects.toThrow(error);
      });

      expect(result.current.formMessage).toBeNull();
      expect(result.current.formError).toBe('Email ya existe');
      expect(result.current.isSubmittingForm).toBe(false);
    });
  });
});
