import { inngest } from "./client";
// CREATE
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-create' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const { data } = event

      const user = await prisma.user.create({
        data: {
          id: data.id,
          email: data.email_addresses[0]?.email_address ?? '',
          name: `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim(),
          image: data.image_url,
        },
      })

      console.log('✅ User created in DB:', user)
    } catch (err) {
      console.error('❌ Error creating user:', err)
      throw err
    }
  }
)
// UPDATE
export const syncUserUpdate = inngest.createFunction(
  { id: 'sync-user-update' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,
      },
    });
  }
);

// DELETE
export const syncUserDelete = inngest.createFunction(
  { id: 'sync-user-delete' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: { id: data.id },
    });
  }
);