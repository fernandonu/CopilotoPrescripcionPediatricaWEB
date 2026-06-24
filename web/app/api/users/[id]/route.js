import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// DELETE a user
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    // Prevent deleting the main admin
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    
    if (!userToDelete) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (userToDelete.username === "admin") {
      return NextResponse.json({ error: "No se puede eliminar al administrador principal" }, { status: 400 });
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
