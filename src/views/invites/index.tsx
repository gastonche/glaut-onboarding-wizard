import { FC, Fragment } from "react";
import { BillingProps } from "../billing";
import { OnboardingStepHeader } from "../../core/components/molecules/onboarding-step-header";
import { useOnboardingStore } from "../../core/lib/onboarding-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteSchema } from "./schemas";
import { Text } from "../../core/components/atoms/text";
import { useForm } from "react-hook-form";
import { Button } from "../../core/components/atoms/button";
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { useSampleMutation } from "../../core/hooks/use-sample-mutation";

export const Invites: FC<BillingProps> = ({ ticker, onNext, onPrev }) => {
  const { invites, setInvites } = useOnboardingStore();

  const { register, handleSubmit, reset } = useForm<{ email: string }>({
    resolver: zodResolver(inviteSchema),
    mode: "onChange",
  });

  const onSubmit = (data: { email: string }) => {
    setInvites([...invites, data.email]);
    reset();
  };

  const { mutate, loading } = useSampleMutation();

  return (
    <div className="max-w-[700px]">
      <OnboardingStepHeader
        title="Invite Teammates"
        subtitle="Add your team members by entering their email addresses so they can collaborate with you inside the platform right after onboarding."
        ticker={ticker}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="py-6 flex items-end gap-1"
      >
        <div className="w-full">
          <Text variant="bodySm" as="label">
            Invite team mates by email
          </Text>
          <input
            {...register("email")}
            className="mt-1 block w-full rounded-md border focus:ring p-2 border-slate-200"
            placeholder="teammate@example.com"
          />
        </div>
        <Button variant="primary-text" type="submit" icon={<Plus />} className="whitespace-nowrap">
          Add another
        </Button>
      </form>
      {invites.map((email, index) => (
        <Fragment key={index}>
          <Text variant="bodySm" className="flex items-center justify-between">
            {email}
            <Button
              icon={<Trash2 className="text-slate-400" size={16} />}
              variant="neutral-text"
              onClick={() => {
                setInvites([
                  ...invites.slice(0, index),
                  ...invites.slice(index + 1),
                ]);
              }}
            />
          </Text>
          {index < invites.length - 1 ? (
            <hr className="text-slate-200 my-2" />
          ) : (
            <></>
          )}
        </Fragment>
      ))}
      <div className="flex items-center justify-between gap-4 mt-4">
        <Button
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={onPrev}
          variant="neutral-text"
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="w-[200px]"
          type="submit"
          disabled={!invites.length}
          loading={loading}
          iconEnd={<ArrowRight className="w-4 h-4" />}
          onClick={async () => {
            await mutate();
            onNext();
          }}
        >
          Finish
        </Button>
      </div>
    </div>
  );
};
