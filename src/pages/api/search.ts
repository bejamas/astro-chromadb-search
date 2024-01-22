import type { APIRoute } from "astro";
import { getSimilarPosts } from "../../base/chroma";

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
  const results = await getSimilarPosts(query);

  return new Response(JSON.stringify(results.metadatas[0], null, 2));
};
