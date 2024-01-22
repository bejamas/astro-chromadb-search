import "dotenv/config";
import path from "path";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

async function getDocuments() {
  const pathToDocument = path.join(
    process.cwd(),
    "src/assets/docs/greek_and_roman_myths.txt"
  );
  const loader = new TextLoader(pathToDocument);
  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3000,
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);

  return splitDocs;
}

function createVectorStore() {
  const COLLECTION_NAME = "documents";
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = new Chroma(embeddings, {
    url: process.env.CHROMADB_PATH,
    collectionName: COLLECTION_NAME,
  });

  return vectorStore;
}

async function main() {
  const vectorStore = await createVectorStore();
  const docs = await getDocuments();

  // feed data into new collection
  // note that we don't pass embeddings, however they will be created behind the scenes
  await vectorStore.addDocuments(docs);
}

main();
