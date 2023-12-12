import fs = require('fs')
import readline = require('readline')

const FILE = './static/day8testdata.txt'

const getData = () => {
  return new Promise<string[]>((resolve, reject) => {
    const data: string[] = []

    try {
      const reader = readline.createInterface({ input: fs.createReadStream(FILE) })
      reader.on('line', (row: string) => {
        data.push(row)
      })
      reader.on('close', () => { resolve(data) })
    } catch(e) {
      reject(e)
    }
  })
}

const part1 = () => {
  getData().then((data) => {
    const sum = 0
    console.log(`part 1: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

part1()

const part2 = () => {
  getData().then((data) => {
    const sum = 'TODO'
    console.log(`part 2: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

part2()
