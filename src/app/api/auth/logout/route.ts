import { cookies } from "next/headers";

import { nomeCookie } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  (await cookies()).delete(nomeCookie);
  return Response.redirect(new URL("/login", request.url), 303);
}
