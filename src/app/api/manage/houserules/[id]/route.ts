import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

interface RouteParams { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    const body = await request.json();
    const rule = await prisma.houseRule.update({
      where: { id },
      data: { title: body.title, content: body.content, category: body.category || null },
    });
    return NextResponse.json(rule);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update house rule" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    await prisma.houseRule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete house rule" }, { status: 500 });
  }
}

