import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
const OPENAI_KEY = process.env.OPENAI_KEY;

const model = new ChatOpenAI({
  openAIApiKey: OPENAI_KEY
});

const initString =
  "Genera un tweet promocional para mi servicio web : {servicio}";
const promptTemplate = PromptTemplate.fromTemplate(initString);
const promptChain = promptTemplate.pipe(model);
console.log(promptChain);

async function getServiceTweet(service) {
  const run = await promptChain.invoke({ servicio: service });
  return run.content;
}

const a = await getServiceTweet("Web Design");
console.log(a);
