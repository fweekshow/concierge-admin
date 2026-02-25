import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrisma();
    const users = await prisma.user.findMany({
      include: {
        role: { select: { id: true, name: true } },
        assignedClients: { include: { client: { select: { id: true, name: true } } } },
        assignedAdvocate: { include: { advocate: { select: { id: true, name: true } } } },
      },
      orderBy: [{ lastSeenAt: "desc" }],
    });
    const mapped = users.map((u) => ({
      ...u,
      roleId: u.roleId,
      role: u.role?.name ?? "UNKNOWN",
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const prisma = getPrisma();
    const { userId, roleId, name } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const data: Record<string, any> = {};
    if (roleId) data.roleId = roleId;
    if (name !== undefined) data.name = name || null;
    await prisma.user.update({ where: { id: userId }, data });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Users PUT error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
