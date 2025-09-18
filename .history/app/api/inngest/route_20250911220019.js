import { inngest } from "@/inngest/client.js";
import { syncUserCreation, syncUserUpdate, syncUserDelete } from "@/inngest/functions.js";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdate, syncUserDelete],
});
