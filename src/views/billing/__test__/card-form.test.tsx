import React from "react";
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardForm } from '../card-form';
import userEvent from '@testing-library/user-event';

const mockOnSubmit = vi.fn();
const mockOnGoBack = vi.fn();

describe('CardForm', () => {
  const defaultProps = {
    onSubmit: mockOnSubmit,
    submitting: false,
    onGoBack: mockOnGoBack,
  };

  it('renders all form fields and buttons', () => {
    render(<CardForm {...defaultProps} />);
    expect(screen.getByLabelText('Card Holder Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Credit Card Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('YY')).toBeInTheDocument();
    expect(screen.getByLabelText('CVC')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('validates required fields on submit', async () => {
    render(<CardForm {...defaultProps} />);

    // Simulate typing and clearing each field
    const cardHolderNameInput = screen.getByLabelText('Card Holder Name');
    await userEvent.type(cardHolderNameInput, 'Jane Doe');
    await userEvent.clear(cardHolderNameInput);
    expect(screen.getByText(/card holder name is required/i)).toBeInTheDocument();

    const cardNumberInput = screen.getByLabelText('Credit Card Number');
    await userEvent.type(cardNumberInput, '1234');
    await userEvent.clear(cardNumberInput);
    expect(screen.getByText(/Credit card number must be exactly 16 digits/i)).toBeInTheDocument();

    const expirationMonthInput = screen.getByPlaceholderText('MM');
    await userEvent.type(expirationMonthInput, '1');
    await userEvent.clear(expirationMonthInput);
    expect(screen.getByText(/Month must be between 01 and 12/i)).toBeInTheDocument();

    const expirationYearInput = screen.getByPlaceholderText('YY');
    await userEvent.type(expirationYearInput, '2');
    await userEvent.clear(expirationYearInput);
    expect(screen.getByText(/Year must be two digits/i)).toBeInTheDocument();

    const cvcInput = screen.getByLabelText('CVC');
    await userEvent.type(cvcInput, '12');
    await userEvent.clear(cvcInput);
    expect(screen.getByText(/CVC must be exactly 3 digits/i)).toBeInTheDocument();

    // Ensure the Next button remains disabled
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('submits valid form data', async () => {
    render(<CardForm {...defaultProps} />);
    await userEvent.type(screen.getByLabelText('Card Holder Name'), 'Jane Doe');
    await userEvent.type(screen.getByLabelText('Credit Card Number'), '1234123412341234');
    await userEvent.type(screen.getByPlaceholderText('MM'), '12');
    await userEvent.type(screen.getByPlaceholderText('YY'), '25');
    await userEvent.type(screen.getByLabelText('CVC'), '123');
    await userEvent.click(screen.getByText('Next'));

    // Expect onSubmit to be called with the correct data (ignoring the event object)
    expect(mockOnSubmit).toHaveBeenCalledWith(
      {
        cardHolderName: 'Jane Doe',
        cardNumber: '1234123412341234',
        expirationMonth: '12',
        expirationYear: '25',
        cvc: '123',
      },
      expect.any(Object) // Ignore the synthetic event object
    );
  });

  it('disables the submit button when the form is invalid', async () => {
    render(<CardForm {...defaultProps} />);
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Card Holder Name'), 'Jane Doe');
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Credit Card Number'), '1234123412341234');
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByPlaceholderText('MM'), '12');
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByPlaceholderText('YY'), '25');
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByLabelText('CVC'), '123');
    expect(screen.getByText('Next')).toBeEnabled();
  });

  it('handles default values correctly', async () => {
    render(
      <CardForm
        {...defaultProps}
        defaultValues={{
          cardHolderName: 'John Doe',
          cardNumber: '4111111111111111',
          expirationMonth: '01',
          expirationYear: '26',
          cvc: '999',
        }}
      />
    );
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4111111111111111')).toBeInTheDocument();
    expect(screen.getByDisplayValue('01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('26')).toBeInTheDocument();
    expect(screen.getByDisplayValue('999')).toBeInTheDocument();
  });

  it('calls onGoBack when Back button is clicked', async () => {
    render(<CardForm {...defaultProps} />);
    await userEvent.click(screen.getByText('Back'));
    expect(mockOnGoBack).toHaveBeenCalled();
  });

  it('shows loading state when submitting', async () => {
    render(<CardForm {...defaultProps} submitting={true} />);
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(screen.getByText('Submitting...')).toBeDisabled();
  });

  it('validates max length for card number, expiration month, expiration year, and CVC', async () => {
    render(<CardForm {...defaultProps} />);
    await userEvent.type(screen.getByLabelText('Credit Card Number'), '12345678901234567890');
    expect(screen.getByLabelText('Credit Card Number')).toHaveValue('1234567890123456');
    await userEvent.type(screen.getByPlaceholderText('MM'), '123');
    expect(screen.getByPlaceholderText('MM')).toHaveValue('12');
    await userEvent.type(screen.getByPlaceholderText('YY'), '256');
    expect(screen.getByPlaceholderText('YY')).toHaveValue('25');
    await userEvent.type(screen.getByLabelText('CVC'), '1234');
    expect(screen.getByLabelText('CVC')).toHaveValue('123');
  });
});