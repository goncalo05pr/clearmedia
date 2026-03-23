"use client";

import { useState } from "react";

type BuyButtonProps = {
  formationId: string;
};

export function BuyButton({ formationId }: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formationId }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        alert(payload.error ?? "Impossible de lancer le paiement.");
        return;
      }

      window.location.href = payload.url;
    } catch {
      alert("Erreur reseau. Reessaie dans quelques instants.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full rounded-full bg-[#ff4d2e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#ff6a4d] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "Redirection..." : "Acheter maintenant"}
    </button>
  );
}
