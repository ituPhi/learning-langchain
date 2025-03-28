import readline from 'node:readline/promises';
import { ChatOpenAI } from '@langchain/openai';

const OPENAI_KEY = process.env.OPENAI_KEY;
const model = new ChatOpenAI({
  model: 'gpt-4',
  openAIApiKey: OPENAI_KEY
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat() {
  console.log('Chat Started. Type "exit" to quit.\n');
  const messages = [
    {
      role: 'system',
      content:
        "You are a helpful assistant. Respond to the user's messages, you keep track of user's clients and their info, you know everything about the ${clients}."
    }
  ];
  while (true) {
    const userInput = await rl.question('You: ');

    if (userInput.toLowerCase() === 'exit') {
      break;
    }

    messages.push({
      role: 'user',
      content: userInput
    });

    try {
      const aiMsg = await model.invoke(messages);
      console.log(`Bot: ${aiMsg.content}\n`);

      // Add assistant's response to conversation history
      messages.push({
        role: 'assistant',
        content: aiMsg.content
      });
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  rl.close();
  console.log('Chat session ended.');
}
chat();
