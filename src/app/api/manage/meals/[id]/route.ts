import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    const meal = await prisma.mealTemplate.findUnique({ where: { id } });
    if (!meal) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(meal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch meal" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    const body = await request.json();
    const meal = await prisma.mealTemplate.update({
      where: { id },
      data: {
        mealType: body.mealType,
        items: body.items,
        startTime: body.startTime || null,
        endTime: body.endTime || null,
        daysOfWeek: body.daysOfWeek || [],
        notes: body.notes || null,
      },
    });
    return NextResponse.json(meal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update meal" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    await prisma.mealTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete meal" }, { status: 500 });
  }
}

