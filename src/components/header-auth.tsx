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
        className="rounded-md bg-cyan-500 px-3 py-2 font-medium text-slate-950 hover:bg-cyan-400"
      >
        Connexion
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[140px] truncate text-xs text-slate-400 sm:inline" title={email}>
        {email}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-md border border-slate-600 px-3 py-2 text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
      >
        Deconnexion
      </button>
    </div>
  );
}
