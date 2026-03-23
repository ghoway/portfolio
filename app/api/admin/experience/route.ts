import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const data = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  await prisma.experience.create({
    data: {
      title: form.get("title") as string,
      company: form.get("company") as string,
      startDate: form.get("startDate") as string,
      endDate: (form.get("endDate") as string) || null,
      description: form.get("description") as string,
      order: parseInt(form.get("order") as string) || 0,
    },
  });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const id = form.get("id") as string;
  await prisma.experience.update({
    where: { id },
    data: {
      title: form.get("title") as string,
      company: form.get("company") as string,
      startDate: form.get("startDate") as string,
      endDate: (form.get("endDate") as string) || null,
      description: form.get("description") as string,
      order: parseInt(form.get("order") as string) || 0,
    },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
