import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { slug?: string; type?: string };
    if (!body.slug) return NextResponse.json({ ok: false }, { status: 400 });

    const variant = await prisma.landingVariant.findUnique({ where: { slug: body.slug } });
    if (!variant) return NextResponse.json({ ok: false }, { status: 404 });

    if (body.type === "conversion") {
      await prisma.landingVariant.update({
        where: { slug: body.slug },
        data: { conversions: { increment: 1 } },
      });
    } else {
      await prisma.landingVariant.update({
        where: { slug: body.slug },
        data: { clicks: { increment: 1 } },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
