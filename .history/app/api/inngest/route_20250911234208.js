import { inngest } from "@/inngest/client";

await inngest.send({
  name: "clerk/user.created",
  data: {
    id: "user_test123",
    email_addresses: [{ email_address: "test@example.com" }],
    first_name: "John",
    last_name: "Doe",
    image_url: "https://example.com/avatar.png"
  }
});
