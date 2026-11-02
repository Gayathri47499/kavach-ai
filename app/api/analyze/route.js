import { NextResponse } from "next/server";
import { analyzeScamWithGemini } from "../../../lib/gemini";

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, imageBase64, imageMimeType, language } = body;

    if (!text && !imageBase64) {
      return NextResponse.json(
        { success: false, error: "Please provide either text or upload a screenshot to analyze." },
        { status: 400 }
      );
    }

    const result = await analyzeScamWithGemini({
      text,
      imageBase64,
      imageMimeType,
      language: language || "en",
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("API /api/analyze Error:", err);
    const message = err.message || "An unexpected error occurred.";
    const isKeyMissing = message.includes("MISSING_API_KEY");

    return NextResponse.json(
      {
        success: false,
        error: message,
        isKeyMissing,
      },
      { status: isKeyMissing ? 401 : 500 }
    );
  }
}
