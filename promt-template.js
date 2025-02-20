import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';

const OPENAI_KEY = process.env.OPENAI_KEY;

const model = new ChatOpenAI({
  // this loads the model
  openAIApiKey: OPENAI_KEY
});

const initString = 'Genera un tweet promocional para mi servicio web : {servicio}'; // creates a string with a placeholder
const promptTemplate = PromptTemplate.fromTemplate(initString); // create a template from the string which adds meta data
const promptChain = promptTemplate.pipe(model); // chains the prompt to the model
console.log(promptChain);

async function getServiceTweet(service) {
  const run = await promptChain.invoke({ servicio: service });
  // calls the llm model with the prompt template return content
  return run.content;
}

const a = await getServiceTweet('Web Design');
console.log(a);
