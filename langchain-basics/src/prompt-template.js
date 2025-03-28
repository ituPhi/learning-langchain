import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts"; // used to format a single string

//this single PromptTemplate is a stand alone string template that the llm can consume
const initPrompt = PromptTemplate.fromTemplate("Hey there chatty i am {user}");
const ms = await initPrompt.invoke({ user: "Juan" });
console.log(ms);

// now lets set up a chat messages template which holds a list of messages
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "YOU must respond in Spanish"],
  ["user", "i need help with setting up a reservation in {location}"],
]);

const cr = await chatPrompt.invoke({ location: "New York" });
console.log(cr);
