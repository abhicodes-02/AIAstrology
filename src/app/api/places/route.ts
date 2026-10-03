import { NextRequest, NextResponse } from "next/server";
import { getCoordinates } from "@/lib/geocoding";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const data = await getCoordinates(q);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Places API Error:", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}
