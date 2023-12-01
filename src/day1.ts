import fs = require('fs')
import readline = require('readline')

const getValues = (): Promise<string[]> => {
  return new Promise<string[]>((resolve, reject) => {
    const values: string[] = [];

    try {
      const reader = readline.createInterface({ input: fs.createReadStream('./static/day1data.txt') })
      reader.on('line', row => values.push(row))
      reader.on('close', () => { resolve(values) })
    } catch(e) {
      reject(e)
    }
  })
}

const digitNames = [
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"]
]

const namesToDigits = (original: string): string => {
  const newStr: string[] = []

  for (let i = 0; i < original.length; i++) {
    const iChar = original.charAt(i)

    if (Number.isNaN(Number.parseInt(iChar))) {
      for (const [name, value] of digitNames) {
        const endIdx = i + name.length

        if (endIdx > original.length) {
          continue
        }

        const sub = original.slice(i, endIdx)

        if (sub === name) {
          newStr.push(value)
        }
      }
    } else {
      newStr.push(iChar)
    }
  }

  return newStr.join('')
}

getValues().then((values) => {
  let sum = 0

  for (const originalValue of values) {
    const value = namesToDigits(originalValue)
    const number = `${value[0]}${value[value.length - 1]}`

    sum += Number.parseInt(number)
  }

  console.log(sum)
}).catch((e) => {
  console.log(e)
})
