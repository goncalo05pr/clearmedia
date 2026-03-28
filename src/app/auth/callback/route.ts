import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function sanitizeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/espace-membre";
  }
  return next;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNext(searchParams.get("next"));

  console.log("Auth callback:", { code: !!code, next, origin: new URL(request.url).origin });

  if (!code) {
    console.error("No code provided in auth callback");
    return Response.redirect(new URL("/auth/auth-code-error", new URL(request.url).origin));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignore si lecture seule
          }
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Error exchanging code for session:", error);
    return Response.redirect(new URL("/auth/auth-code-error", new URL(request.url).origin));
  }

  console.log("Successfully exchanged code for session, redirecting to:", next);
  return Response.redirect(new URL(next, new URL(request.url).origin));
}
