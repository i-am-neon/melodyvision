import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as Blob;

  if (!image) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }

  const buffer = Buffer.from(await image.arrayBuffer());

  const hfResponse = await fetch(
    "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      method: "POST",
      body: buffer,
    }
  );

  if (!hfResponse.ok) {
    const error = await hfResponse.json();
    return NextResponse.json(
      { error: error.error || "Failed to describe image" },
      { status: 500 }
    );
  }

  const result = await hfResponse.json();
  const description = result[0]?.generated_text || "No description found.";

  return NextResponse.json({ description });
}

