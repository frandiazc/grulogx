import { getItems, addItem } from "../../../lib/items"

export default async function handler(req, res) {
  if (req.method === "GET") {
    const items = await getItems()
    res.status(200).json(items)
  } else if (req.method === "POST") {
    const newItem = await addItem(req.body)
    res.status(201).json(newItem)
  } else {
    res.status(405).end() // Method Not Allowed
  }
}

