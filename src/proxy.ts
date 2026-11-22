import { NextResponse, type NextRequest } from "next/server";

/**
 * Menetapkan visitor id agar varian landing page (A/B testing) konsisten
 * untuk pengunjung yang sama. Tidak memerlukan akses database sehingga aman
 * dijalankan pada middleware edge.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  if (!request.cookies.get("rd_vid")) {
    response.cookies.set("rd_vid", crypto.randomUUID(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
