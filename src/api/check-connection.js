import { verifyConnection } from "../lib/mongodb"

export default async function handler(req, res) {
  if (req.method === "GET") {
    const connected = await verifyConnection()
    res.status(200).json({ connected })
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

