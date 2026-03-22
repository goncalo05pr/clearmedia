import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HeaderAuth } from "@/components/header-auth";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-cyan-300">
          ClearMedia
        </Link>
        <div className="flex items-center gap-4 text-sm sm:gap-6">
          <Link href="/" className="hover:text-cyan-300">
            Accueil
          </Link>
          <Link href="/formations" className="hover:text-cyan-300">
            Formations
          </Link>
          <Link href="/espace-membre" className="hover:text-cyan-300">
            Espace membre
          </Link>
          <HeaderAuth email={user?.email ?? null} />
        </div>
      </nav>
    </header>
  );
}
