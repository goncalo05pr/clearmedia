import Link from "next/link";
import { isAdminUser } from "@/lib/auth-helpers";
import { createClient } from "@/lib/supabase/server";
import { HeaderAuth } from "@/components/header-auth";
import { getPaidFormationIds } from "@/lib/user-purchases";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let showMemberArea = false;
  let isAdmin = false;
  
  if (user) {
    if (isAdminUser(user)) {
      showMemberArea = true;
      isAdmin = true;
    } else {
      const paidResult = await getPaidFormationIds(supabase, user.id);
      showMemberArea = paidResult.ok && paidResult.ids.size > 0;
    }
  }

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight text-white transition-all hover:scale-105 hover:text-transparent hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#EC4899] hover:bg-clip-text"
        >
          KLIQZ
        </Link>
        <div className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-neutral-300 transition-all hover:bg-white/[0.1] hover:text-white hover:scale-105"
          >
            Accueil
          </Link>
          <Link
            href="/formations"
            className="rounded-lg px-3 py-2 text-neutral-300 transition-all hover:bg-white/[0.1] hover:text-white hover:scale-105"
          >
            Formations
          </Link>
          {showMemberArea ? (
            <>
              <Link
                href="/profil"
                className="rounded-lg px-2 py-2 text-neutral-300 transition-all hover:bg-white/[0.1] hover:text-white hover:scale-105 sm:px-3"
              >
                <span className="hidden sm:inline">👤 Mon profil</span>
                <span className="sm:hidden">👤</span>
              </Link>
              <Link
                href="/espace-membre"
                className="rounded-lg px-2 py-2 text-neutral-300 transition-all hover:bg-white/[0.1] hover:text-white hover:scale-105 sm:px-3"
              >
                <span className="hidden sm:inline">Espace membre</span>
                <span className="sm:hidden">Membre</span>
              </Link>
            </>
          ) : null}
          {isAdmin ? (
            <Link
              href="/admin"
              className="rounded-lg px-2 py-2 text-neutral-300 transition-all hover:bg-red-500/20 hover:text-red-300 hover:scale-105 sm:px-3"
            >
              <span className="hidden sm:inline">🚀 Admin</span>
              <span className="sm:hidden">🚀</span>
            </Link>
          ) : null}
          <HeaderAuth email={user?.email ?? null} />
        </div>
      </nav>
    </header>
  );
}
