"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  /** Apres connexion reussie (chemins internes uniquement) */
  redirectTo?: string;
};

function clientOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
}

export function AuthForm({ redirectTo = "/espace-membre" }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const origin = clientOrigin();
    const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/auth/reset-password")}`,
      });
      setIsLoading(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      setMessage("Email envoye. Ouvre le lien pour definir un nouveau mot de passe.");
      return;
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl,
        },
      });
      setIsLoading(false);

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      setMessage(
        "Compte cree. Verifie ta boite mail et clique sur le lien de confirmation (si active dans Supabase).",
      );
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMessage("Tu es deconnecte.");
    router.refresh();
  }

  return (
    <div className="max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setMessage("");
          }}
          className={`rounded-md px-3 py-2 text-sm ${
            mode === "login" ? "bg-cyan-500 font-semibold text-slate-950" : "bg-slate-800"
          }`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setMessage("");
          }}
          className={`rounded-md px-3 py-2 text-sm ${
            mode === "signup" ? "bg-cyan-500 font-semibold text-slate-950" : "bg-slate-800"
          }`}
        >
          Inscription
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("reset");
            setMessage("");
          }}
          className={`rounded-md px-3 py-2 text-sm ${
            mode === "reset" ? "bg-cyan-500 font-semibold text-slate-950" : "bg-slate-800"
          }`}
        >
          Mot de passe oublie
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        {mode !== "reset" ? (
          <input
            required
            minLength={6}
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60"
        >
          {isLoading
            ? "Chargement..."
            : mode === "signup"
              ? "Creer mon compte"
              : mode === "reset"
                ? "Envoyer le lien"
                : "Se connecter"}
        </button>
      </form>

      <button
        type="button"
        onClick={signOut}
        className="mt-3 w-full rounded-md border border-slate-700 px-4 py-2 text-sm hover:border-cyan-400"
      >
        Se deconnecter
      </button>

      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}
