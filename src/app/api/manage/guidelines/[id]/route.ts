import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

interface RouteParams { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    const body = await request.json();
    const guideline = await prisma.guideline.update({
      where: { id },
      data: { title: body.title, content: body.content, category: body.category || null },
    });
    return NextResponse.json(guideline);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update guideline" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    await prisma.guideline.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete guideline" }, { status: 500 });
  }
}

