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
  if (user) {
    if (isAdminUser(user)) {
      showMemberArea = true;
    } else {
      const paidResult = await getPaidFormationIds(supabase, user.id);
      showMemberArea = paidResult.ok && paidResult.ids.size > 0;
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-white transition-colors hover:text-[#ff4d2e]"
        >
          KLIQZ
        </Link>
        <div className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            Accueil
          </Link>
          <Link
            href="/formations"
            className="rounded-lg px-3 py-2 text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            Formations
          </Link>
          {showMemberArea ? (
            <Link
              href="/espace-membre"
              className="rounded-lg px-2 py-2 text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white sm:px-3"
            >
              <span className="hidden sm:inline">Espace membre</span>
              <span className="sm:hidden">Membre</span>
            </Link>
          ) : null}
          <HeaderAuth email={user?.email ?? null} />
        </div>
      </nav>
    </header>
  );
}
