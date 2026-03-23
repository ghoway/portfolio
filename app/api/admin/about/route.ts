import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const about = await prisma.aboutSection.findFirst();
  return NextResponse.json(about);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await request.formData();
  const id = form.get("id") as string;
  await prisma.aboutSection.update({
    where: { id },
    data: {
      biography: form.get("biography") as string,
      careerGoals: form.get("careerGoals") as string,
      cvLink: (form.get("cvLink") as string) || null,
    },
  });
  return NextResponse.json({ success: true });
}
