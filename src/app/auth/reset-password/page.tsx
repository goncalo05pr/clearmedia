"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
      <h1 className="mb-3 text-2xl font-bold">Nouveau mot de passe</h1>
      <p className="mb-6 text-sm text-slate-400">
        Choisis un mot de passe securise pour ton compte ClearMedia.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          minLength={6}
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <input
          required
          minLength={6}
          type="password"
          placeholder="Confirmer"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
        >
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-red-300">{message}</p> : null}
    </section>
  );
}
