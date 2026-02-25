import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const guidelines = await prisma.guideline.findMany({ orderBy: [{ category: "asc" }, { title: "asc" }] });
    return NextResponse.json(guidelines);
  } catch (error) {
    console.error("Guidelines GET error:", error);
    return NextResponse.json({ error: "Failed to fetch guidelines" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const item = await prisma.guideline.create({
      data: { title: body.title, content: body.content, category: body.category || null },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Guidelines POST error:", error);
    return NextResponse.json({ error: "Failed to create guideline" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const item = await prisma.guideline.update({
      where: { id: body.id },
      data: { title: body.title, content: body.content, category: body.category || null },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Guidelines PUT error:", error);
    return NextResponse.json({ error: "Failed to update guideline" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await prisma.guideline.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guidelines DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete guideline" }, { status: 500 });
  }
}
