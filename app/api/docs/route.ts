import { NextResponse } from "next/server";
import { getApiDocs } from "./schema";

export function GET() {
  return NextResponse.json(getApiDocs());
}
