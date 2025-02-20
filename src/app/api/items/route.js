import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        i.id,
        i.name,
        i.image,
        c.name as category_name,
        c.icon as category_icon,
        COALESCE(
          json_agg(
            CASE WHEN s.id IS NOT NULL THEN
              json_build_object(
                'id', s.id,
                'name', s.name,
                'estado', s.estado,
                'specifications', COALESCE(s.specifications, '{}')
              )
            END
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as subitems
      FROM items i
      JOIN categories c ON i.category_id = c.id
      LEFT JOIN subitems s ON s.item_id = i.id
      GROUP BY i.id, i.name, i.image, c.name, c.icon
      ORDER BY i.id;
    `

    // Asegurarse de que los subitems sean un array válido y las especificaciones sean un objeto
    const formattedRows = result.rows.map((row) => ({
      ...row,
      subitems: Array.isArray(row.subitems) ? row.subitems : [],
      specifications: row.specifications || {},
    }))

    return NextResponse.json(formattedRows)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Error fetching items" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, category, image, subitems } = await request.json()

    // Primero, obtener o crear la categoría
    const categoryResult = await sql`
      INSERT INTO categories (name, icon)
      VALUES (${category}, 'default-icon')
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `
    const categoryId = categoryResult.rows[0].id

    // Luego, insertar el item
    const itemResult = await sql`
      INSERT INTO items (name, category_id, image)
      VALUES (${name}, ${categoryId}, ${image})
      RETURNING id
    `
    const itemId = itemResult.rows[0].id

    // Finalmente, insertar los subitems
    for (const subitem of subitems) {
      await sql`
        INSERT INTO subitems (name, item_id, estado, specifications)
        VALUES (${subitem.name}, ${itemId}, ${subitem.estado}, ${JSON.stringify(subitem.specifications)})
      `
    }

    return NextResponse.json({ message: "Item added successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error adding item:", error)
    return NextResponse.json({ error: "Error adding item" }, { status: 500 })
  }
}

