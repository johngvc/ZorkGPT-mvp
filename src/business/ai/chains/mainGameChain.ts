import { mapTraveler } from '../agents/mapTraveler.js'
import { questionOrganizer } from '../modules/questionOrganizer.js'

import { LLMChain } from 'langchain'
import { ChatOpenAI } from 'langchain/chat_models'
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'
import { currentPosition, mapPointsDescription } from '../../gameBuilder/map.js'

type OrganizedQuestion = {
  movement?: string
  action?: string
  locationQuery?: string
  generalQuery?: string
}

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  modelName: 'gpt-3.5-turbo',
})

export async function mainGameChain(input: string) {
  const parsedOrganizedQuestion: OrganizedQuestion = JSON.parse(
    await questionOrganizer.run(input),
  )

  console.log(
    `parsedOrganizedQuestion: ${JSON.stringify(parsedOrganizedQuestion)}`,
  )
  // parsedOrganizedQuestion.action Processed by action agent
  // if (parsedOrganizedQuestion.action) {
  //     const actionResponse = await actionAgent.run(parsedOrganizedQuestion.action)
  // }

  if (parsedOrganizedQuestion.movement) {
    await mapTraveler.run(parsedOrganizedQuestion.movement)
  }

  const mapPointInformation =
    mapPointsDescription[JSON.stringify(currentPosition)]

  const processedInfo = `[
      playerWon: ${mapPointInformation.isGoal ?? false},
      currentPlayerLocation: ${JSON.stringify(currentPosition)},
      playerLocationDescription: ${mapPointInformation.description},
      userQuery: ${parsedOrganizedQuestion.generalQuery}
  ]`

  console.log(processedInfo)

  const chat = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `
            You are a Dungeon Master and is accompaning an adventurer on their quest. Be concise on your responses. Answer the player in the style of the game Zork.
            Your Goal is to state the current information about the player in the game world and inform the user as best you can using the information provided in square brackets. You don't know anything about the game world, the only information you know is the information provided. Don't give advice to the player. If present, a user query will be present on the information provided defined as userQuery. Always use the information provided. The description for each of these categories is defined below:

            playerWon: A boolean value that states if the player won or not.
            currentPlayerLocation: The current location of the player in the game world, represented as JSON with the keys x and y.
            playerLocationDescription: The description of the current location of the player in the game world.
            userQuery: The query the user made, if any.

            ${processedInfo}

            Answer to the player:
            `,
    ),
  ])

  const gameInterfaceChain = new LLMChain({
    prompt: chat,
    llm: llm,
    verbose: false,
  })

  const gameInterfaceChainResponse = await gameInterfaceChain.run('')

  return gameInterfaceChainResponse
}
