import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const items = await prisma.certification.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  await prisma.certification.create({
    data: {
      title: form.get("title") as string,
      issuer: form.get("issuer") as string,
      issueDate: form.get("issueDate") as string,
      expiryDate: (form.get("expiryDate") as string) || null,
      credentialId: (form.get("credentialId") as string) || null,
      credentialUrl: (form.get("credentialUrl") as string) || null,
      imageUrl: (form.get("imageUrl") as string) || null,
      isActive: form.get("isActive") === "true",
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
  await prisma.certification.update({
    where: { id },
    data: {
      title: form.get("title") as string,
      issuer: form.get("issuer") as string,
      issueDate: form.get("issueDate") as string,
      expiryDate: (form.get("expiryDate") as string) || null,
      credentialId: (form.get("credentialId") as string) || null,
      credentialUrl: (form.get("credentialUrl") as string) || null,
      imageUrl: (form.get("imageUrl") as string) || null,
      isActive: form.get("isActive") === "true",
    },
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json();
  await prisma.certification.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
