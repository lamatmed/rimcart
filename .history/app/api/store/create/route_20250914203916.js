import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/config/imageKit";

// GET - Récupérer le store de l'utilisateur
export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Récupérer le store de l'utilisateur
    const store = await prisma.store.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    return NextResponse.json({ status: store.status });
  } catch (error) {
    console.error("[STORE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST - Créer un nouveau store
export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const formData = await req.formData();
    
    // Extraction des champs du formulaire
    const name = formData.get("name");
    const description = formData.get("description");
    const username = formData.get("username");
    const address = formData.get("address");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const imageFile = formData.get("image");

    // Validation des champs obligatoires
    if (!name || !username || !address || !email || !contact || !imageFile || !description) {
      return NextResponse.json(
        { message: "Missing required fields" }, 
        { status: 400 }
      );
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
      return NextResponse.json(
        { message: "Username already taken" }, 
        { status: 400 }
      );
    }

    // Upload l'image vers ImageKit avec optimisation
    const buffer = Buffer.from(await image.arrayBuffer())

    const response = await imagekit.upload({
      file:b
    })
    const imageUrl = uploadResponse.url;

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

    // Mettre à jour l'utilisateur avec la référence du store
    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: store.id } } }
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORES_POST]", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}


// PUT - Mettre à jour le store
export async function PUT(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const formData = await req.formData();
    
    // Extraction des champs du formulaire
    const name = formData.get("name");
    const description = formData.get("description");
    const username = formData.get("username");
    const address = formData.get("address");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const imageFile = formData.get("image");
    const storeId = formData.get("storeId");

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Vérifier que l'utilisateur possède ce store
    const userStore = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId: userId,
      },
    });

    if (!userStore) {
      return new NextResponse("Store not found or unauthorized", { status: 404 });
    }

    // Vérifier si le nouveau username est déjà pris par un autre store
    if (username && username !== userStore.username) {
      const existingUsername = await prisma.store.findFirst({
        where: {
          username: username.toLowerCase(),
          NOT: {
            id: storeId
          }
        },
      });

      if (existingUsername) {
        return NextResponse.json("Username already taken", { status: 400 });
      }
    }

    // Préparer les données de mise à jour
    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(username && { username: username.toLowerCase() }),
      ...(address && { address }),
      ...(email && { email }),
      ...(contact && { contact }),
    };

    // Traitement de la nouvelle image si fournie
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);

      const timestamp = Date.now();
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `store_${username || userStore.username}_${timestamp}.${fileExtension}`;

      const uploadResponse = await imagekit.upload({
        file: uint8Array,
        fileName: fileName,
        folder: "/stores",
        transformation: [
          {
            format: 'webp',
            quality: '80',
            width: '512',
            height: '512',
            crop: 'limit'
          }
        ]
      });

      const imageUrl = imagekit.url({
        path: uploadResponse.filePath,
        transformation: [{
          format: 'webp',
          quality: '80',
          width: '512',
          height: '512',
          crop: 'limit'
        }]
      });

      updateData.logo = imageUrl;
    }

    // Mettre à jour le store
    const updatedStore = await prisma.store.update({
      where: {
        id: storeId,
      },
      data: updateData,
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error("[STORE_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE - Supprimer le store
export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Vérifier que l'utilisateur possède ce store
    const userStore = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId: userId,
      },
    });

    if (!userStore) {
      return new NextResponse("Store not found or unauthorized", { status: 404 });
    }

    // Supprimer le store (les relations seront gérées par Prisma selon le schema)
    await prisma.store.delete({
      where: {
        id: storeId,
      },
    });

    return new NextResponse("Store deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}