export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdate, syncUserDelete],
  signingKey: "test",    // ✅ bypass complet
  verifySignature: false,
});
