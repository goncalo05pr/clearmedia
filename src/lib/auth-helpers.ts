import type { User } from "@supabase/supabase-js";

/** Admin : role "admin" dans app_metadata ou user_metadata (Supabase Dashboard ou hook). */
export function isAdminUser(user: User | null): boolean {
  if (!user) return false;
  const app = user.app_metadata as Record<string, unknown> | undefined;
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  return app?.role === "admin" || meta?.role === "admin";
}
