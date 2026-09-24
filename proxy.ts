import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * HTTP Basic auth in front of /admin (the chat question log). Any username
 * works; the password is the ADMIN_PASSWORD env var. With no password set the
 * admin area doesn't exist (404), so a missing env var never exposes it.
 */
export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("Not found", { status: 404 });

  const [scheme, encoded] = (request.headers.get("authorization") ?? "").split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const supplied = decoded.slice(decoded.indexOf(":") + 1);
    // Hash both sides so the comparison is constant-time regardless of length.
    const digest = (s: string) => createHash("sha256").update(s).digest();
    if (timingSafeEqual(digest(supplied), digest(password))) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
