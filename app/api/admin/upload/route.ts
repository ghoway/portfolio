import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "general";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG" },
      { status: 400 }
    );
  }

  // Create upload directory
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filepath = path.join(uploadDir, filename);

  // Write file
  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  const url = `/uploads/${folder}/${filename}`;
  return NextResponse.json({ url, filename });
}
