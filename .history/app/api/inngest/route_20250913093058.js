export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdate, syncUserDelete],
  signingKey: process.env.INNGEST_SIGNING_KEY || "test",
  verifySignature: false,
});
