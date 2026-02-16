import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const activities = await prisma.activityTemplate.findMany({ orderBy: { startTime: "asc" } });
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const activity = await prisma.activityTemplate.create({
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
    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Failed to create activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

