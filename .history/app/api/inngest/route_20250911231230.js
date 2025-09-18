// /app/api/inngest/route.js (ou .ts si TypeScript)

import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// === Prisma Neon config ===
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// === Inngest client ===
const inngest = new Inngest({ id: "rim-cart" });

// === CREATE ===
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "webhook-integration/user.created" }, // ⚡️ même nom que dans Inngest Dashboard
  async ({ event }) => {
    const { data } = event;

    console.log("📩 User.created reçu:", {
      id: data.id,
      email: data.email_addresses?.[0]?.email_address,
    });

    const user = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address ?? "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
        cart: {},
      },
    });

    console.log("✅ User inséré:", user);
    return user;
  }
);

// === UPDATE ===
const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "webhook-integration/user.updated" },
  async ({ event }) => {
    const { data } = event;

    const updated = await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses?.[0]?.email_address ?? "",
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
    });

    console.log("🔄 User mis à jour:", updated);
    return updated;
  }
);

// === DELETE ===
const syncUserDelete = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "webhook-integration/user.deleted" },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({ where: { id: data.id } });

    console.log("🗑️ User supprimé:", data.id);
    return { deletedId: data.id };
  }
);

// === Expose route ===
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdate, syncUserDelete],
});
