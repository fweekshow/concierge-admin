import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    const activity = await prisma.activityTemplate.findUnique({ where: { id } });
    if (!activity) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    const body = await request.json();
    const activity = await prisma.activityTemplate.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        startTime: body.startTime,
        endTime: body.endTime,
        location: body.location || null,
        daysOfWeek: body.daysOfWeek || [],
        notes: body.notes || null,
      },
    });
    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    await prisma.activityTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}

