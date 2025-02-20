import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function PUT(request, { params }) {
  const { id } = params
  try {
    const { name, category, image, subitems } = await request.json()

    // Actualizar o crear la categoría
    const categoryResult = await sql`
      INSERT INTO categories (name, icon)
      VALUES (${category}, 'default-icon')
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `
    const categoryId = categoryResult.rows[0].id

    // Actualizar el item
    await sql`
      UPDATE items 
      SET name = ${name}, category_id = ${categoryId}, image = ${image}
      WHERE id = ${id}
    `

    // Eliminar subitems existentes
    await sql`DELETE FROM subitems WHERE item_id = ${id}`

    // Insertar nuevos subitems
    for (const subitem of subitems) {
      await sql`
        INSERT INTO subitems (name, item_id, estado, specifications)
        VALUES (${subitem.name}, ${id}, ${subitem.estado}, ${JSON.stringify(subitem.specifications)})
      `
    }

    return NextResponse.json({ message: "Item updated successfully" })
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json({ error: "Error updating item" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = params
  try {
    // Los subitems se eliminarán automáticamente debido a la restricción ON DELETE CASCADE
    await sql`DELETE FROM items WHERE id = ${id}`
    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 })
  }
}

