import { NextResponse } from "next/server";
import { getMockRisingStocks } from "@/lib/mockData";

export const revalidate = 900;

export async function GET() {
  try {
    const stocks = getMockRisingStocks("1m", 10);
    return NextResponse.json({ success: true, data: stocks, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch stocks" }, { status: 500 });
  }
}
