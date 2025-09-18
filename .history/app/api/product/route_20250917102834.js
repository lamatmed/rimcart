import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/config/imageKit";

// GET - Récupérer le store de l'utilisateur
export async function GET(req) {
  try {
   

    let products = await prisma.product.findMany({ where: { inStock:true },
    include:{
        rating:{
            select:{
                crea
            }
        }
    } });
    if (!store) return NextResponse.json({ message: "Store not found" }, { status: 404 });

    return NextResponse.json({  });
  } catch (error) {
    
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

// POST - Créer un nouveau store
export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    // Vérifier que l'utilisateur existe
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const username = formData.get("username")?.toLowerCase();
    const address = formData.get("address");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const imageFile = formData.get("image");

    if (!name || !username || !address || !email || !contact || !imageFile || !description)
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });

    const existingStore = await prisma.store.findUnique({ where: { userId } });
    if (existingStore) return NextResponse.json({ status: existingStore.status });

    const existingUsername = await prisma.store.findUnique({ where: { username } });
    if (existingUsername) return NextResponse.json({ message: "Username already taken" }, { status: 400 });

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResponse = await imagekit.upload({ file: buffer, fileName: imageFile.name, folder: "logos" });

    const imageUrl = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [{ quality: "auto" }, { format: "webp" }, { width: "512" }],
    });

    const store = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username,
        address,
        email,
        contact,
        logo: imageUrl,
        status: "pending", // pour test /is-seller
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORE_POST]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT - Mettre à jour le store
export async function PUT(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const formData = await req.formData();
    const storeId = formData.get("storeId");
    if (!storeId) return NextResponse.json({ message: "Store ID is required" }, { status: 400 });

    const userStore = await prisma.store.findUnique({ where: { id: storeId } });
    if (!userStore || userStore.userId !== userId)
      return NextResponse.json({ message: "Store not found or unauthorized" }, { status: 404 });

    const updateData = {};
    ["name", "description", "username", "address", "email", "contact"].forEach((field) => {
      const value = formData.get(field);
      if (value) updateData[field] = field === "username" ? value.toLowerCase() : value;
    });

    const imageFile = formData.get("image");
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResponse = await imagekit.upload({ file: buffer, fileName: imageFile.name, folder: "logos" });
      updateData.logo = imagekit.url({
        path: uploadResponse.filePath,
        transformation: [{ quality: "auto" }, { format: "webp" }, { width: "512" }],
      });
    }

    const updatedStore = await prisma.store.update({ where: { id: storeId }, data: updateData });
    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error("[STORE_PUT]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

// DELETE - Supprimer le store
export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    if (!storeId) return NextResponse.json({ message: "Store ID is required" }, { status: 400 });

    const userStore = await prisma.store.findUnique({ where: { id: storeId } });
    if (!userStore || userStore.userId !== userId)
      return NextResponse.json({ message: "Store not found or unauthorized" }, { status: 404 });

    await prisma.store.delete({ where: { id: storeId } });
    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("[STORE_DELETE]", error);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
