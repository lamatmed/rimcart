import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { syncUserCreation, syncUserUpdate, syncUserDelete } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdate, syncUserDelete],
  signingKey: process.env.INNGEST_SIGNING_KEY || "",
  verifySignature: false,
});
