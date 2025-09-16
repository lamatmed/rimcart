import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {
  if (!userId) return false;

  try {
    // Récupérer l’utilisateur depuis Clerk
    const user = await clerkClient.users.getUser(userId);

    // Trouver l’email principal
    const primaryEmail =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses[0]?.emailAddress;

    // Vérifier si l’email est dans la liste des admins
    const adminEmails = (process.env.ADMIN_EMAIL || "")
      .split(",")
      .map((email) => email.trim().toLowerCase());

    return adminEmails.includes(primaryEmail?.toLowerCase());
  } catch (error) {
    console.error("[AUTH_ADMIN_ERROR]", error);
    return false;
  }
};

export default authAdmin;
