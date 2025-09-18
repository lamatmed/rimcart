import prisma from "@/lib/prisma";
import { inngest } from "./client";

// CREATE
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-create" },
  { event: ["clerk/user.created"] },
  async ({ event }) => {
    const { data } = event;
    console.log("🔥 syncUserCreation triggered", data);

    try {
      await prisma.user.create({
        data: {
          id: data.id,
          email: data.email_addresses?.[0]?.email_address ?? null,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          image: data.image_url ?? null,
        },
      });
    } catch (err) {
      console.error("❌ Error in syncUserCreation:", err);
    }
  }
);

// UPDATE
export const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update" },
  { event: ["clerk/user.updated"] },
  async ({ event }) => {
    const { data } = event;
    console.log("🔥 syncUserUpdate triggered", data);

    try {
      await prisma.user.update({
        where: { id: data.id },
        data: {
          email: data.email_addresses?.[0]?.email_address ?? null,
          name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          image: data.image_url ?? null,
        },
      });
    } catch (err) {
      console.error("❌ Error in syncUserUpdate:", err);
    }
  }
);

// DELETE
export const syncUserDelete = inngest.createFunction(
  { id: "sync-user-delete" },
  { event: ["clerk/user.deleted"] },
  async ({ event }) => {
    const { data } = event;
    console.log("🔥 syncUserDelete triggered", data);

    try {
      await prisma.user.delete({
        where: { id: data.id },
      });
    } catch (err) {
      console.error("❌ Error in syncUserDelete:", err);
    }
  }
);

// DELETE COUPON ON EXPIRY
export const deleteCouponOnExpiry = inngest.createFunction(
  { id: "delete-coupon-on-expiry" },
  { event: ["app/coupon.expired"] }, // 👉 tu déclencheras cet event quand un coupon expire
  async ({ event }) => {
    const { data } = event;
    console.log("🔥 deleteCouponOnExpiry triggered", data);
     const expiryDate =new Date()
    try {
      await prisma.coupon.delete({
        where: { code: data.code }, // on suppose que ton modèle Coupon a "code" unique
      });

      console.log(`✅ Coupon ${data.code} deleted on expiry`);
    } catch (err) {
      console.error("❌ Error in deleteCouponOnExpiry:", err);
    }
  }
);