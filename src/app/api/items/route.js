import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET: Fetch items with pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5"); // Default 5 items per page
    const skip = (page - 1) * limit;

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const items = await db.collection("item")
      .find({})
      .sort({ _id: -1 }) // Show newest first
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection("item").countDocuments();

    return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit) }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// POST: Create a new item
export async function POST(request) {
  try {
    const body = await request.json();
    const { itemName, itemCategory, itemPrice, status } = body;

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").insertOne({
        itemName, 
        itemCategory, 
        itemPrice: parseFloat(itemPrice), // Ensure price is a number
        status
    });

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
     return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
