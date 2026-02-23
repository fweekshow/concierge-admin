import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const rules = await prisma.houseRule.findMany({ orderBy: [{ category: "asc" }, { title: "asc" }] });
    return NextResponse.json(rules);
  } catch (error) {
    console.error("HouseRules GET error:", error);
    return NextResponse.json({ error: "Failed to fetch house rules" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const item = await prisma.houseRule.create({
      data: { title: body.title, content: body.content, category: body.category || null },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("HouseRules POST error:", error);
    return NextResponse.json({ error: "Failed to create house rule" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const item = await prisma.houseRule.update({
      where: { id: body.id },
      data: { title: body.title, content: body.content, category: body.category || null },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("HouseRules PUT error:", error);
    return NextResponse.json({ error: "Failed to update house rule" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await prisma.houseRule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("HouseRules DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete house rule" }, { status: 500 });
  }
}
