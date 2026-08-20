// Demo seed. Loads .env manually, then populates a lively demo dataset.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Minimal .env loader (so we don't need extra deps)
for (const line of readFileSync(join(__dirname, "..", ".env"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) {
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const client = await prisma.user.findUnique({
    where: { email: "client@example.com" },
  });
  const designer = await prisma.user.findUnique({
    where: { email: "designer@example.com" },
  });
  if (!client || !designer) {
    console.log("Demo client/designer not found — sign them up first. Skipping.");
    return;
  }

  // Verify + approve the demo accounts and enrich profiles.
  await prisma.user.update({
    where: { id: client.id },
    data: {
      verificationStatus: "APPROVED",
      onboarded: true,
      company: "Bunna Café",
      location: "Addis Ababa",
      headline: "Owner at Bunna Café",
    },
  });
  await prisma.user.update({
    where: { id: designer.id },
    data: {
      verificationStatus: "APPROVED",
      onboarded: true,
      headline: "Brand & logo designer",
      bio: "5+ years designing brands for cafés, startups and events. I love clean, memorable marks.",
      location: "Addis Ababa",
      skills: "Logo design, Branding, Illustration, Figma, Packaging",
      portfolioUrl: "behance.net/dawit",
      hourlyRate: 450,
    },
  });

  const sampleJobs = [
    {
      title: "Logo for a specialty coffee brand",
      description:
        "We're launching a specialty coffee brand and need a warm, modern logo. Looking for something that feels premium but friendly. Please share past coffee/food branding work.",
      category: "Logo & Branding",
      budgetType: "FIXED",
      budgetMin: 3000,
      budgetMax: 5000,
      currency: "ETB",
      location: "Remote",
      status: "POSTED",
      postedToTelegram: true,
    },
    {
      title: "Instagram post pack (10 designs)",
      description:
        "Need a set of 10 cohesive Instagram posts for a product launch. We'll provide brand colors and copy. Deliver as editable templates.",
      category: "Social Media Graphics",
      budgetType: "FIXED",
      budgetMin: 1500,
      budgetMax: 2500,
      currency: "ETB",
      location: "Remote",
      status: "POSTED",
      postedToTelegram: true,
    },
    {
      title: "Event poster for a music night",
      description:
        "Design an eye-catching A2 poster for a live music night. Bold, energetic style. Need print-ready files.",
      category: "Poster & Flyer",
      budgetType: "NEGOTIABLE",
      currency: "ETB",
      status: "PENDING_REVIEW",
    },
  ];

  // Only seed jobs once.
  const existing = await prisma.job.count({ where: { clientId: client.id } });
  if (existing === 0) {
    for (const j of sampleJobs) {
      await prisma.job.create({ data: { ...j, clientId: client.id } });
    }

    const firstPosted = await prisma.job.findFirst({
      where: { clientId: client.id, status: "POSTED" },
    });
    if (firstPosted) {
      await prisma.application.create({
        data: {
          jobId: firstPosted.id,
          designerId: designer.id,
          message:
            "Hi! I've branded three cafés in Addis and would love to help. I'd start with 3 logo directions, then refine your favorite. Portfolio: behance.net/dawit",
          proposedPrice: 4000,
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
