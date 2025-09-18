import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { syncUserCreation, syncUserUpdate, syncUserDelete } from "@/inngest/functions";

const isProd = process.env.NODE_ENV === "production";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdate, syncUserDelete],
  signingKey: isProd ? process.env.INNGEST_SIGNING_KEY : undefined, // ⛔ pas de clé en dev
  verifySignature: isProd, // ⛔ pas de vérif en dev
});
