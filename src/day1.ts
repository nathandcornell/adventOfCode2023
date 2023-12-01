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

getValues().then((values) => {
  let sum = 0

  for (const value of values) {
    console.log(value)
    let ptr1 = 0
    let ptr2 = value.length - 1

    let first: string | null = null;
    let second: string | null = null;

    while (first === null || second === null) {
      if (first === null) {
        const char1: string = value.charAt(ptr1) || ""
        const int1 = Number.parseInt(char1)

        if (Number.isNaN(int1)) {
          ptr1++
        } else {
          first = char1
        }
      }

      if (second === null) {
        const char2: string = value.charAt(ptr2) || ""
        const int2 = Number.parseInt(char2)

        if (Number.isNaN(int2)) {
          ptr2--
        } else {
            second = char2
          }
      }
    }

    sum += Number.parseInt(`${first}${second}`)
  }

  console.log(sum)
}).catch((e) => {
  console.log(e)
})
