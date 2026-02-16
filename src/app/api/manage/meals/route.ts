import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const meals = await prisma.mealTemplate.findMany({ orderBy: { startTime: "asc" } });
    return NextResponse.json(meals);
  } catch (error) {
    console.error("Failed to fetch meals:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const meal = await prisma.mealTemplate.create({
      data: {
        mealType: body.mealType,
        items: body.items || [],
        startTime: body.startTime || null,
        endTime: body.endTime || null,
        daysOfWeek: body.daysOfWeek || [],
        notes: body.notes || null,
      },
    });
    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error("Failed to create meal:", error);
    return NextResponse.json({ error: "Failed to create meal" }, { status: 500 });
  }
}

