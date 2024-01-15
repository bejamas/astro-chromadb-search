import type { APIRoute } from "astro";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

const client = new ChromaClient({
  path: import.meta.env.CHROMADB_PATH,
});

const COLLECTION_NAME = "posts";

const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: import.meta.env.OPENAI_API_KEY as string,
});

const collection = await client.getCollection({
  name: COLLECTION_NAME,
  embeddingFunction: embedder,
});

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("query");

  // through an error if query param is not defined
  if (!query) {
    return new Response(JSON.stringify("Please provide search query phrase"), {
      status: 403,
    });
  }

  // don'send empty reponse if query is less than 3 chars
  if (query.length < 3) {
    return new Response();
  }

  // query items in ChromaDB with give query phrase
  const results = await collection.query({
    nResults: 100,
    queryTexts: url.searchParams.get("query") as string,
  });

  return new Response(JSON.stringify(results.metadatas[0], null, 2));
};
