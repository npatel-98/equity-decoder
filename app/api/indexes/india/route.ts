import { NextResponse } from "next/server";
import { fetchAllIndiaIndexes } from "@/lib/nseClient";
import { getMockIndiaIndexes } from "@/lib/mockData";

// Always fetch fresh data — market prices change every few seconds
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const indexes = await fetchAllIndiaIndexes();
    return NextResponse.json({
      success: true,
      data: indexes,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("All real data sources failed, using mock fallback:", error);
    const indexes = getMockIndiaIndexes();
    return NextResponse.json({
      success: true,
      data: indexes,
      updatedAt: new Date().toISOString(),
      source: "mock",
    });
  }
}
