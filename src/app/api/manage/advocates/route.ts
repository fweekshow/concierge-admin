import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();

    // Get all assignments with user info
    const assignments = await prisma.userAssignedClient.findMany({
      include: {
        advocate: { include: { role: true } },
        client: { include: { role: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get all users for the dropdowns
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { walletAddress: "asc" },
    });

    return NextResponse.json({ assignments, users });
  } catch (error) {
    console.error("Failed to fetch advocates:", error);
    return NextResponse.json({ assignments: [], users: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const assignment = await prisma.userAssignedClient.create({
      data: {
        advocateUserId: body.advocateUserId,
        clientUserId: body.clientUserId,
      },
      include: {
        advocate: { include: { role: true } },
        client: { include: { role: true } },
      },
    });
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Failed to create assignment:", error);
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}

