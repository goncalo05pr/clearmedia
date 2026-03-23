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

const tabBase =
  "rounded-full px-4 py-2 text-sm font-medium transition";
const tabInactive =
  "text-neutral-500 hover:bg-white/[0.04] hover:text-neutral-300";
const tabActive = "bg-[#ff4d2e] text-white";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-neutral-600 outline-none transition focus:border-[#ff4d2e]/40 focus:ring-1 focus:ring-[#ff4d2e]/20";

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
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setMessage("");
          }}
          className={`${tabBase} ${mode === "login" ? tabActive : tabInactive}`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setMessage("");
          }}
          className={`${tabBase} ${mode === "signup" ? tabActive : tabInactive}`}
        >
          Inscription
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("reset");
            setMessage("");
          }}
          className={`${tabBase} ${mode === "reset" ? tabActive : tabInactive}`}
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
          className={inputClass}
          autoComplete="email"
        />
        {mode !== "reset" ? (
          <input
            required
            minLength={6}
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full bg-[#ff4d2e] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#ff6a4d] disabled:cursor-not-allowed disabled:opacity-50"
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
        className="mt-4 w-full rounded-full border border-white/[0.1] px-4 py-2.5 text-sm text-neutral-400 transition hover:border-white/[0.2] hover:text-white"
      >
        Se deconnecter
      </button>

      {message ? (
        <p className="mt-6 text-sm leading-relaxed text-neutral-400">{message}</p>
      ) : null}
    </div>
  );
}
