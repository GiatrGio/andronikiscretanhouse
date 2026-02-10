import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const imagesDirectory = path.join(process.cwd(), "public/images/courses");
    const files = fs.readdirSync(imagesDirectory);

    // Filter for image files and sort them
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort()
      .map(file => `/images/courses/${file}`);

    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error("Error reading course images:", error);
    return NextResponse.json({ images: [] });
  }
}
