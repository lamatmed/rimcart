import { inngest } from "./client";
import prisma from "@/lib/prisma";

// CREATE
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  {  event: "webhook-integration/user.created" },
  async ({ event }) => {
    try {
      const { data } = event;

      console.log("📩 Clerk user.created received:", {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address,
      });

      const user = await prisma.user.create({
        data: {
          id: data.id,
          email: data.email_addresses?.[0]?.email_address ?? "",
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          image: data.image_url ?? null,
          cart: {}, // ton modèle User a un champ JSON obligatoire
        },
      });

      console.log("✅ User created in DB:", user);
      return user;
    } catch (err) {
      console.error("❌ Error creating user:", err);
      throw err;
    }
  }
);

// UPDATE
export const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const { data } = event;

      const updated = await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data.email_addresses?.[0]?.email_address ?? "",
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          image: data.image_url ?? null,
        },
      });

      console.log("🔄 User updated in DB:", updated);
      return updated;
    } catch (err) {
      console.error("❌ Error updating user:", err);
      throw err;
    }
  }
);

// DELETE
export const syncUserDelete = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      const { data } = event;

      await prisma.user.delete({
        where: { id: data.id },
      });

      console.log("🗑️ User deleted in DB:", data.id);
      return { deletedId: data.id };
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      throw err;
    }
  }
);
