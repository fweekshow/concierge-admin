import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

// Map action IDs to their database tables
const ACTION_MAP = {
  "mainmenu-meals": {
    label: "🍴 Meals",
    table: "MealTemplate",
  },
  "mainmenu-activities": {
    label: "🏃 Activities",
    table: "ActivityTemplate",
  },
  "mainmenu-guidelines": {
    label: "📖 Guidelines",
    table: "Guideline",
  },
  "mainmenu-houserules": {
    label: "🏠 House Rules",
    table: "HouseRule",
  },
} as const;

export async function GET() {
  try {
    const prisma = getPrisma();
    const actions = [];

    // Get counts and sample data for each action
    for (const [actionId, config] of Object.entries(ACTION_MAP)) {
      let count = 0;
      let sampleData = null;

      try {
        switch (config.table) {
          case "MealTemplate":
            count = await prisma.mealTemplate.count().catch(() => 0);
            sampleData = await prisma.mealTemplate.findFirst().catch(() => null);
            break;
          case "ActivityTemplate":
            count = await prisma.activityTemplate.count().catch(() => 0);
            sampleData = await prisma.activityTemplate.findFirst().catch(() => null);
            break;
          case "Guideline":
            count = await prisma.guideline.count().catch(() => 0);
            sampleData = await prisma.guideline.findFirst().catch(() => null);
            break;
          case "HouseRule":
            count = await prisma.houseRule.count().catch(() => 0);
            sampleData = await prisma.houseRule.findFirst().catch(() => null);
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${config.table}:`, error);
        // Continue with default values
      }

      actions.push({
        actionId,
        label: config.label,
        table: config.table,
        count,
        hasData: count > 0,
        sampleData: sampleData ? { id: sampleData.id, title: (sampleData as any).title || (sampleData as any).name || null } : null,
      });
    }

    return NextResponse.json(actions);
  } catch (error) {
    console.error("Failed to fetch quick actions:", error);
    // Return empty array instead of error to prevent app crashes
    return NextResponse.json([]);
  }
}

