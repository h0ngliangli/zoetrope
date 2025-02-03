import create_logger from "./logger.js"
import env from "./env.js"
import { MongoClient, ServerApiVersion } from "mongodb"

const logger = create_logger("db_mongodb", "yellow")
const mongoClient = new MongoClient(
  env.mongodb.url,
  {
    tlsCertificateKeyFile: env.mongodb.key_file,
    serverApi: ServerApiVersion.v1,
  }
)

await mongoClient.connect()
await mongoClient.db("admin").command({ ping: 1 })
logger.info("mongodb is connected")

const database = mongoClient.db(env.mongodb.db)
const flashcardsCol = database.collection("flashcard")

// insert a new document and return the inserted id
async function db_insert_doc(col_name, doc) {
  logger.info("db_insert_doc(%s, %o)", col_name, doc)
  const result = await database.collection(col_name).insertOne(doc)
  logger.debug("db_insert_doc => %o", result)
  return result.insertedId
}

export async function db_insert_flashcard(flashcard) {
  return await db_insert_doc("flashcard", flashcard)
}

export default {
  db_insert_flashcard,
  // getFlashcardById,
  // searchFlashcards,
  // createFlashcard,
}
