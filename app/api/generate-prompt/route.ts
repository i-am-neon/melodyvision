/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI();

export async function POST(request: NextRequest) {
  const { description } = await request.json();

  if (!description) {
    return NextResponse.json(
      { error: "No description provided." },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Create a detailed musical prompt based on the following description for a music generation model: "${description}"`,
        },
      ],
    });

    const prompt = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ prompt });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to generate prompt" },
      { status: 500 }
    );
  }
}

