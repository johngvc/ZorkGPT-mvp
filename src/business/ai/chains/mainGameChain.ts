import { LLMChain } from 'langchain'
import { ChatOpenAI } from 'langchain/chat_models'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  modelName: 'gpt-3.5-turbo',
})

const chat = ChatPromptTemplate.fromPromptMessages([
  SystemMessagePromptTemplate.fromTemplate(
    `
      You are a Dungeon Master and is accompaning an adventurer on their quest. Be concise on your responses.
      Your Goal is to provide the context of where he is and use the appropriate functions to traverse and interact with the game mechanics until they reach the end.
      `,
  ),
  HumanMessagePromptTemplate.fromTemplate('{text}'),
])

export const aiInterfaceChain = new LLMChain({
  prompt: chat,
  llm: llm,
})

