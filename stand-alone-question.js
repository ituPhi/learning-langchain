import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

const OPENAI_KEY = process.env.OPENAI_KEY;
const SBURL = process.env.SUPABASE_URL;
const SBKEY = process.env.SUPABASE_KEY;

const sbClient = createClient(SBURL, SBKEY);
const embeding = new OpenAIEmbeddings({ apiKey: OPENAI_KEY });
const outPutParser = new StringOutputParser();

const vectorStore = new SupabaseVectorStore(embeding, {
  client: sbClient,
  tableName: 'documents',
  queryName: 'match_documents'
});

const retreiver = vectorStore.asRetriever(2);

const model = new ChatOpenAI({
  apiKey: OPENAI_KEY
});

const standAloneString =
  'Take this questions and return a standalone question from it: {question} also return the {standAloneQuestion} you derived from it';
const standAloneTemplate = PromptTemplate.fromTemplate(standAloneString);

const helpFullAwnser =
  'Generate a helpful awnser adhere to context info,if unsure say "dont know" DO NOT HALLUCINATE , be brief and to the point: question: {question} , context: {context}, awnser';

const helpFullAwnserTemplate = PromptTemplate.fromTemplate(helpFullAwnser);

function combineDocs(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n');
}
const chain = RunnableSequence.from([
  standAloneTemplate,
  model,
  outPutParser,
  retreiver,
  combineDocs,
  helpFullAwnserTemplate
]);

const response = await chain.invoke({
  question:
    'La mente es una cosa curiosa, siempre buscando patrones, escaneando en busca de significado en las palabras frente a ella. Un lector avanza por el texto sin darse cuenta de cómo sus pensamientos están siendo guiados, sutilmente conducidos por un camino. Es fácil asumir que cada párrafo fluye lógicamente, que cada oración sigue naturalmente a la siguiente. Pero, ¿Qué cliente es el que necesita rebranding?',
  standAloneQuestion: '{standAloneQuestion: }'
});

//const testResponse = await retreiver.invoke('¿Qué cliente es el que necesita branding?');
console.log(response);

// async function progressConversation() {}
