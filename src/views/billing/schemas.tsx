import { z } from "zod";

export const cardSchema = z.object({
  cardHolderName: z
    .string()
    .min(1, { message: "Card holder name is required" }),
  cardNumber: z.string().regex(/^[0-9]{16}$/, {
    message: "Credit card number must be exactly 16 digits",
  }),
  expirationMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, {
    message: "Month must be between 01 and 12",
  }),
  expirationYear: z.string().regex(/^[0-9]{2}$/, {
    message: "Year must be two digits",
  }),
  cvc: z.string().regex(/^[0-9]{3}$/, {
    message: "CVC must be exactly 3 digits",
  }),
});
