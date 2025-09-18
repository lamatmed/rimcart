import { inngest } from "../../../inngest/client";
import { syncUserCreation, syncUserDelete, syncUserUpdate } from "../";
import { serve } from "inngest/next";


// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDelete
  ],
});