import 'dotenv/config'

import * as readline from 'readline'
import { mapDescriber, mapTraveler } from './business/ai/aiInterface.js'
import { mapPointsDescription } from './business/gameBuilder/map.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function describeMap() {
  await mapDescriber.call({
    input:
      'Describe the location of all the points of a map with the theme of forest adventure with an area of 3x4.',
  })
  console.log(JSON.stringify(mapPointsDescription))
}

function getUserInput() {
  rl.question(
    'Traverse the map using (up, down, right, left): ',
    async (input) => {
      if (input === 'exit') {
        rl.close()
        return
      }

      const response = await mapTraveler.call({ input: input })

      console.log(`AI: ${JSON.stringify(response)}`)

      getUserInput()
    },
  )
}
