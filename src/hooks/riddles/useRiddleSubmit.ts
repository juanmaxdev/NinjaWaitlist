import { useCallback, useEffect, useRef, useState } from 'react';
import { postRiddleSecretJapan, postFormSignUp, type UserDataProps } from './';

export type RiddleAnswerResponse = {
  correct: boolean;
  answer?: string;
};

export function useRiddleSubmit() {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [isCheckingRiddle, setIsCheckingRiddle] = useState<boolean>(false);
  const [riddleError, setRiddleError] = useState<string | null>(null);
  const [riddleResult, setRiddleResult] = useState<RiddleAnswerResponse | null>(null);

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const checkRiddle = useCallback(async (answer: string) => {
    setRiddleError(null);
    setIsCheckingRiddle(true);

    try {
      const response: RiddleAnswerResponse = await postRiddleSecretJapan(answer);

      if (mountedRef.current) setRiddleResult(response);
      return response;
    } catch (err: any) {
      const message = err?.message ?? 'Error desconocido';
      if (mountedRef.current) setRiddleError(message);
      throw err;
    } finally {
      if (mountedRef.current) setIsCheckingRiddle(false);
    }
  }, []);

  const submitSignUp = useCallback(async (data: UserDataProps) => {
    setFormError(null);
    setIsSubmittingForm(true);

    try {
      const message: string = await postFormSignUp(data);

      if (mountedRef.current) setFormMessage(message);
      return message;
    } catch (err: any) {
      const message = err?.message ?? 'Error desconocido';
      if (mountedRef.current) setFormError(message);
      throw err;
    } finally {
      if (mountedRef.current) setIsSubmittingForm(false);
    }
  }, []);

  return {
    isCheckingRiddle,
    riddleError,
    riddleResult,
    checkRiddle,

    isSubmittingForm,
    formError,
    formMessage,
    submitSignUp,
  } as const;
}
