import fs = require('fs')
import readline = require('readline')

const FILE = './static/day5data.txt'

class Garden {
  seeds: number[]
  soil: [number, number, number][]
  fertilizer: [number, number, number][]
  water: [number, number, number][]
  light: [number, number, number][]
  temp: [number, number, number][]
  humidity: [number, number, number][]
  loc: [number, number, number][]

  constructor() {
    this.seeds = []
    this.soil = []
    this.fertilizer = []
    this.water = []
    this.light = []
    this.temp = []
    this.humidity = []
    this.loc = []
  }

  toString = (): string => {
    return JSON.stringify({
      seeds: this.seeds,
      soil: this.soil,
      fertilizer: this.fertilizer,
      water: this.water,
      light: this.light,
      temp: this.temp,
      humidity: this.humidity,
      loc: this.loc
    })
  }
}

const getData = (): Promise<Garden> => {
  return new Promise<Garden>((resolve, reject) => {
    const data: Garden = new Garden()
    let lastRow = ''
    let currentSet: [number, number, number][] = data.soil

    try {
      const reader = readline.createInterface({ input: fs.createReadStream(FILE) })
      reader.on('line', (row: string) => {
        if (Number.isNaN(Number.parseInt(row))) {
          switch(row) {
            case 'seed-to-soil map:':
              currentSet = data.soil
            break;
            case 'soil-to-fertilizer map:':
              currentSet = data.fertilizer
            break;
            case 'fertilizer-to-water map:':
              currentSet = data.water
            break;
            case 'water-to-light map:':
              currentSet = data.light
            break;
            case 'light-to-temperature map:':
              currentSet = data.temp
            break;
            case 'temperature-to-humidity map:':
              currentSet = data.humidity
            break;
            case 'humidity-to-location map:':
              currentSet = data.loc
            break;
          }
        } else {
          const values = row.split(' ')

          if (lastRow === 'seeds:') {
            for (const value of values) {
              data.seeds.push(Number.parseInt(value))
            }
          } else {
            const rowSet: [number, number, number] = [
              Number.parseInt(values[0]),
              Number.parseInt(values[1]),
              Number.parseInt(values[2])
            ]
            
            currentSet.push(rowSet)
          }
        }

        lastRow = row
      })
      reader.on('close', () => { resolve(data) })
    } catch(e) {
      reject(e)
    }
  })
}

const getDestFromSrc = (set: [number, number, number][], src: number): number => {
  for (const row of set) {
    const [destStart, srcStart, range] = row

    const srcMax = srcStart + range

    if (src < srcStart || src > srcMax - 1) {
      continue
    }

    let rangeStart = srcStart
    let rangeEnd = srcMax - 1
    let midpoint = Math.floor((rangeStart + rangeEnd) / 2)

    while (midpoint != src) {
      // console.log(`src: ${src}, midpoint: ${midpoint}, rangeStart: ${rangeStart}, rangeEnd: ${rangeEnd}`)
      if (midpoint > src) {
        rangeEnd = midpoint
      } else {
        rangeStart = midpoint
      }

      if (rangeEnd === src) {
        midpoint = rangeEnd
        break;
      }

      if (rangeStart === src) {
        midpoint = rangeStart
        break
      } else if (rangeEnd === src) {
        midpoint = rangeEnd
        break
      }

      midpoint = Math.floor((rangeStart + rangeEnd) / 2)
    }

    const offset = midpoint - srcStart

    return destStart + offset
  }

  return src
}

const part1 = () => {
  getData().then((data: Garden) => {
    let minLocation = Number.MAX_VALUE

    for (const seed of data.seeds) {
      const soil = getDestFromSrc(data.soil, seed)
      const fertilizer = getDestFromSrc(data.fertilizer, soil)
      const water = getDestFromSrc(data.water, fertilizer)
      const light = getDestFromSrc(data.light, water)
      const temp = getDestFromSrc(data.temp, light)
      const humidity = getDestFromSrc(data.humidity, temp)
      const location = getDestFromSrc(data.loc, humidity)

      minLocation = Math.min(minLocation, location)
    }

    console.log(`part1: ${minLocation}`)
  }).catch((e) => {
    console.log(e)
  })
}

// part1()

const getSrcFromDest = (set: [number, number, number][], dest: number): number => {
  for (const row of set) {
    const [destStart, srcStart, range] = row

    const destMax = destStart + range

    if (dest < destStart || dest > destMax - 1) {
      continue
    }

    let rangeStart = destStart
    let rangeEnd = destMax - 1
    let midpoint = Math.floor((rangeStart + rangeEnd) / 2)

    while (midpoint != dest) {
      // console.log(`dest: ${dest}, midpoint: ${midpoint}, rangeStart: ${rangeStart}, rangeEnd: ${rangeEnd}`)
      if (midpoint > dest) {
        rangeEnd = midpoint
      } else {
        rangeStart = midpoint
      }

      if (rangeEnd === dest) {
        midpoint = rangeEnd
        break;
      }

      if (rangeStart === dest) {
        midpoint = rangeStart
        break
      } else if (rangeEnd === dest) {
        midpoint = rangeEnd
        break
      }

      midpoint = Math.floor((rangeStart + rangeEnd) / 2)
    }

    const offset = midpoint - destStart

    return srcStart + offset
  }

  return dest
}

const getSeedFromLoc = (garden: Garden, location: number): number => {
  const humidity = getSrcFromDest(garden.loc, location)
  const temp = getSrcFromDest(garden.humidity, humidity)
  const light = getSrcFromDest(garden.temp, temp)
  const water = getSrcFromDest(garden.light, light)
  const fertilizer = getSrcFromDest(garden.water, water)
  const soil = getSrcFromDest(garden.fertilizer, fertilizer)
  const seed = getSrcFromDest(garden.soil, soil)

  return seed
}

const seedInRanges = (seeds: number[], seed: number): boolean => {
  // console.log(`checking seed ${seed} for ranges ${seeds}`)
  for (let i = 0; i < seeds.length; i += 2) {
    if (seed >= seeds[i] && seed < seeds[i] + seeds[i + 1]) {
      // console.log(`Found it!`)
      return true
    }
  }

  return false
}

const part2 = () => {
  getData().then((data) => {
    // console.log(data.toString())
    let location = 0
    let seed = null

    while (seed === null) {
      const possibleSeed = getSeedFromLoc(data, location)
      // console.log(`possibleSeed: ${possibleSeed}`)
      
      if (seedInRanges(data.seeds, possibleSeed)) {
        seed = possibleSeed
      } else {
        location++
      }
    }

    console.log(`part2: ${location}`)

  }).catch((e) => {
    console.log(e)
  })
}

part2()
