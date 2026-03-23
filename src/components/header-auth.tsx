"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type HeaderAuthProps = {
  email: string | null;
};

export function HeaderAuth({ email }: HeaderAuthProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!email) {
    return (
      <Link
        href="/connexion"
        className="btn-gradient rounded-full px-6 py-2 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
      >
        🚀 Connexion
      </Link>
    );
  }

  return (
    <div className="ml-1 flex items-center gap-3">
      <div className="hidden sm:block">
        <div className="glass-strong rounded-full px-4 py-2">
          <span
            className="max-w-[150px] truncate text-sm font-medium text-white"
            title={email}
          >
            👤 {email}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="glass-strong rounded-full px-4 py-2 text-sm font-bold text-neutral-300 transition-all hover:bg-red-500/20 hover:text-red-300 hover:scale-105"
      >
        🚪 Déconnexion
      </button>
    </div>
  );
}
