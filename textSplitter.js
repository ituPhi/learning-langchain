import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import { OpenAIEmbeddings } from '@langchain/openai';
const OPENAI_KEY = process.env.OPENAI_KEY;

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

const supabaseClient = createClient(url, key);

try {
  const result = await fs.readFile('./client-e.txt', 'utf-8');
  const text = await result;

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50
  });
  const output = await splitter.createDocuments([text]);
  console.log(output);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_KEY,
    model: 'text-embedding-ada-002'
  });

  await SupabaseVectorStore.fromDocuments(output, embeddings, {
    client: supabaseClient,
    tableName: 'documents',
    queryName: 'match_documents'
  });
} catch (error) {
  console.error('Detailed error:', error);
}
