import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/lib/imagekit"; // Import your ImageKit configuration

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // We expect FormData now, not JSON
    const formData = await req.formData();

    // Extract fields
    const name = formData.get("name");
    const description = formData.get("description");
    const username = formData.get("username");
    const address = formData.get("address");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const imageFile = formData.get("image"); // This is a File object

    // Validation des champs obligatoires
    if (!name || !username || !address || !email || !contact || !imageFile || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Vérifier si l'utilisateur a déjà un store
    const existingStore = await prisma.store.findFirst({
      where: {
        userId: userId,
      },
    });

    if (existingStore) {
      return NextResponse.json({ status: existingStore.status });
    }

    // Vérifier si le username est déjà pris
    const existingUsername = await prisma.store.findFirst({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (existingUsername) {
      return NextResponse.json("Username already taken", { status: 400 });
    }

    // Upload the image to ImageKit
    const buffer = await imageFile.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    const uploadResponse = await imagekit.upload({
      file: uint8Array,
      fileName: imageFile.name,
      folder: "logos",
    });

    const imageUrl = uploadResponse.url({
        path: response.filePath,
        transformation: [
          {
            format: 'webp'}, 
            {quality: 'auto'},  
            {width: '512'}
         ],
    });

    // Création du store
    const store = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        address,
        logo: imageUrl,
        email,
        contact,
      },
    });
 await prisma.user.update({
    where:{id:userId},
    data:{store: connect:{id:newStr}}
 })
    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}