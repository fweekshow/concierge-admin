import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env file manually
const envPath = join(process.cwd(), ".env");
try {
  const envFile = readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      const value = valueParts.join("=").trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value;
      }
    }
  });
} catch (error) {
  console.warn("Could not load .env file, using environment variables");
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/**
 * Seed script to populate ActionConfig table with existing quick actions
 * from the concierge-reddoor agent
 */
async function main() {
  console.log("🌱 Seeding action configurations...");

  const actions = [
    {
      actionId: "mainmenu-schedule",
      label: "📅 Schedule",
      enabled: true,
      responseType: "static",
      staticText: "📅 Here is today's schedule...",
      dataSource: null,
      templateFormat: null,
    },
    {
      actionId: "mainmenu-meals",
      label: "🍴 Meals",
      enabled: true,
      responseType: "database",
      staticText: null,
      dataSource: "meals",
      templateFormat: null,
    },
    {
      actionId: "mainmenu-activities",
      label: "🏃 Activities",
      enabled: true,
      responseType: "database",
      staticText: null,
      dataSource: "activities",
      templateFormat: null,
    },
    {
      actionId: "mainmenu-logistics",
      label: "🧳 Logistics",
      enabled: true,
      responseType: "static",
      staticText: "🧳 Logistics info here...",
      dataSource: null,
      templateFormat: null,
    },
    {
      actionId: "mainmenu-medication",
      label: "💊 Medications",
      enabled: true,
      responseType: "database",
      staticText: null,
      dataSource: "medications",
      templateFormat: null,
    },
    {
      actionId: "mainmenu-guidelines",
      label: "📖 Guidelines",
      enabled: true,
      responseType: "database",
      staticText: null,
      dataSource: "guidelines",
      templateFormat: null,
    },
    {
      actionId: "mainmenu-houserules",
      label: "🏠 House Rules",
      enabled: true,
      responseType: "database",
      staticText: null,
      dataSource: "houseRules",
      templateFormat: null,
    },
    {
      actionId: "mainmenu-support-request",
      label: "🆘 Request Support",
      enabled: true,
      responseType: "static",
      staticText: "🆘 Support request sent!",
      dataSource: null,
      templateFormat: null,
    },
    {
      actionId: "mainmenu-advocates",
      label: "🙋 Advocates",
      enabled: true,
      responseType: "database",
      staticText: null,
      dataSource: "advocates",
      templateFormat: null,
    },
  ];

  for (const action of actions) {
    try {
      await prisma.actionConfig.upsert({
        where: { actionId: action.actionId },
        update: {
          label: action.label,
          enabled: action.enabled,
          responseType: action.responseType,
          staticText: action.staticText,
          dataSource: action.dataSource,
          templateFormat: action.templateFormat,
        },
        create: action,
      });
      console.log(`✅ ${action.actionId} - ${action.label}`);
    } catch (error) {
      console.error(`❌ Failed to seed ${action.actionId}:`, error);
    }
  }

  console.log("✨ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

