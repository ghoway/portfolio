import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids } = await request.json() as { ids: string[] };

  await Promise.all(
    ids.map((id, index) =>
      prisma.skill.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
