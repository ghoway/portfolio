import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await prisma.skill.findMany({ orderBy: { order: "asc" } }));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  await prisma.skill.create({
    data: {
      name: form.get("name") as string,
      category: form.get("category") as string,
      level: parseInt(form.get("level") as string) || 50,
      icon: (form.get("icon") as string) || "code",
      order: parseInt(form.get("order") as string) || 0,
    },
  });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  await prisma.skill.update({
    where: { id: form.get("id") as string },
    data: {
      name: form.get("name") as string,
      category: form.get("category") as string,
      level: parseInt(form.get("level") as string) || 50,
      icon: (form.get("icon") as string) || "code",
      order: parseInt(form.get("order") as string) || 0,
    },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
