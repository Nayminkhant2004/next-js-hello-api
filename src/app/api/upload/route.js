import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";
import corsHeaders from "@/lib/cors";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    // 1. Check if file exists
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400, headers: corsHeaders });
    }

    // 2. Validate it is an image
    if (!file.type.startsWith("image/")) {
         return NextResponse.json({ error: "Only image files are allowed" }, { status: 400, headers: corsHeaders });
    }

    // 3. Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Generate unguessable name (Timestamp + Random String)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/\s/g, '_'); // Remove spaces

    // 5. Save to "public/uploads" folder
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // 6. Return the URL (This is what we save in the database)
    const imageUrl = `http://localhost:3000/uploads/${filename}`;
    return NextResponse.json({ url: imageUrl }, { headers: corsHeaders });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500, headers: corsHeaders });
  }
}
