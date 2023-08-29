import { ChatOpenAI } from 'langchain/chat_models'
import { navigate } from '../../gameBuilder/map.js'
import { DynamicTool } from 'langchain/tools'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  modelName: 'gpt-3.5-turbo',
})

const navigationTool = new DynamicTool({
  name: 'navigateOnTheMap',
  description:
    'Call this to move the character on the game map the response will be the current position the player occupies. input should be one of [UP, DOWN, LEFT, RIGHT] as a string.',
  func: navigate,
})

const mapTravelerTools = [navigationTool]
const prefix = `
You are an agent that is responsible for player movement on a text game. Your goal is to move the player using the appropriate function based on the input provided. Don't move more than once. Do not call the same function twice.
`

export const mapTraveler = await initializeAgentExecutorWithOptions(
  mapTravelerTools,
  llm,
  {
    agentType: 'zero-shot-react-description',
    verbose: false,
    maxIterations: 3,
    agentArgs: {
      prefix,
    },
  },
)
