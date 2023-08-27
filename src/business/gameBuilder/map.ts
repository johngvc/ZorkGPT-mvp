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
export let mapPointsDescription = {}

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
  if (!mapPointsDescription[JSON.stringify(currentPosition)]) {
    throw new Error(`No description for point: ${JSON.stringify(currentPosition)}`)
  }
  return Promise.resolve(mapPointsDescription[JSON.stringify(currentPosition)])
}

export function describeMapPoint(input: string) {
  try {
    const parsedInput = JSON.parse(input)
    const point = _vec(parseInt(parsedInput.x), parseInt(parsedInput.y))

    mapPointsDescription[JSON.stringify(point)] = parsedInput.description

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
