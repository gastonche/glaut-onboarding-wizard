import { z } from "zod";
import { cardSchema } from "./schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Text } from "../../core/components/atoms/text";
import { FC } from "react";
import { Button } from "../../core/components/atoms/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type CardFormData = z.infer<typeof cardSchema>;

interface CardFormProps {
  onSubmit: (data: CardFormData) => void;
  submitting: boolean;
  onGoBack: () => void;
  defaultValues?: CardFormData;
}

export const CardForm: FC<CardFormProps> = ({
  onSubmit,
  submitting,
  onGoBack,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="py-6 space-y-6"
    >
      <div>
        <Text variant="bodySm" as="label" htmlFor="cardHolderName">
          Card Holder Name
        </Text>
        <input
          {...register("cardHolderName")}
          id="cardHolderName"
          className={clsx(
            "mt-1 block w-full rounded-md border focus:ring p-2 border-slate-200",
            errors.cardHolderName ? "border-red-500" : "border-gray-300"
          )}
          placeholder="Jane Doe"
        />
        {errors.cardHolderName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.cardHolderName.message}
          </p>
        )}
      </div>

      <div>
        <Text variant="bodySm" as="label" htmlFor="cardNumber">
          Credit Card Number
        </Text>
        <input
          {...register("cardNumber")}
          id="cardNumber"
          maxLength={16}
          className={clsx(
            "mt-1 block w-full rounded-md border focus:ring p-2 border-slate-200",
            errors.cardNumber ? "border-red-500" : "border-gray-300"
          )}
          placeholder="1234123412341234"
        />
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.cardNumber.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Text variant="bodySm" as="label">
            Expiration Date
          </Text>
          <div className="mt-1 grid grid-cols-2 gap-4">
            <div>
              <input
                {...register("expirationMonth")}
                maxLength={2}
                className={clsx(
                  "block w-full rounded-md border focus:ring p-2 border-slate-200",
                  errors.expirationMonth ? "border-red-500" : "border-gray-300"
                )}
                placeholder="MM"
              />
              {errors.expirationMonth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expirationMonth.message}
                </p>
              )}
            </div>
            <div>
              <input
                {...register("expirationYear")}
                maxLength={2}
                className={clsx(
                  "block w-full rounded-md border focus:ring p-2 border-slate-200",
                  errors.expirationYear ? "border-red-500" : "border-gray-300"
                )}
                placeholder="YY"
              />
              {errors.expirationYear && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expirationYear.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <Text variant="bodySm" as="label" htmlFor="cvc">
            CVC
          </Text>
          <input
            {...register("cvc")}
            id="cvc"
            maxLength={3}
            className={clsx(
              "mt-1 block w-full rounded-md border focus:ring p-2 border-slate-200",
              errors.cvc ? "border-red-500" : "border-gray-300"
            )}
            placeholder="123"
          />
          {errors.cvc && (
            <p className="mt-1 text-sm text-red-600">{errors.cvc.message}</p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={onGoBack}
          variant="neutral-text"
          type="button"
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="w-[200px]"
          type="submit"
          disabled={!isValid}
          loading={submitting}
          iconEnd={<ArrowRight className="w-4 h-4" />}
        >
          {submitting ? "Submitting..." : "Next"}
        </Button>
      </div>
    </form>
  );
};
