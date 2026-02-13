import { getClientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// PUT: Update user info
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { firstname, lastname, email, status } = body; // We generally don't update password here for simplicity

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("user").updateOne(
        { _id: new ObjectId(id) },
        { $set: { firstname, lastname, email, status } }
    );

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// DELETE: Delete user
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("user").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
