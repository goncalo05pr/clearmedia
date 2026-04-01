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
    phone: "",
    birthDate: "",
    bio: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    weeklyReport: true
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        // Récupérer les données du profil depuis Supabase
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setFormData({
          name: profileData?.full_name || user.user_metadata?.name || "",
          email: user.email || "",
          phone: profileData?.phone || "",
          birthDate: profileData?.birthdate ? new Date(profileData.birthdate).toISOString().split('T')[0] : "",
          bio: profileData?.bio || "",
          newPassword: "",
          confirmPassword: ""
        });

        // Forcer les champs mot de passe à être vides (double sécurité)
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            newPassword: "",
            confirmPassword: ""
          }));
        }, 100);

        setPreferences({
          emailNotifications: profileData?.user_metadata?.emailNotifications ?? true,
          pushNotifications: profileData?.user_metadata?.pushNotifications ?? false,
          marketingEmails: profileData?.user_metadata?.marketingEmails ?? true,
          weeklyReport: profileData?.user_metadata?.weeklyReport ?? true
        });

        // Récupérer l'URL de la photo de profil
        if (profileData?.avatar_url) {
          setPreviewUrl(profileData.avatar_url);
        }
      } else {
        router.push("/connexion");
      }
      setLoading(false);
    }

    getUser();
  }, [router]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();

    try {
      let avatarUrl = previewUrl;

      // Upload de la photo de profil si changée
      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, profilePicture);

        if (uploadError) {
          throw new Error("Erreur lors de l'upload de la photo: " + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      // Mettre à jour les métadonnées de l'utilisateur
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          phone: formData.phone,
          birthDate: formData.birthDate,
          bio: formData.bio,
          avatar_url: avatarUrl,
          ...preferences
        }
      });

      if (metadataError) {
        throw new Error("Erreur lors de la mise à jour du profil: " + metadataError.message);
      }

      // Mettre à jour la table profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: formData.name || null,
          phone: formData.phone || null,
          birthdate: formData.birthDate || null,
          bio: formData.bio || null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        throw new Error("Erreur lors de la sauvegarde du profil: " + profileError.message);
      }

      // Update email if changed
      if (formData.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });
        if (emailError) {
          throw new Error("Erreur lors de la mise à jour de l'email: " + emailError.message);
        }
        setMessage("Email mis à jour ! Vérifie ta boîte mail pour confirmer.");
      } else {
        setMessage("Profil mis à jour avec succès !");
      }

      // Update password if provided
      if (formData.newPassword || formData.confirmPassword) {
        // Vérifier que les deux champs sont remplis
        if (!formData.newPassword || !formData.confirmPassword) {
          throw new Error("Veuillez remplir les deux champs mot de passe pour le changer.");
        }
        
        // Vérifier que les mots de passe correspondent
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Les mots de passe ne correspondent pas.");
        }
        
        // Vérifier la longueur minimale
        if (formData.newPassword.length < 8) {
          throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
        }

        // Mettre à jour le mot de passe
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword
        });
        if (passwordError) {
          throw new Error("Erreur lors de la mise à jour du mot de passe: " + passwordError.message);
        }
        setMessage(prev => prev + " Mot de passe mis à jour !");
      }

      // Refresh user data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      setUser(updatedUser);
      
      // Réinitialiser les champs mot de passe après succès
      resetPasswordFields();

    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Réinitialiser les champs mot de passe après soumission
  const resetPasswordFields = () => {
    setFormData(prev => ({
      ...prev,
      newPassword: "",
      confirmPassword: ""
    }));
  };

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#ff4d2e] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Mon Profil</h1>
            <p className="text-gray-300">Gère tes informations personnelles et tes préférences</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Champ caché pour tromper le navigateur */}
            <input
              type="text"
              name="username"
              autoComplete="username"
              style={{ display: 'none' }}
              tabIndex={-1}
              aria-hidden="true"
            />
            
            {/* Photo de profil */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Photo de profil
              </label>
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#ff4d2e]/20 mx-auto">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Photo de profil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#ff4d2e]/20 to-[#ff6b3d]/20 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    fileInput?.click();
                  }}
                  className="absolute bottom-0 right-0 bg-[#ff4d2e] text-white p-2 rounded-full text-xs hover:bg-[#ff6b3d] transition-colors"
                >
                  📷
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informations de base */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Informations personnelles</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-[#ff4d2e]/50 focus:ring-2 focus:ring-[#ff4d2e]/20"
                    placeholder="Votre nom"
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
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-[#ff4d2e]/50 focus:ring-2 focus:ring-[#ff4d2e]/20"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-[#ff4d2e]/50 focus:ring-2 focus:ring-[#ff4d2e]/20"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-[#ff4d2e]/50 focus:ring-2 focus:ring-[#ff4d2e]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Biographie
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-all focus:border-[#ff4d2e]/50 focus:ring-2 focus:ring-[#ff4d2e]/20"
                    placeholder="Parlez-nous de vous..."
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.bio.length}/500 caractères
                  </div>
                </div>
              </div>

              {/* Préférences de notification */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Préférences de notification</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                      className="w-5 h-5 text-[#ff4d2e] border-white/20 bg-white/5 rounded focus:ring-[#ff4d2e]"
                    />
                    <span className="text-gray-300">Notifications par email</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={(e) => setPreferences({...preferences, pushNotifications: e.target.checked})}
                      className="w-5 h-5 text-[#ff4d2e] border-white/20 bg-white/5 rounded focus:ring-[#ff4d2e]"
                    />
                    <span className="text-gray-300">Notifications push</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketingEmails}
                      onChange={(e) => setPreferences({...preferences, marketingEmails: e.target.checked})}
                      className="w-5 h-5 text-[#ff4d2e] border-white/20 bg-white/5 rounded focus:ring-[#ff4d2e]"
                    />
                    <span className="text-gray-300">Emails marketing</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.weeklyReport}
                      onChange={(e) => setPreferences({...preferences, weeklyReport: e.target.checked})}
                      className="w-5 h-5 text-[#ff4d2e] border-white/20 bg-white/5 rounded focus:ring-[#ff4d2e]"
                    />
                    <span className="text-gray-300">Rapport hebdomadaire</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Sécurité</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nouveau mot de passe (optionnel)
                  </label>
                  <PasswordInput
                    key="new-password-field"
                    value={formData.newPassword}
                    onChange={(value) => setFormData({...formData, newPassword: value})}
                    placeholder="Laisser vide pour ne pas changer"
                    minLength={8}
                    autoComplete="new-password"
                    defaultValue=""
                  />
                </div>

                {formData.newPassword || formData.confirmPassword ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <PasswordInput
                      key="confirm-password-field"
                      value={formData.confirmPassword}
                      onChange={(value) => setFormData({...formData, confirmPassword: value})}
                      placeholder="Confirmer votre nouveau mot de passe"
                      minLength={8}
                      autoComplete="new-password"
                      defaultValue=""
                    />
                  </div>
                ) : null}
              </div>

              {formData.newPassword && (
                <div className="text-sm text-gray-400">
                  <p>• Au moins 8 caractères</p>
                  <p>• Doit contenir des lettres et des chiffres</p>
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#ff4d2e] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
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

              <button
                type="button"
                onClick={handleSignOut}
                className="px-8 py-4 border-2 border-white/20 text-white rounded-full font-semibold text-lg transition-all hover:bg-white/10 hover:scale-105"
              >
                Se déconnecter
              </button>
            </div>
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
        </div>
      </div>
    </div>
  );
}
