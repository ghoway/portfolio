import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json() as { url: string };

  if (!url || !url.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const filepath = path.join(process.cwd(), "public", url);

  if (existsSync(filepath)) {
    await unlink(filepath);
  }

  return NextResponse.json({ success: true });
}
