import { inngest } from "@/inngest/client";
import { syncUserCreation, syncUserDelete, syncUserUpdate } from "@/inngest/functions";
import { serve } from "inngest/next";


// Create an API that serves zero functions
export const { GET, POST, PUT ,DELETE} = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDelete
  ],
});