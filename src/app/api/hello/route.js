import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  const message = {
    message: "hello world"
  };

  return NextResponse.json(message, {
    headers: corsHeaders,
  });
}import { NextResponse } from "next/server";

export async function GET() {
  const message = {
    message: "hello world"
  };

  return NextResponse.json(message);
}
