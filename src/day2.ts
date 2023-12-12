import fs = require('fs')
import readline = require('readline')

enum Colors {
  red = 'red',
  green = 'green',
  blue = 'blue'
}

type GameRound = {
  red: number,
  green: number,
  blue: number
}

type t_Game = {
  no: number,
  rounds: GameRound[]
}

const Game = class {
  no: number
  rounds: GameRound[]

  constructor(record: string) {
    const [game, roundStr] = record.split(': ')

    this.no = Number.parseInt(game.split(' ')[1])
    this.rounds = []
    
    const rounds = roundStr.split('; ')

    for (const round of rounds) {
      const roundData: GameRound = { [Colors.red]: 0, [Colors.green]: 0, [Colors.blue]: 0 }

      for (const colorCount of round.split(', ')) {
        const [count, color] = colorCount.split(' ')
        
        if (color as Colors == Colors.red) {
          roundData[Colors.red] = Number.parseInt(count)
        } else if (color as Colors == Colors.blue) {
          roundData[Colors.blue] = Number.parseInt(count)
        } else if (color as Colors == Colors.green) {
          roundData[Colors.green] = Number.parseInt(count)
        }
      }

      this.rounds.push(roundData)
    }
  }
}

const getGames = (): Promise<t_Game[]> => {
  return new Promise<t_Game[]>((resolve, reject) => {
    const games: t_Game[] = [];

    try {
      const reader = readline.createInterface({ input: fs.createReadStream('./static/day2data.txt') })
      reader.on('line', row => {
        const game = new Game(row)
        games.push(game)
      })
      reader.on('close', () => { resolve(games) })
    } catch(e) {
      reject(e)
    }
  })
}

const part1 = () => {
  getGames().then((games) => {
    let sum = 0;

    for (const game of games) {
      let validGame = true
      for (const round of game.rounds) {
        if (round.red > 12 || round.green > 13 || round.blue > 14) {
          validGame = false
        }
      }

      if (validGame) {
        sum += game.no
      }
    }

    console.log(`part1: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

const part2 = () => {
  getGames().then((games) => {
    let sum = 0;

    for (const game of games) {
      let redMax = 0
      let greenMax = 0
      let blueMax = 0

      for (const round of game.rounds) {
        redMax = Math.max(redMax, round.red)
        greenMax = Math.max(greenMax, round.green)
        blueMax = Math.max(blueMax, round.blue)
      }

      sum += redMax * greenMax * blueMax
    }

    console.log(`part2: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

part1()
part2()
