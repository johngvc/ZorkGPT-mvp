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
You are a Dungeon Master and is accompaning a player on their quest across a map. Be concise on your responses.
Your Goal is to provide the description of where he is and use the appropriate functions to traverse and interact with the game mechanics until they reach the end. Use the description of each point to describe to the player where he is. At each step describe the current location of the player. Do not traverse the map without the player asking to.
`

export const mapTraveler = await initializeAgentExecutorWithOptions(
  mapTravelerTools,
  llm,
  {
    agentType: 'zero-shot-react-description',
    verbose: true,
    maxIterations: 5,
    agentArgs: {
      prefix,
    },
  },
)
