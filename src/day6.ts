import fs = require('fs')
import readline = require('readline')

const FILE = './static/day6data.txt'

const getData = () => {
  return new Promise<[number[], number[]]>((resolve, reject) => {
    const data: [number[], number[]] = [[],[]]
    let idx = 0

    try {
      const reader = readline.createInterface({ input: fs.createReadStream(FILE) })
      reader.on('line', (row: string) => {
        const parts = row.split(/:[\s]+/)
        const rowValues = parts[1].split(/[\s]+/)
        for (const val of rowValues) {
          data[idx].push(Number.parseInt(val))
        }
        idx++
      })
      reader.on('close', () => { resolve(data) })
    } catch(e) {
      reject(e)
    }
  })
}

const part1 = () => {
  getData().then((data) => {
    const [times, distances] = data
    let product = 1

    for (let i = 0; i < times.length; i++) {
      const time = times[i]
      const dist = distances[i]
      let sum = 0

      // Formula:
      // for i in 1..time
      // distance = (time - i) * i
      for (let j = 1; j < time; j++) {
        const jDist = (time - j) * j

        if (jDist > dist) {
          sum += 1
        } 
      }

      product *= sum
    }

    console.log(`part1: ${product}`)
  }).catch((e) => {
    console.log(e)
  })
}

part1()

const part2 = () => {
  getData().then((data) => {
    const [times, distances] = data
    const time = Number.parseInt(times.join(''))
    const dist = Number.parseInt(distances.join(''))
    let sum = 0

    const min = dist / Math.floor(time / 2)

    for (let j = 1; j < time; j++) {
      const jDist = (time - j) * j

      if (jDist > dist) {
        sum += 1
      } 
    }

    console.log(`part2: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

part2()
