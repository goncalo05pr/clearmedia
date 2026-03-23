import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminUser } from "@/lib/auth-helpers";

function isEspaceMembrePath(pathname: string) {
  return pathname === "/espace-membre" || pathname.startsWith("/espace-membre/");
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isEspaceMembrePath(request.nextUrl.pathname)) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/connexion";
      url.search = "";
      url.searchParams.set("next", "/espace-membre");
      return NextResponse.redirect(url);
    }

    if (isAdminUser(user)) {
      return response;
    }

    const { data: purchases, error } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "paid")
      .limit(1);

    if (error || !purchases?.length) {
      const url = request.nextUrl.clone();
      url.pathname = "/formations";
      url.search = "";
      url.searchParams.set("reason", "member-only");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
