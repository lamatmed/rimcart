import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust import path according to your setup

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();
    const { name, description, username, address, image, email, contact } = body;

    // Validation des champs obligatoires
    if (!name || !username || !address || !email || !contact) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Vérifier si l'utilisateur a déjà un store
    const existingStore = await prisma.store.findUnique({
      where: {
        userId: userId,
      },
    });

    if (existingStore) {
      return new NextResponse("User already has a store", { status: 400 });
    }

    // Vérifier si le username est déjà pris
    const existingUsername = await prisma.store.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUsername) {
      return new NextResponse("Username already taken", { status: 400 });
    }

    // Création du store
    const store = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username,
        address,
        logo,
        email,
        contact,
        // status et isActive utilisent les valeurs par défaut du modèle
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}