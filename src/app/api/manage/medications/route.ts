import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const meds = await prisma.userMeds.findMany({
      include: { user: { select: { id: true, walletAddress: true } } },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(meds);
  } catch (error) {
    console.error("Failed to fetch medications:", error);
    return NextResponse.json([], { status: 500 });
  }
}

