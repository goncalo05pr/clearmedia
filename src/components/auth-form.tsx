"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/ui/password-input";

type AuthFormProps = {
  redirectTo?: string;
};

function clientOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // En production, utilise l'URL du site
  return "https://kliqz.vercel.app";
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

    console.log("Auth attempt:", { mode, email });

    const supabase = createClient();
    const origin = clientOrigin();
    const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    
    console.log("Using origin:", origin);
    console.log("Callback URL:", callbackUrl);

    if (mode === "reset") {
      console.log("Sending reset password email to:", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/auth/reset-password")}`,
      });
      setIsLoading(false);
      if (error) {
        console.error("Reset password error:", error);
        setMessage(`Erreur: ${error.message}`);
        return;
      }
      setMessage("Email envoyé ! Ouvre le lien pour définir un nouveau mot de passe.");
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
        console.error("Signup error:", error);
        setMessage(`Erreur: ${error.message}`);
        return;
      }

      if (data.session) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      setMessage("Compte créé ! Vérifie ta boîte mail et clique sur le lien de confirmation.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (error) {
      console.error("Login error:", error);
      setMessage(`Erreur: ${error.message}`);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMessage("Tu es déconnecté.");
    router.refresh();
  }

  return (
    <div className="glass-strong rounded-3xl p-8 sm:p-10">
      <div className="mb-10 flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setMessage("");
          }}
          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
            mode === "login" 
              ? "btn-gradient text-white" 
              : "text-neutral-400 hover:bg-white/10 hover:text-white hover:scale-105"
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
          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
            mode === "signup" 
              ? "btn-gradient text-white" 
              : "text-neutral-400 hover:bg-white/10 hover:text-white hover:scale-105"
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
          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
            mode === "reset" 
              ? "btn-gradient text-white" 
              : "text-neutral-400 hover:bg-white/10 hover:text-white hover:scale-105"
          }`}
        >
          Mot de passe oublié
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-white/10 glass-strong px-4 py-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:scale-105"
          autoComplete="email"
        />
        {mode !== "reset" ? (
          <PasswordInput
            required
            minLength={6}
            placeholder="🔒 Mot de passe (min. 6 caractères)"
            value={password}
            onChange={setPassword}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-gradient w-full rounded-full px-6 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Chargement...
            </span>
          ) : mode === "signup" ? (
            "Créer mon compte"
          ) : mode === "reset" ? (
            "Envoyer le lien"
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      <button
        type="button"
        onClick={signOut}
        className="mt-6 w-full rounded-full glass-strong px-6 py-3 text-sm font-bold text-neutral-300 transition-all hover:bg-white/10 hover:text-white hover:scale-105"
      >
        Se déconnecter
      </button>

      {message ? (
        <div className={`mt-6 p-4 rounded-2xl text-sm leading-relaxed ${
          message.includes("Erreur") 
            ? "bg-red-500/10 border border-red-500/30 text-red-300" 
            : "bg-green-500/10 border border-green-500/30 text-green-300"
        }`}>
          {message}
        </div>
      ) : null}
    </div>
  );
}
