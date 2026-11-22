import { prisma } from "./prisma";

export type Settings = Record<string, string>;

export async function getSettings(): Promise<Settings> {
  const rows = await prisma.setting.findMany({ where: { isPublic: true } });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

export async function getAllSettings() {
  return prisma.setting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] });
}

export async function getSettingGroups() {
  const rows = await getAllSettings();
  const groups = new Map<string, typeof rows>();
  for (const row of rows) {
    const list = groups.get(row.group) ?? [];
    list.push(row);
    groups.set(row.group, list);
  }
  return Array.from(groups.entries());
}

/** Ambil setting sebagai angka dengan fallback. */
export function numericSetting(settings: Settings, key: string, fallback = 0): number {
  const raw = settings[key];
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}
