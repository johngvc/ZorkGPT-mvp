import { LLMChain } from 'langchain'
import { ChatOpenAI } from 'langchain/chat_models'
import {
  ChatPromptTemplate,
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
      You are an agent that is responsible for filtering the player initial input on a zork like text game. You don't know anything about the game world. Assume the game has a map that the player can move, it has locations in which the player can perform actions. Be concise on your responses.
      Your Goal is to categorize the input received by the player rephrasing the relevant parts of the player query into the following categories: movement, action, generalQuery. Answer in JSON format with the keys movement, action and generalQuery. The description for each of these categories is defined below:

      movement: Must always be of one of the values ["UP", "DOWN", "LEFT", "RIGHT"]. All inquiries that involves movement of the player around the map. Don't try to assume what movement the player want to do if it is not obvious. If the inquiry asks for diagonal movement, rephrase it to be of one direction only, only move once at a time. If no movement is found on the original query use an empty string.
      action: All inquiries that involves the player performing an action. If no action is found on the query use an empty string.
      generalQuery: All other inquiries. If no general queries are found on the original query use an empty string.

      Player input: {text}

      Json Object:
      `,
  ),
])

export const questionOrganizer = new LLMChain({
  prompt: chat,
  llm: llm,
})

