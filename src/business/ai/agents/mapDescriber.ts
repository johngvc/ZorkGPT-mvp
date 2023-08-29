import { DynamicTool } from 'langchain/tools'
import { describeMapPoint, getPointsToDescribe } from '../../gameBuilder/map.js'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models'

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  modelName: 'gpt-4',
})

const describeMapPointTool = new DynamicTool({
  name: 'describeMapPoint',
  description:
    'Call this to register the context of a given point on the map the character will play on. input should be a strigified json with the keys: x, y, description, isGoal.',
  func: describeMapPoint,
})

const getAllMapPoints = new DynamicTool({
  name: 'getAllMapPoints',
  description:
    'Call this to get an array with all the points needed to be described on the map. Input should be the map size as a stringified json with the keys: x, y.',
  func: getPointsToDescribe,
})

const mapDescriberTools = [describeMapPointTool, getAllMapPoints]
const mapDescriberInstructionsPrefix = `
You are a Dungeon Master and is generating a game world in the style of the game zork to be played by an user.
Your Goal is to generate a description of all the points in a map defined by the input with the theme defined by the input. Don't do anything besides describing the points, be creative and concise on the description of the points. The description should be just about the location, for example """Open Road with a strong gust of wind blowing""". Don't forget to describe all the points. The map points should connect with each other making a coherent map. The player will start at the point x:0 y:0. Choose randomly one of the points to be the Goal of the user, away at least 2 points from the starting point. Descrbe the map with the goal in mind.
`

export const mapDescriber = await initializeAgentExecutorWithOptions(
  mapDescriberTools,
  llm,
  {
    agentType: 'zero-shot-react-description',
    verbose: true,
    maxIterations: 20,
    agentArgs: {
      prefix: mapDescriberInstructionsPrefix,
    },
  },
)
