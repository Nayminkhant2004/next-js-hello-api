import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";
import bcrypt from "bcrypt";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET: Get all users (Hide passwords)
export async function GET(request) {
  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const users = await db.collection("user")
      .find({})
      .project({ password: 0 }) // Do not send passwords back!
      .sort({ _id: -1 })
      .toArray();

    return NextResponse.json(users, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}

// POST: Create a new user (Hash password)
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, email, firstname, lastname, status } = body;

    if (!username || !password || !email) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400, headers: corsHeaders });
    }

    const client = await getClientPromise();
    const db = client.db("wad-01");

    // Check if user exists
    const existing = await db.collection("user").findOne({ $or: [{ username }, { email }] });
    if (existing) {
        return NextResponse.json({ error: "User already exists" }, { status: 400, headers: corsHeaders });
    }

    const newUser = {
        username,
        email,
        password: await bcrypt.hash(password, 10), // Hash the password
        firstname,
        lastname,
        status: status || "Active"
    };

    const result = await db.collection("user").insertOne(newUser);
    return NextResponse.json(result, { headers: corsHeaders });
  } catch (error) {
     return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
}
