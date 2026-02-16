import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

interface RouteParams { params: Promise<{ id: string }> }

export async function DELETE(_req: Request, { params }: RouteParams) {
  try {
    const prisma = getPrisma();
    const { id } = await params;
    await prisma.userAssignedClient.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
  }
}

