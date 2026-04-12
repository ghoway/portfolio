import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "general";
    const limit = parseInt(searchParams.get("limit") || "10");

    const images = await prisma.imageUpload.findMany({
      where: folder ? { folder } : {},
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        secureUrl: true,
        cloudinaryId: true,
        width: true,
        height: true,
        createdAt: true,
      },
    });

    console.log("📸 Recent images query:", { folder, limit, found: images.length });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Fetch recent images error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
