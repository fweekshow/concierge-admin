import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const rules = await prisma.houseRule.findMany({ orderBy: { title: "asc" } });
    return NextResponse.json(rules);
  } catch (error) {
    console.error("Failed to fetch house rules:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const rule = await prisma.houseRule.create({
      data: { title: body.title, content: body.content, category: body.category || null },
    });
    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("Failed to create house rule:", error);
    return NextResponse.json({ error: "Failed to create house rule" }, { status: 500 });
  }
}

