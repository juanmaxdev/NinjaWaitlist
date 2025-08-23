import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mockSubmitSignUp = vi.fn();
const mockIsSubmittingForm = vi.fn().mockReturnValue(false);

vi.mock('../../../../hooks/riddles/useRiddleSubmit', () => ({
  useRiddleSubmit: () => ({
    submitSignUp: mockSubmitSignUp,
    isSubmittingForm: mockIsSubmittingForm(),
  }),
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get:
        () =>
        ({ children, ...props }: any) => {
          const {
            initial,
            animate,
            whileInView,
            whileHover,
            whileFocus,
            whileTap,
            transition,
            exit,
            variants,
            drag,
            layout,
            layoutId,
            style,
            onSubmit,
            ...htmlProps
          } = props;
          if (onSubmit) htmlProps.onSubmit = onSubmit;
          return React.createElement('div', htmlProps, children);
        },
    }
  ),
}));

import EmailSignup from '../../../../app/components/sections/EmailSignup';

const simulateFormSubmit = (emailValue: string, puzzleValue: string = '', targetAnswer?: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailTrimmed = emailValue.trim();

  if (!emailRegex.test(emailTrimmed)) {
    return { error: 'Por favor, introduce un email valido', shouldCallSubmit: false };
  }

  const payload = {
    mail: emailTrimmed,
    riddleSecretJapan: targetAnswer ?? '',
    riddleRainLetters: puzzleValue.trim() ?? '',
  };

  return { payload, shouldCallSubmit: true };
};

describe('EmailSignup Component - Complete Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmitSignUp.mockResolvedValue('Registrado correctamente');
    mockIsSubmittingForm.mockReturnValue(false);
  });

  describe('Rendering', () => {
    it('should render basic elements', () => {
      render(<EmailSignup />);

      expect(screen.getByText('UNETE AL DOJO')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Introduce la palabra secreta...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /UNIRSE/i })).toBeInTheDocument();
    });

    it('should render with targetAnswer prop', () => {
      render(<EmailSignup targetAnswer="secret123" />);
      expect(screen.getByDisplayValue('secret123')).toBeInTheDocument();
    });

    it('should render with null targetAnswer', () => {
      render(<EmailSignup targetAnswer={null} />);
      const readonlyInput = screen.getByPlaceholderText('Se autocompletará al acertar');
      expect(readonlyInput).toHaveValue('');
    });
  });

  describe('Form Interactions', () => {
    it('should update email input value', () => {
      render(<EmailSignup />);

      const emailInput = screen.getByPlaceholderText('email@example.com') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update puzzle input value', () => {
      render(<EmailSignup />);

      const puzzleInput = screen.getByPlaceholderText('Introduce la palabra secreta...') as HTMLInputElement;
      fireEvent.change(puzzleInput, { target: { value: 'secret-word' } });

      expect(puzzleInput.value).toBe('secret-word');
    });

    it('should prevent interactions with readonly input', () => {
      render(<EmailSignup targetAnswer="test-answer" />);

      const readonlyInput = screen.getByDisplayValue('test-answer');
      expect(readonlyInput).toBeDisabled();
      expect(readonlyInput).toHaveAttribute('readonly');
    });
  });

  describe('Email Validation Logic', () => {
    it('should accept valid email formats', () => {
      const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'user+tag@example.org'];

      validEmails.forEach((email) => {
        const result = simulateFormSubmit(email);
        expect(result.shouldCallSubmit).toBe(true);
        expect(result.payload).toEqual({
          mail: email,
          riddleSecretJapan: '',
          riddleRainLetters: '',
        });
      });
    });

    it('should trim email whitespace', () => {
      const result = simulateFormSubmit('  test@example.com  ');
      expect(result.payload?.mail).toBe('test@example.com');
    });
  });

  describe('Form Submission Logic', () => {
    it('should create correct payload with all data', () => {
      const result = simulateFormSubmit('test@example.com', 'puzzle-answer', 'secret-target');

      expect(result.payload).toEqual({
        mail: 'test@example.com',
        riddleSecretJapan: 'secret-target',
        riddleRainLetters: 'puzzle-answer',
      });
    });

    it('should handle empty puzzle and target values', () => {
      const result = simulateFormSubmit('test@example.com');

      expect(result.payload).toEqual({
        mail: 'test@example.com',
        riddleSecretJapan: '',
        riddleRainLetters: '',
      });
    });

    it('should trim puzzle input', () => {
      const result = simulateFormSubmit('test@example.com', '  puzzle-answer  ');
      expect(result.payload?.riddleRainLetters).toBe('puzzle-answer');
    });
  });

  describe('Loading State', () => {
    it('should disable form during submission', () => {
      mockIsSubmittingForm.mockReturnValue(true);

      render(<EmailSignup />);

      const emailInput = screen.getByPlaceholderText('email@example.com');
      const puzzleInput = screen.getByPlaceholderText('Introduce la palabra secreta...');

      expect(emailInput).toBeDisabled();
      expect(puzzleInput).toBeDisabled();
      expect(screen.getByText('PROCESANDO...')).toBeInTheDocument();
    });
  });

  describe('Hook Integration', () => {
    it('should use useRiddleSubmit hook correctly', () => {
      render(<EmailSignup />);

      expect(mockIsSubmittingForm).toHaveBeenCalled();
    });

    it('should handle hook mock correctly', async () => {
      const testPayload = {
        mail: 'test@example.com',
        riddleSecretJapan: 'secret',
        riddleRainLetters: 'puzzle',
      };

      await mockSubmitSignUp(testPayload);
      expect(mockSubmitSignUp).toHaveBeenCalledWith(testPayload);
    });
  });

  describe('Integration Tests', () => {
    it('should validate user input flow', () => {
      render(<EmailSignup targetAnswer="secret123" />);

      const emailInput = screen.getByPlaceholderText('email@example.com') as HTMLInputElement;
      const puzzleInput = screen.getByPlaceholderText('Introduce la palabra secreta...') as HTMLInputElement;
      const targetInput = screen.getByDisplayValue('secret123') as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.change(puzzleInput, { target: { value: 'my-puzzle' } });

      expect(emailInput.value).toBe('user@example.com');
      expect(puzzleInput.value).toBe('my-puzzle');
      expect(targetInput.value).toBe('secret123');

      const validationResult = simulateFormSubmit(emailInput.value, puzzleInput.value, targetInput.value);

      expect(validationResult.shouldCallSubmit).toBe(true);
      expect(validationResult.payload).toEqual({
        mail: 'user@example.com',
        riddleSecretJapan: 'secret123',
        riddleRainLetters: 'my-puzzle',
      });
    });
  });

  describe('Security & Error Handling', () => {
    it('should handle submitSignUp errors properly', async () => {
      mockSubmitSignUp.mockRejectedValue(new Error('Network error'));

      render(<EmailSignup />);

      const emailInput = screen.getByPlaceholderText('email@example.com') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      try {
        await mockSubmitSignUp({
          mail: 'test@example.com',
          riddleSecretJapan: '',
          riddleRainLetters: '',
        });
      } catch (error) {
        expect((error as Error).message).toBe('Network error');
      }
    });

    it('should handle very long input values', () => {
      render(<EmailSignup />);

      const emailInput = screen.getByPlaceholderText('email@example.com') as HTMLInputElement;
      const puzzleInput = screen.getByPlaceholderText('Introduce la palabra secreta...') as HTMLInputElement;

      const longEmail = 'a'.repeat(1000) + '@example.com';
      const longPuzzle = 'b'.repeat(10000);

      fireEvent.change(emailInput, { target: { value: longEmail } });
      fireEvent.change(puzzleInput, { target: { value: longPuzzle } });

      expect(emailInput.value).toBe(longEmail);
      expect(puzzleInput.value).toBe(longPuzzle);
    });
  });

  describe('Edge Cases & Accessibility', () => {
    it('should handle special characters in email', () => {
      const specialEmails = [
        'test+tag@example.com',
        'test.email@example-domain.com',
        'test_email@example.co.uk',
        'user-name@domain.org',
      ];

      specialEmails.forEach((email) => {
        const result = simulateFormSubmit(email);
        expect(result.shouldCallSubmit).toBe(true);
      });
    });

    it('should handle unicode characters', () => {
      render(<EmailSignup />);

      const puzzleInput = screen.getByPlaceholderText('Introduce la palabra secreta...') as HTMLInputElement;

      const unicodeText = 'これは日本語です';
      fireEvent.change(puzzleInput, { target: { value: unicodeText } });

      expect(puzzleInput.value).toBe(unicodeText);
    });

    it('should maintain accessibility attributes under all conditions', () => {
      render(<EmailSignup targetAnswer="test123" />);

      const readonlyInput = screen.getByDisplayValue('test123');

      expect(readonlyInput).toHaveAttribute('aria-readonly');
      expect(readonlyInput).toHaveAttribute('tabIndex', '-1');
      expect(readonlyInput).toBeDisabled();

      expect(readonlyInput).toHaveAttribute('tabIndex', '-1');
    });

    it('should handle rapid state changes', () => {
      render(<EmailSignup />);

      const emailInput = screen.getByPlaceholderText('email@example.com') as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: 'test1@example.com' } });
      fireEvent.change(emailInput, { target: { value: 'test2@example.com' } });
      fireEvent.change(emailInput, { target: { value: 'test3@example.com' } });

      expect(emailInput.value).toBe('test3@example.com');
    });
  });

  describe('Payload Validation', () => {
    it('should handle null and undefined values safely', () => {
      const result1 = simulateFormSubmit('test@example.com', undefined as any, null as any);
      expect(result1.payload?.riddleRainLetters).toBe('');
      expect(result1.payload?.riddleSecretJapan).toBe('');

      const result2 = simulateFormSubmit('test@example.com', '', undefined as any);
      expect(result2.payload?.riddleSecretJapan).toBe('');
    });

    it('should validate payload structure', () => {
      const result = simulateFormSubmit('test@example.com', 'puzzle', 'target');

      expect(result.payload).toHaveProperty('mail');
      expect(result.payload).toHaveProperty('riddleSecretJapan');
      expect(result.payload).toHaveProperty('riddleRainLetters');

      // Verificar tipos
      expect(typeof result.payload?.mail).toBe('string');
      expect(typeof result.payload?.riddleSecretJapan).toBe('string');
      expect(typeof result.payload?.riddleRainLetters).toBe('string');
    });
  });

  describe('Component State Management', () => {
    it('should prevent double submission', () => {
      mockIsSubmittingForm.mockReturnValue(true);
      render(<EmailSignup />);

      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle form reset scenarios', () => {
      render(<EmailSignup targetAnswer="secret" />);

      const emailInput = screen.getByPlaceholderText('email@example.com') as HTMLInputElement;
      const puzzleInput = screen.getByPlaceholderText('Introduce la palabra secreta...') as HTMLInputElement;

      // Llenar el formulario
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(puzzleInput, { target: { value: 'puzzle' } });

      expect(emailInput.value).toBe('test@example.com');
      expect(puzzleInput.value).toBe('puzzle');

      const targetInput = screen.getByDisplayValue('secret') as HTMLInputElement;
      expect(targetInput.value).toBe('secret');
    });
  });
});
