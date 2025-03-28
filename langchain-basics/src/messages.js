import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

const OPENAI_KEY = process.env.OPENAI_KEY;
console.log(OPENAI_KEY);

const model = new ChatOpenAI({
  apiKey: OPENAI_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

const systemM = new SystemMessage("You must allways respond in spanish");

const promptTemplate = ChatPromptTemplate.fromMessages([
  systemM,
  HumanMessagePromptTemplate.fromTemplate("{text} {day}"),
]);
const chain = await promptTemplate.pipe(model).invoke({
  text: "what day is today? reply with the day provided by the user",
  day: new Date().toLocaleDateString("es-ES", { weekday: "long" }),
});
console.log(chain);
