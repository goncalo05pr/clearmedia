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
        className="ml-1 rounded-full bg-[#ff4d2e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#ff6a4d]"
      >
        Connexion
      </Link>
    );
  }

  return (
    <div className="ml-1 flex items-center gap-2">
      <span
        className="hidden max-w-[120px] truncate text-xs text-neutral-500 sm:inline"
        title={email}
      >
        {email}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full border border-white/[0.1] px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-[#ff4d2e]/40 hover:text-white sm:text-sm"
      >
        Deconnexion
      </button>
    </div>
  );
}
