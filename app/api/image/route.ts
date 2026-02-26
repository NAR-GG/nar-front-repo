import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const CACHE_DIR = process.env.VERCEL
  ? "/tmp/image-cache"
  : path.join(process.cwd(), ".next", "cache", "images");

function keyOf(url: string, w: number, q: number) {
  return createHash("md5").update(`${url}_${w}_${q}`).digest("hex");
}

async function readCache(filePath: string) {
  try {
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

async function writeCache(filePath: string, data: Buffer) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, data);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

async function fetchWithTimeout(url: string, ms = 5000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "image/*" },
      cache: "no-store",
    });
  } finally {
    clearTimeout(t);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const w = clamp(Number(searchParams.get("w") ?? 96), 16, 256);
  const q = clamp(Number(searchParams.get("q") ?? 75), 50, 85);

  const key = keyOf(url, w, q);
  const filePath = path.join(CACHE_DIR, `${key}.webp`);

  const cached = await readCache(filePath);
  if (cached) {
    return new NextResponse(new Uint8Array(cached), {
      headers: {
        "Content-Type": "image/webp",
        "X-Cache": "HIT",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  }

  // 2) MISS: fetch -> sharp -> save
  let res: Response;
  try {
    res = await fetchWithTimeout(url, 7000);
  } catch {
    return NextResponse.json(
      { error: "Upstream timeout/fetch failed" },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: res.status },
    );
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Upstream is not an image" },
      { status: 415 },
    );
  }

  const input = Buffer.from(await res.arrayBuffer());

  const optimized = await sharp(input)
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality: q, effort: 2 })
    .toBuffer();
  await writeCache(filePath, optimized);

  return new NextResponse(new Uint8Array(optimized), {
    headers: {
      "Content-Type": "image/webp",
      "X-Cache": "MISS",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
}
