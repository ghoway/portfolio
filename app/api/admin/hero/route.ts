import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const hero = await prisma.heroSection.findFirst();
  return NextResponse.json(hero);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const id = form.get("id") as string;
  await prisma.heroSection.update({
    where: { id },
    data: {
      name: form.get("name") as string,
      subtitle: form.get("subtitle") as string,
      description: form.get("description") as string,
      showHireMe: form.get("showHireMe") === "true",
      profileImageUrl: (form.get("profileImageUrl") as string) || null,
    },
  });
  return NextResponse.json({ success: true });
}
