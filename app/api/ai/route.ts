import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateAiContent, type AiAction, type AiTone } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, content, tone, topic } = body as {
      action: AiAction;
      content: string;
      tone?: AiTone;
      topic?: string;
    };

    if (!action || !content) {
      return NextResponse.json(
        { error: "Action and content are required" },
        { status: 400 }
      );
    }

    const result = await generateAiContent({ action, content, tone, topic });
    console.log(`[AI Response - ${action}]:\n`, result);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI API Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate AI content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
