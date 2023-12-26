import "dotenv/config";
import path from "path";
import { glob } from "glob";
import { promises as fs } from "fs";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import matter from "gray-matter";

async function getPosts() {
  const pathToContent = path.join(process.cwd(), "src/content/**/*.mdx");
  const files = await glob(pathToContent);
  const posts = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, "utf8");
      return matter(content);
    })
  );

  return posts;
}

async function main() {
  const posts = await getPosts();
  const client = new ChromaClient();

  // special class which will be passed to client and automatically create embeddings
  const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: process.env.OPENAI_API_KEY,
  });

  const COLLECTION_NAME = "posts";

  // delete collections to remove stale records and rebuild with up to date data.
  await client.deleteCollection({ name: COLLECTION_NAME });

  // create a collection
  // note that we pass embedder that will automtically create embeddings
  // with OpenAI Embeddings API
  const collection = await client.createCollection({
    name: COLLECTION_NAME,
    embeddingFunction: embedder,
  });

  // feed data into new collection
  // note that we don't pass embeddings, however they will be created behind the scenes
  await collection.add({
    ids: posts.map((i) => i.data.slug),
    metadatas: posts.map((i) => i.data),
    documents: posts.map((i) => i.content),
  });
}

main();
