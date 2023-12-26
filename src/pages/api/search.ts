import type { APIRoute } from "astro";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

import { loadEnv } from "vite";

const { OPENAI_API_KEY } = loadEnv(
  process.env.NODE_ENV as string,
  process.cwd(),
  ""
);

const client = new ChromaClient();
const COLLECTION_NAME = "posts";

const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: OPENAI_API_KEY as string,
});

const collection = await client.getCollection({
  name: COLLECTION_NAME,
  embeddingFunction: embedder,
});

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify("Please provide search query phrase"), {
      status: 403,
    });
  }

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
