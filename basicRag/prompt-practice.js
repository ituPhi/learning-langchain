import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough
} from "@langchain/core/runnables";

const OPENAI_KEY = process.env.OPENAI_KEY;

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  openAIApiKey: OPENAI_KEY
});

// create string
const initMsg = "Please be nice, say something about this {servicio}";
//create templete from string
const cpt = ChatPromptTemplate.fromMessages([
  ["system", initMsg],
  ["user", "{servicio}"]
]);

const translate = PromptTemplate.fromTemplate(
  "Translate this {text} to {language}"
);
const parser = new StringOutputParser();
//const promptFromString = PromptTemplate.fromTemplate(initMsg);

// const chainForm = cpt.pipe(model).pipe(parser)

const initMessageSequence = cpt.pipe(model).pipe(parser);

const translateMessageSequence = RunnableSequence.from([
  translate,
  model,
  parser
]);
const chain = RunnableSequence.from([
  {
    text: initMessageSequence,
    language: () => new RunnablePassthrough()
  },
  translateMessageSequence
]);
// create chain template.model

/* const stream = await chain.stream({ servicio: "Web Design" });
const chunks = [];
for await (const chunk of stream) {
  chunks.push(chunk);
  console.log(chunk);
} */

const reply = await chain.invoke({
  servicio: "web design",
  language: "German"
});
console.log(reply);

// run chain with new input and return content
