import 'dotenv/config'

import * as readline from 'readline'
import { mainGameChain } from './business/ai/chains/mainGameChain.js'
import { mapPointsDescription } from './business/gameBuilder/map.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function describeMap() {
  // await mapDescriber.call({
  //   input:
  //     'Describe the location of all the points of a map with the theme of forest adventure with an area of 3x4.',
  // })
  console.log(JSON.stringify(mapPointsDescription, null, 2))
}

function getInput() {
  rl.question('Enter input: ', async (input) => {
    if (input === 'exit') {
      rl.close()
    } else {
      const response = await mainGameChain(input)

      console.log(`AI: ${JSON.stringify(response)}`)
      getInput()
    }
  })
}

function startUserConversation() {
  rl.question(
    "Press enter to describe the map, or type 'exit' to quit: ",
    async (answer) => {
      if (answer === '') {
        await describeMap()
        getInput()
      } else {
        rl.close()
      }
    },
  )
}

startUserConversation()
