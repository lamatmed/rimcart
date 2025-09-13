export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUserCreation, syncUserUpdate, syncUserDelete],
  signingKey: "test",   // 🔑 bypass signature
  verifySignature: false,
});
