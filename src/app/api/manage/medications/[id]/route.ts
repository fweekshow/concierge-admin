import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

interface RouteParams { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    const med = await prisma.userMeds.findUnique({
      where: { id },
      include: { user: { select: { id: true, walletAddress: true } } },
    });
    if (!med) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(med);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch medication" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    const body = await request.json();
    const med = await prisma.userMeds.update({
      where: { id },
      data: { schedule: body.schedule },
    });
    return NextResponse.json(med);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update medication" }, { status: 500 });
  }
}

