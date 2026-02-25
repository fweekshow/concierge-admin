import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const assignments = await prisma.userAssignedClient.findMany({
      include: {
        advocate: { select: { id: true, name: true, walletAddress: true } },
        client: { select: { id: true, name: true, walletAddress: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Assignments GET error:", error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    if (!body.advocateUserId || !body.clientUserId) {
      return NextResponse.json({ error: "Missing advocateUserId or clientUserId" }, { status: 400 });
    }
    const assignment = await prisma.userAssignedClient.create({
      data: {
        advocateUserId: body.advocateUserId,
        clientUserId: body.clientUserId,
      },
      include: {
        advocate: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Assignments POST error:", error);
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await prisma.userAssignedClient.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Assignments DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
  }
}
