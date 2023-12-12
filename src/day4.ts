import fs = require('fs')
import readline = require('readline')


const getNumbers = (): Promise<string[][]> => {
  return new Promise<string[][]>((resolve, reject) => {
    const numbers: string[][] = []

    try {
      const reader = readline.createInterface({ input: fs.createReadStream('./static/day4data.txt') })
      reader.on('line', (row: string) => {
        const [_cardNo, sets] = row.split(': ')
        const numberSet = sets.split(' | ')
        numbers.push(numberSet)
      })
      reader.on('close', () => { resolve(numbers) })
    } catch(e) {
      reject(e)
    }
  })
}

const part1 = () => {
  getNumbers().then((numbers) => {
    let sum = 0;

    for (const [winners, have] of numbers) {
      let count = 0;

      const winnerArr = winners.split(' ')
      const haveArr = have.split(' ')

      for (const no of haveArr) {
        if (Number.isNaN(Number.parseInt(no))) { continue; }

        if (winnerArr.indexOf(no) > -1) {
          count ++
        }
      }

      if (count === 0) { continue }

      let product = 1

      for (let i = 2; i <= count; i++) {
        product *= 2
      }

      sum += product
    }

    console.log(`part1: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

part1()

const part2 = () => {
  getNumbers().then((numbers) => {
    let sum = 0
    const multipliers = Array.from({length: numbers.length}, () => 1)
    const counts = Array.from({length: numbers.length}, () => 0)

    for (let i = 0; i < numbers.length; i++) {
      const [winners, have] = numbers[i]
      const winnerArr = winners.split(' ')
      const haveArr = have.split(' ')

      for (const no of haveArr) {
        if (Number.isNaN(Number.parseInt(no))) { continue; }

        if (winnerArr.indexOf(no) > -1) {
          counts[i] = counts[i] + 1
        }
      }

      if (counts[i] === 0) { continue }

      for (let j = i + 1; j < numbers.length && j <= i + counts[i]; j++) {
        multipliers[j] += multipliers[i]
      }

      sum = multipliers.reduce((total, current) => current + total, 0)
    }
    console.log(`part2: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

part2()
