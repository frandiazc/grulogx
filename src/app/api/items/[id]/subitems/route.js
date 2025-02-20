import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function POST(request, { params }) {
  const { id } = params
  const { name, estado, specifications } = await request.json()

  try {
    await sql`
      INSERT INTO subitems (name, item_id, estado, specifications)
      VALUES (${name}, ${id}, ${estado}, ${JSON.stringify(specifications)})
    `
    return NextResponse.json({ message: "Subitem added successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error adding subitem:", error)
    return NextResponse.json({ error: "Error adding subitem" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const { id, subitemId } = params
  const { name, estado, specifications } = await request.json()

  try {
    await sql`
      UPDATE subitems
      SET name = ${name}, estado = ${estado}, specifications = ${JSON.stringify(specifications)}
      WHERE id = ${subitemId} AND item_id = ${id}
    `
    return NextResponse.json({ message: "Subitem updated successfully" })
  } catch (error) {
    console.error("Error updating subitem:", error)
    return NextResponse.json({ error: "Error updating subitem" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id, subitemId } = params

  try {
    await sql`
      DELETE FROM subitems
      WHERE id = ${subitemId} AND item_id = ${id}
    `
    return NextResponse.json({ message: "Subitem deleted successfully" })
  } catch (error) {
    console.error("Error deleting subitem:", error)
    return NextResponse.json({ error: "Error deleting subitem" }, { status: 500 })
  }
}

