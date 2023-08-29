import { _vec, vecAdd } from 'math2d'

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export const mapPositiveLimits = _vec(3, 4)
export const mapNegativeLimits = _vec(0, 0)
export let currentPosition = _vec(0, 0)
// export let mapPointsDescription = {}

export let mapPointsDescription = {
  '{"x":0,"y":0}': {
    description:
      'A dense forest entrance with a narrow path leading into the unknown.',
  },
  '{"x":1,"y":0}': {
    description:
      'The narrow path continues, surrounded by towering trees and the sound of rustling leaves.',
  },
  '{"x":2,"y":0}': {
    description:
      'A small clearing in the forest, sunlight filtering through the canopy above.',
  },
  '{"x":0,"y":1}': {
    description:
      'The forest thickens, the path is less clear and the sounds of wildlife are louder here.',
  },
  '{"x":1,"y":1}': {
    description:
      'A crossroads in the forest, paths leading in different directions, each shrouded in mystery.',
  },
  '{"x":2,"y":1}': {
    description:
      'A babbling brook cuts through the forest, the water clear and cold.',
  },
  '{"x":0,"y":2}': {
    description:
      'The forest becomes denser, the path is almost invisible and the air is heavy with the scent of moss and damp earth.',
  },
  '{"x":1,"y":2}': {
    description:
      'A hidden cave entrance, shrouded by overgrown foliage and shadowed by the towering trees.',
  },
  '{"x":2,"y":2}': {
    description:
      'A small waterfall cascades into a clear pool, the sound of rushing water echoing through the forest.',
  },
  '{"x":0,"y":3}': {
    description:
      'A steep hill rises before you, the path winding its way up between the trees.',
  },
  '{"x":1,"y":3}': {
    description:
      'The top of the hill, offering a breathtaking view of the endless sea of trees stretching out below.',
  },
  '{"x":2,"y":3}': {
    description:
      'The edge of a cliff, overlooking a vast valley. A hidden treasure chest lies here, the goal of your forest adventure.',
    isGoal: true,
    },
}

export function navigate(input: string): Promise<string> {
  const movementOperations = {
    [Direction.UP]: _vec(0, 1),
    [Direction.DOWN]: _vec(0, -1),
    [Direction.LEFT]: _vec(-1, 0),
    [Direction.RIGHT]: _vec(1, 0),
  }

  const destinationVector = vecAdd(movementOperations[input], currentPosition)

  const invalidPoint =
    destinationVector.x < mapNegativeLimits.x ||
    destinationVector.y < mapNegativeLimits.y ||
    destinationVector.x > mapPositiveLimits.x ||
    destinationVector.y > mapPositiveLimits.y

  if (invalidPoint) {
    console.log(
      `Direction ${
        Direction[input]
      } invalid, did not move, CurrentPosition: ${JSON.stringify(
        currentPosition,
      )}`,
    )
    drawMap()
    throw new Error(
      `Movement failed, outside map boundaries. CurrentPosition: ${JSON.stringify(
        currentPosition,
      )}`,
    )
  }
  currentPosition = destinationVector
  console.log(
    `Direction ${Direction[input]} valid, newCurrentPosition: ${JSON.stringify(
      currentPosition,
    )}`,
  )
  drawMap()
  return Promise.resolve(`${JSON.stringify(currentPosition)}`)
}

export function getPointsToDescribe(mapBoundaries) {
  const parsedMapBoundaries = JSON.parse(mapBoundaries)

  const allPoints = []

  for (let row = 0; row < parsedMapBoundaries.y; row++) {
    for (let col = 0; col < parsedMapBoundaries.x; col++) {
      const pointWithIndices = {
        x: col,
        y: row,
      }
      allPoints.push(pointWithIndices)
    }
  }

  return Promise.resolve(JSON.stringify(allPoints))
}

export function getPointDescription() {
  const currentPositionInformation =
    mapPointsDescription[JSON.stringify(currentPosition)]
  if (!currentPositionInformation.description) {
    throw new Error(
      `No description for point: ${JSON.stringify(currentPosition)}`,
    )
  }
  return Promise.resolve(currentPositionInformation.description)
}

export function describeMapPoint(input: string) {
  try {
    const parsedInput = JSON.parse(input)
    const point = _vec(parseInt(parsedInput.x), parseInt(parsedInput.y))

    mapPointsDescription[JSON.stringify(point)].description = {
      description: parsedInput.description,
      isGoal: parsedInput.isGoal,
    }

    return Promise.resolve('Successfully described point')
  } catch (error) {
    throw new Error(`Invalid input: ${input}`)
  }
}

export function drawMap() {
  const array: string[][] = []

  for (let i = 0; i < mapPositiveLimits.y; i++) {
    array[i] = []
    for (let j = 0; j < mapPositiveLimits.x + 1; j++) {
      array[i][j] = '0'
    }
  }

  array[currentPosition.y][currentPosition.x] = '1'

  for (let i = array.length - 1; i > -1; i--) {
    console.log(array[i])
  }

  return Promise.resolve('Map drawn successfully')
}
