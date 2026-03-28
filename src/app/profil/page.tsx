"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/ui/password-input";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        setFormData({
          name: user.user_metadata?.name || "",
          email: user.email || "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        router.push("/connexion");
      }
      setLoading(false);
    }

    getUser();
  }, [router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();

    try {
      // Update email if changed
      if (formData.email !== user?.email) {
        const { error } = await supabase.auth.updateUser({
          email: formData.email
        });
        if (error) throw error;
        setMessage("Email mis à jour ! Vérifie ta boîte mail pour confirmer.");
      }

      // Update name if changed
      if (formData.name !== user?.user_metadata?.name) {
        const { error } = await supabase.auth.updateUser({
          data: { name: formData.name }
        });
        if (error) throw error;
      }

      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
        if (formData.newPassword.length < 6) {
          throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
        }

        const { error } = await supabase.auth.updateUser({
          password: formData.newPassword
        });
        if (error) throw error;
        setMessage("Mot de passe mis à jour !");
      }

      if (!formData.newPassword && formData.email === user?.email && formData.name === user?.user_metadata?.name) {
        setMessage("Aucune modification à enregistrer.");
      } else {
        setMessage("Profil mis à jour avec succès !");
      }

      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      setUser(updatedUser);

    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
            <p className="text-gray-300">Gère tes informations personnelles</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-2xl border border-white/10 glass-strong px-4 py-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:scale-105"
                placeholder="Ton nom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full rounded-2xl border border-white/10 glass-strong px-4 py-4 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:scale-105"
                placeholder="ton@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nouveau mot de passe (optionnel)
              </label>
              <PasswordInput
                value={formData.newPassword}
                onChange={(value) => setFormData({...formData, newPassword: value})}
                placeholder="Laisse vide pour ne pas changer"
                minLength={6}
              />
            </div>

            {formData.newPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <PasswordInput
                  value={formData.confirmPassword}
                  onChange={(value) => setFormData({...formData, confirmPassword: value})}
                  placeholder="Confirme ton nouveau mot de passe"
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gradient w-full rounded-full px-6 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mise à jour...
                </span>
              ) : (
                "Mettre à jour mon profil"
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-2xl text-sm leading-relaxed ${
              message.includes("Erreur") 
                ? "bg-red-500/10 border border-red-500/30 text-red-300" 
                : "bg-green-500/10 border border-green-500/30 text-green-300"
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="w-full rounded-full glass-strong px-6 py-3 text-sm font-bold text-neutral-300 transition-all hover:bg-white/10 hover:text-white hover:scale-105"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
