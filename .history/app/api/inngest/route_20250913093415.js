import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { syncUserCreation, syncUserUpdate, syncUserDelete } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdate, syncUserDelete],
  signingKey: process.env.INNGEST_SIGNING_KEY || "signkey-prod-a51ffddaadcd71929212b7231755c4584a9a088c902aa1069790f77cae7eff1e",
  verifySignature: false,
});
