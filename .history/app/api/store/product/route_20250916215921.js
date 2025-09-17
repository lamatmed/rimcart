import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/config/imageKit";
import { authSeller } from "@/middlewares/authSeller";

// GET - Récupérer tous les produits du store de l'utilisateur
export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Utiliser authSeller pour vérifier l'autorisation
    const store = await authSeller(userId);
    
    if (!store) {
      return new NextResponse("Store not found or not approved", { status: 404 });
    }

    // Récupérer les paramètres de query pour la pagination et le filtrage
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const inStock = searchParams.get("inStock");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Construire les conditions de filtrage
    const whereClause = {
      storeId: store.id,
      ...(category && { category }),
      ...(inStock !== null && { inStock: inStock === "true" }),
    };

    // Récupérer les produits avec pagination
    const products = await prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Compter le nombre total de produits pour la pagination
    const totalCount = await prisma.product.count({
      where: whereClause,
    });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST - Créer un nouveau produit
export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Utiliser authSeller pour vérifier l'autorisation
    const store = await authSeller(userId);
    
    if (!store) {
      return new NextResponse("Store not found or not approved", { status: 404 });
    }

    const formData = await req.formData();

    // Extraction des champs du formulaire
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = parseFloat(formData.get("mrp"));
    const price = parseFloat(formData.get("price"));
    const category = formData.get("category");
    const inStock = formData.get("inStock") === "true";
    const imageFiles = formData.getAll("images"); // Récupérer toutes les images

    // Validation des champs obligatoires
    if (!name || !description || !mrp || !price || !category || !imageFiles || imageFiles.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Upload des images vers ImageKit
    const uploadedImages = [];

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.name !== "undefined") {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `product_${store.username}_${timestamp}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const uploadResponse = await imagekit.upload({
          file: buffer,
          fileName: fileName,
          folder: "products" // Utilisation du dossier "products"
        });

        const imageUrl = imagekit.url({
          path: uploadResponse.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "800" },
           
          ],
        });

        uploadedImages.push(imageUrl);
      }
    }

    // Création du produit
    const product = await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        price,
        category,
        inStock,
        images: uploadedImages,
        storeId: store.id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
// PUT - Mettre à jour un produit
export async function PUT(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Utiliser authSeller pour vérifier l'autorisation
    const store = await authSeller(userId);
    
    if (!store) {
      return new NextResponse("Store not found or not approved", { status: 404 });
    }

    const formData = await req.formData();

    // Extraction des champs du formulaire
    const productId = formData.get("id");
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = parseFloat(formData.get("mrp"));
    const price = parseFloat(formData.get("price"));
    const category = formData.get("category");
    const inStock = formData.get("inStock") === "true";
    const imageFiles = formData.getAll("images");
    const existingImages = formData.get("existingImages") ? JSON.parse(formData.get("existingImages")) : [];

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Vérifier que le produit appartient au store de l'utilisateur
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    });

    if (!existingProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Upload des nouvelles images vers ImageKit
    const newUploadedImages = [];

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.name !== "undefined") {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `product_${store.username}_${timestamp}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const uploadResponse = await imagekit.upload({
          file: buffer,
          fileName: fileName,
          folder: "products" // Utilisation du dossier "products"
        });

        const imageUrl = imagekit.url({
          path: uploadResponse.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "800" },
            { height: "800" },
            { crop: "limit" }
          ],
        });

        newUploadedImages.push(imageUrl);
      }
    }

    // Combiner les images existantes et les nouvelles
    const allImages = [...existingImages, ...newUploadedImages];

    // Mise à jour du produit
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        mrp: mrp || existingProduct.mrp,
        price: price || existingProduct.price,
        category: category || existingProduct.category,
        inStock: inStock !== undefined ? inStock : existingProduct.inStock,
        images: allImages.length > 0 ? allImages : existingProduct.images,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("[PRODUCTS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE - Supprimer un produit
export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Utiliser authSeller pour vérifier l'autorisation
    const store = await authSeller(userId);
    
    if (!store) {
      return new NextResponse("Store not found or not approved", { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Vérifier que le produit appartient au store de l'utilisateur
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Supprimer le produit
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return new NextResponse("Product deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[PRODUCTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}