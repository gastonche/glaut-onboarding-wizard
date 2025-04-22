import { useState } from "react";

export function useSampleMutation() {
  const [loading, setLoading] = useState(false);

  const mutate = async () => {
    setLoading(true);
    const duration = Math.random() * 2000;
    console.log(`Mutating in ${duration}ms...`);
    await new Promise((resolve) => setTimeout(resolve, duration));
    setLoading(false);
  };

  return {
    mutate,
    loading,
  };
}
