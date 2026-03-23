import { prisma } from "@/lib/prisma";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "z-ai/glm-4.5-air:free";

export type AiAction = "generate" | "improve" | "expand";
export type AiTone = "professional" | "technical" | "casual";

interface AiRequest {
  action: AiAction;
  content: string;
  tone?: AiTone;
  topic?: string;
  model?: string; // override from settings
}

const SYSTEM_PROMPTS: Record<AiAction, string> = {
  generate:
    "You are a professional copywriter specializing in developer portfolio websites. Write concise, engaging, and authentic content.",
  improve:
    "You are a professional editor. Improve writing quality while preserving the original meaning. Make it more engaging and professional.",
  expand:
    "You are a skilled technical writer. Write well-structured blog articles in Markdown with headers, code examples where relevant, and practical takeaways.",
};

const USER_PROMPTS: Record<AiAction, (topic: string, content: string) => string> = {
  generate: (topic, _) =>
    `Write a concise professional description (2-4 sentences) for a portfolio website about: "${topic}". Return ONLY the text, no quotes or markdown.`,
  improve: (_, content) =>
    `Improve this portfolio description (keep it 2-4 sentences). Return ONLY the improved text:\n\n${content}`,
  expand: (topic, content) =>
    `Write a comprehensive blog article about: "${topic || content}"\n\nInclude:\n- Engaging introduction\n- Well-organized sections with ## headers\n- Code examples if relevant\n- Practical tips\n- Conclusion\n\nFormat in Markdown.`,
};

export async function generateAiContent(request: AiRequest): Promise<string> {
  const { action, content, topic, model: modelOverride } = request;

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "AI not configured — add OPENROUTER_API_KEY to your .env file. Get a key at https://openrouter.ai"
    );
  }

  // Get model from DB settings if not overridden
  let model = modelOverride || DEFAULT_MODEL;
  if (!modelOverride) {
    try {
      const setting = await prisma.siteSetting.findUnique({ where: { key: "ai_model" } });
      if (setting?.value) model = setting.value;
    } catch { /* use default */ }
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-OpenRouter-Title": "Portfolio CMS",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[action] },
        { role: "user", content: USER_PROMPTS[action](topic || content, content) },
      ],
      max_tokens: action === "expand" ? 4000 : 300,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(err?.error?.message || `OpenRouter API error: ${res.status}`);
  }

  const data = await res.json();
  const result = data?.choices?.[0]?.message?.content?.trim();
  if (!result) throw new Error("No response from AI");

  return result;
}
