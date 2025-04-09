// app/api/upload-hobby-image/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  try {
    const response = await fetch("https://rangrezsamaj.kunxite.com/", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Server proxy error:", error);
    return NextResponse.json(
      { status: "error", message: "Upload failed" },
      { status: 500 }
    );
  }
}
