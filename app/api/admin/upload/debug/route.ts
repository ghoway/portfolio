import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allImages = await prisma.imageUpload.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        cloudinaryId: true,
        folder: true,
        createdAt: true,
      },
    });

    const imagesByFolder = allImages.reduce(
      (acc: Record<string, number>, img) => {
        acc[img.folder] = (acc[img.folder] || 0) + 1;
        return acc;
      },
      {}
    );

    return NextResponse.json({
      totalImages: allImages.length,
      imagesByFolder,
      recentImages: allImages.slice(0, 10),
    });
  } catch (error) {
    console.error("Debug images error:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug info", details: String(error) },
      { status: 500 }
    );
  }
}
