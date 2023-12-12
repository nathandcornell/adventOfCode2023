import fs = require('fs')
import readline = require('readline')

const directions: number[][] = [
  [-1,-1],
  [-1,0],
  [-1,1],
  [0, -1],
  [0, 1],
  [1,-1],
  [1, 0],
  [1, 1]
]

const getCells = (): Promise<string[][]> => {
  return new Promise<string[][]>((resolve, reject) => {
    const cells: string[][] = []
    let rowNo = 0

    try {
      const reader = readline.createInterface({ input: fs.createReadStream('./static/day3data.txt') })
      reader.on('line', (row: string) => {
        for (let i = 0; i < row.length; i++) {
          if (!cells[rowNo]) {
            cells[rowNo] = []
          }

          cells[rowNo][i] = row.charAt(i)
        }
        rowNo++
      })
      reader.on('close', () => { resolve(cells) })
    } catch(e) {
      reject(e)
    }
  })
}

const getFullNumber = (row: string[], col: number): number => {
  let left = col - 1
  let right = col + 1

  const digits: string[] = []

  while (left > -1) {
    const leftVal = row[left]

    if (leftVal.match(/\d/)) {
      digits.unshift(leftVal)
      left--
    } else {
      break;
    }
  }

  digits.push(row[col])

  while (right < row.length) {
    const rightVal = row[right]

    if (rightVal.match(/\d/)) {
      digits.push(rightVal)
      right++
    } else {
      break
    }
  }

  return Number.parseInt(digits.join(''))
}

const part1 = () => {
  getCells().then((cells) => {
    let sum = 0;

    for (let row = 0; row < cells.length; row++) {
      const currentRow = cells[row];

      for (let col = 0; col < currentRow.length; col++) {
        const cell = currentRow[col];
        const adjacentValues = new Set<number>()

        // console.log(`cell: ${cell}`)

        if (cell.match(/[\w\d\.]/)) {
          continue;
        } else {
          // console.log('Match!')
          for (const [rowDelta, colDelta] of directions) {
            const adjRow = row + rowDelta
            const adjCol = col + colDelta

            if (adjRow < 0 || adjCol < 0 || adjRow >= cells.length || adjRow >= currentRow.length) {
              continue;
            }

            // console.log(`adjRow: ${adjRow}, adjCol: ${adjCol}`)

            const adjacentCell = cells[adjRow][adjCol]

            if (adjacentCell.match(/\d/)) {
              adjacentValues.add(getFullNumber(cells[adjRow], adjCol))
            }
          }

          // console.log(adjacentValues.values())

          for (const adjVal of adjacentValues.values()) {
            sum += adjVal
          }
        }
      }
    }

    console.log(`part1: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

const part2 = () => {
  getCells().then((cells) => {
    let sum = 0;

    for (let row = 0; row < cells.length; row++) {
      const currentRow = cells[row];

      for (let col = 0; col < currentRow.length; col++) {
        const cell = currentRow[col];
        const adjacentValues = new Set<number>()

        // console.log(`cell: ${cell}`)

        if (cell.match(/\*/)) {
          // console.log('Match!')
          for (const [rowDelta, colDelta] of directions) {
            const adjRow = row + rowDelta
            const adjCol = col + colDelta

            if (adjRow < 0 || adjCol < 0 || adjRow >= cells.length || adjRow >= currentRow.length) {
              continue;
            }

            // console.log(`adjRow: ${adjRow}, adjCol: ${adjCol}`)

            const adjacentCell = cells[adjRow][adjCol]

            if (adjacentCell.match(/\d/)) {
              adjacentValues.add(getFullNumber(cells[adjRow], adjCol))
            }
          }

          // console.log(adjacentValues.values())

          if (adjacentValues.size === 2) {
            const values = Array.from(adjacentValues)
            const product = values[0] * values[1]

            // console.log(`product: ${product}`)

            sum += product
          }
        }
      }
    }

    console.log(`part2: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

part1()
part2()
