import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

export async function getItems() {
  const client = await clientPromise
  const db = client.db()
  return db.collection("items").find({}).toArray()
}

export async function addItem(item) {
  const client = await clientPromise
  const db = client.db()
  return db.collection("items").insertOne(item)
}

export async function updateItem(id, item) {
  const client = await clientPromise
  const db = client.db()
  return db.collection("items").updateOne({ _id: ObjectId(id) }, { $set: item })
}

export async function deleteItem(id) {
  const client = await clientPromise
  const db = client.db()
  return db.collection("items").deleteOne({ _id: ObjectId(id) })
}