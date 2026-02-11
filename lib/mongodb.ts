import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'openclaw'

export async function connectToDatabase(): Promise<Db> {
  if (!uri) {
    throw new Error('MONGODB_URI environment variable not set')
  }
  const client = new MongoClient(uri)
  await client.connect()
  return client.db(dbName)
}
