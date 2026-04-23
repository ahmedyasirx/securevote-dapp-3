import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const logPath = path.join(process.cwd(), "data", "audit-log.json");

async function readLog() {
  try {
    const content = await fs.readFile(logPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function GET() {
  const entries = await readLog();
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const entries = await readLog();
  entries.push(payload);
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.writeFile(logPath, JSON.stringify(entries, null, 2));
  return NextResponse.json({ ok: true, total: entries.length });
}
