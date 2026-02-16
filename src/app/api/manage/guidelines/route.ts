import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const guidelines = await prisma.guideline.findMany({ orderBy: { title: "asc" } });
    return NextResponse.json(guidelines);
  } catch (error) {
    console.error("Failed to fetch guidelines:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const guideline = await prisma.guideline.create({
      data: { title: body.title, content: body.content, category: body.category || null },
    });
    return NextResponse.json(guideline, { status: 201 });
  } catch (error) {
    console.error("Failed to create guideline:", error);
    return NextResponse.json({ error: "Failed to create guideline" }, { status: 500 });
  }
}

