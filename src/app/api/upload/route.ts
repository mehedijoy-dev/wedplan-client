import { NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 5MB" },
        { status: 400 },
      );
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const body = new FormData();
    body.append("image", base64);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      { method: "POST", body },
    );
    const data = await res.json();

    if (!res.ok || !data.success) {
      return NextResponse.json(
        { error: "Image upload failed. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: data.data.url });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong while uploading" },
      { status: 500 },
    );
  }
}
