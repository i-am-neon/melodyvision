/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

async function fetchMusic(prompt: string, retries = 3): Promise<Response> {
  try {
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-melody",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!hfResponse.ok) {
      if (hfResponse.status === 503 && retries > 0) {
        console.log(`Model is busy. Retrying... Attempts left: ${retries - 1}`);
        // Exponential backoff before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, (4 - retries) * 1000)
        );
        return fetchMusic(prompt, retries - 1);
      }

      const error = await hfResponse.json();
      console.error(
        `Error from Hugging Face API: ${error.error || "Unknown error"}`
      );
      throw new Error(error.error || "Failed to generate music");
    }

    return hfResponse;
  } catch (error: any) {
    console.error(
      `Fetch failed: ${error.message || "Unknown error"} on retry: ${
        3 - retries
      }`
    );
    throw new Error(error.message || "Failed to fetch music");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      console.error("No prompt provided.");
      return NextResponse.json(
        { error: "No prompt provided." },
        { status: 400 }
      );
    }

    const hfResponse = await fetchMusic(prompt);
    const arrayBuffer = await hfResponse.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    console.log("Music generation successful.");
    return NextResponse.json({ audioContent: base64Audio });
  } catch (error: any) {
    console.error(`Music generation failed: ${error.message}`);
    return NextResponse.json(
      { error: error.message || "Failed to generate music" },
      { status: 500 }
    );
  }
}

