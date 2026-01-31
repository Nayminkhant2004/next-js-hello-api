import { getClientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// PUT: Update an existing item
export async function PUT(request, { params }) {
  try {
    const { id } = await params; 
    const body = await request.json();
    const { itemName, itemCategory, itemPrice, status } = body;

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").updateOne(
        { _id: new ObjectId(id) },
        { $set: { itemName, itemCategory, itemPrice, status } }
    );

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// DELETE: Remove an item
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
