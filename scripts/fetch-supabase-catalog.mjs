import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const supabaseUrl = process.env.MEGADRUM_SUPABASE_URL?.replace(/\/$/, "");
const anonKey = process.env.MEGADRUM_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  throw new Error(
    "Set MEGADRUM_SUPABASE_URL and MEGADRUM_SUPABASE_ANON_KEY to refresh the public catalog snapshot.",
  );
}

const columns = [
  "id",
  "name",
  "cover_url",
  "background_url",
  "is_premium",
  "is_default",
  "need_user_task",
  "sort_order",
  "unlock_lesson_id",
].join(",");
const endpoint = `${supabaseUrl}/rest/v1/kits?select=${columns}&order=sort_order.asc`;
const response = await fetch(endpoint, {
  headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
});

if (!response.ok) {
  throw new Error(`Supabase catalog request failed (${response.status}).`);
}

const kits = await response.json();
if (!Array.isArray(kits) || kits.length === 0) {
  throw new Error("Supabase returned an empty or invalid kit catalog.");
}

const destination = path.join(root, "data", "source", "supabase-kits.json");
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(destination, `${JSON.stringify(kits, null, 2)}\n`);
console.log(`Supabase snapshot refreshed: ${kits.length} public kits.`);
