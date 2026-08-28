import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ message: "API is working", timestamp: new Date().toISOString() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
