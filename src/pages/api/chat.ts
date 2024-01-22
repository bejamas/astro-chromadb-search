import type { APIRoute } from "astro";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { question, history = [] } = body;

  // through an error if query param is not defined
  if (!question) {
    return new Response(JSON.stringify("Please provide query phrase"), {
      status: 403,
    });
  }

  const chain = await getRunnableSequence();
  const result = await chain.invoke({ question, history });

  return new Response(JSON.stringify({ result }, null, 2));
};

async function getRunnableSequence() {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-1106",
    openAIApiKey: import.meta.env.OPENAI_API_KEY,
    verbose: true,
  });

  const condenseQuestionTemplate = `
    If user asks about mythology user conversational history 
    Given the following conversation and a follow up question, 
    rephrase the follow up question to be a standalone question.

    Chat History:
    {chat_history}
    Follow Up Input: {question}
    Standalone question:
  `;

  const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
    condenseQuestionTemplate
  );

  const answerTemplate = `
    Answer the question based only on the given context

    Step 1. Find the relevant answer baed on the DOCUMENT

    Step 2. Format in a readable, user friendly markdown format.

    DOCUMENT:
    --------
    {context}

    Question: 
    ---------
    {question}
  `;

  const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);

  const vectorStore = await Chroma.fromExistingCollection(
    new OpenAIEmbeddings({ openAIApiKey: import.meta.env.OPENAI_API_KEY }),
    {
      collectionName: "documents",
      url: import.meta.env.CHROMADB_PATH,
    }
  );

  const retriever = vectorStore.asRetriever(20);

  const standaloneQuestionChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      chat_history: (input) => formatChatHistory(input.history),
    },
    CONDENSE_QUESTION_PROMPT,
    model,
    new StringOutputParser(),
  ]);

  const answerChain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    ANSWER_PROMPT,
    model,
    new StringOutputParser(),
  ]);

  const chain = standaloneQuestionChain.pipe(answerChain);

  return chain;
}

function formatChatHistory(chatHistory: ChatMessage[]) {
  const formattedDialogueTurns = chatHistory.map((message) => {
    return `${message.type}: ${message.content}`;
  });

  return formattedDialogueTurns.join("\n");
}
