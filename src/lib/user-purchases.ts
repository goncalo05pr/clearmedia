import type { SupabaseClient } from "@supabase/supabase-js";

export type PaidFormationIdsResult =
  | { ok: true; ids: Set<string> }
  | { ok: false; error: string };

export async function getPaidFormationIds(
  supabase: SupabaseClient,
  userId: string,
): Promise<PaidFormationIdsResult> {
  const { data, error } = await supabase
    .from("purchases")
    .select("formation_id")
    .eq("user_id", userId)
    .eq("status", "paid");

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    ids: new Set((data ?? []).map((row) => row.formation_id as string)),
  };
}
