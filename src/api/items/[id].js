import { updateItem, deleteItem } from "../../lib/items"

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === "PUT") {
    const updatedItem = await updateItem(id, req.body)
    res.status(200).json(updatedItem)
  } else if (req.method === "DELETE") {
    await deleteItem(id)
    res.status(204).end()
  } else {
    res.status(405).end() // Method Not Allowed
  }
}
