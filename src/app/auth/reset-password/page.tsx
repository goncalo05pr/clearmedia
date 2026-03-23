"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-[#ff4d2e]/40 focus:ring-1 focus:ring-[#ff4d2e]/20";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (password.length < 6) {
      setMessage("Le mot de passe doit faire au moins 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/connexion?reset=ok");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#ff4d2e]">Securite</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Nouveau mot de passe
      </h1>
      <p className="mt-4 text-sm text-neutral-400">
        Choisis un mot de passe securise pour ton compte ClearMedia.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          minLength={6}
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          autoComplete="new-password"
        />
        <input
          required
          minLength={6}
          type="password"
          placeholder="Confirmer"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#ff4d2e] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#ff6a4d] disabled:opacity-50"
        >
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-red-300/90">{message}</p> : null}
    </section>
  );
}
