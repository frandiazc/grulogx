import clientPromise from './src/lib/mongodb'

async function testConnection() {
  try {
    const client = await clientPromise
    const db = client.db()
    const collection = db.collection('items')
    const result = await collection.findOne({})
    console.log('Conexión exitosa. Primer documento:', result)
  } catch (error) {
    console.error('Error de conexión:', error)
  }
}

testConnection()