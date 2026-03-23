import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids)) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const updates = ids.map((id: string, index: number) =>
      prisma.project.update({ where: { id }, data: { order: index } })
    );

    // Execute all updates in a transaction
    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder failed:", error);
    return NextResponse.json({ error: "Failed to reorder projects" }, { status: 500 });
  }
}
