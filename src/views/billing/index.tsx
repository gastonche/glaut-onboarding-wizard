import { FC } from "react";

export interface BillingProps {
  onNext: () => void;
  onPrev: () => void;
}

export const Billing: FC<BillingProps> = () => {
  return <div>Billing</div>;
};