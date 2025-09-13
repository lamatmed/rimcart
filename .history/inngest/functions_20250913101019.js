import prisma from "@/lib/prisma";
import { inngest } from "./client";

// CREATE
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: "webhook-integration/user.created" },
  async ({ event }) => {
    const { data } = event;
    console.log("🔥 syncUserCreation triggered", data);

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address ?? null,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
    });
  }
);

// UPDATE
export const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "webhook-integration/user.updated" },
  async ({ event }) => {
    const { data } = event;
    console.log("🔥 syncUserUpdate triggered", data);

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses?.[0]?.email_address ?? null,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
    });
  }
);

// DELETE
export const syncUserDelete = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: "webhook-integration/user.deleted" },
  async ({ event }) => {
    const { data } = event;
    console.log("🔥 syncUserDelete triggered", data);

    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);
