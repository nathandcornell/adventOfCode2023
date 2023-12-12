import fs = require('fs')
import readline = require('readline')

const FILE = './static/day7data.txt'

type Hand = {
  cards: string,
  bid: number
}

enum HandTypes {
  high = 'high',
  pair = 'pair',
  twoPair = 'twoPair',
  three = 'three',
  full = 'full',
  four = 'four',
  five = 'five'
}

const CARDS: Record<string, number> = {
  'A': 14, // 
  'K': 13,
  'Q': 12,
  'J': 11,
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2
}

const CARDS_2: Record<string, number> = {
  'A': 14,
  'K': 13,
  'Q': 12,
  'J': 1,
  'T': 10,
  '9': 9,
  '8': 8,
  '7': 7,
  '6': 6,
  '5': 5,
  '4': 4,
  '3': 3,
  '2': 2
}

const getData = () => {
  return new Promise<Hand[]>((resolve, reject) => {
    const data: Hand[] = []

    try {
      const reader = readline.createInterface({ input: fs.createReadStream(FILE) })
      reader.on('line', (row: string) => {
        const [cards, bid] = row.split(' ')
        const bidNo = Number.parseInt(bid)
        data.push({ cards, bid: bidNo })
      })
      reader.on('close', () => { resolve(data) })
    } catch(e) {
      reject(e)
    }
  })
}

const rankHand = (hand: string): HandTypes => {
  const cards = hand.split('')

  const sets = {
    [HandTypes.pair]: 0,
    [HandTypes.three]: 0,
    [HandTypes.four]: 0,
    [HandTypes.five]: 0
  }

  const cardFrequencies = Array.from({ length: 15 }, () => 0)

  for (const card of cards) {
    const cardNo = CARDS[card] || 0

    cardFrequencies[cardNo] += 1
  }

  for (const freq of cardFrequencies) {
    switch(freq) {
      case 5:
        return HandTypes.five
      case 4:
        return HandTypes.four
      case 3:
        sets[HandTypes.three] += 1
        break
      case 2:
        sets[HandTypes.pair] += 1
        break
    }
  }

  if (sets[HandTypes.pair] > 0 && sets[HandTypes.three] > 0) {
    return HandTypes.full
  } else if (sets[HandTypes.three] > 0) {
    return HandTypes.three
  } else if (sets[HandTypes.pair] > 1) {
    return HandTypes.twoPair
  } else if (sets[HandTypes.pair] > 0) {
    return HandTypes.pair
  }

  return HandTypes.high
}

const rankHand2 = (hand: string): HandTypes => {
  console.log(`raiseHand2(${hand})`)
  const cards = hand.split('')

  const cardFrequencies = new Map<number, number>()

  for (const card of cards) {
    const cardNo = CARDS_2[card] || 0
    const freq = cardFrequencies.get(cardNo) || 0
    cardFrequencies.set(cardNo, freq + 1)
  }
  console.log(`cardFrequencies: ${JSON.stringify(Array.from(cardFrequencies.entries()))}`)

  const jokerCount = cardFrequencies.get(1) || 0
  console.log(`jokerCount: ${jokerCount}`)
  const keys = Array.from(cardFrequencies.keys())
  const keysLen = keys.length
  const freqs = Array.from(cardFrequencies.values())

  if (keysLen === 1) {
    return HandTypes.five
  }

  if (keysLen === 2) {
    if (jokerCount > 0) {
      return HandTypes.five
    }
    if (freqs.includes(4)) {
      return HandTypes.four
    }
    return HandTypes.full
  }

  if (freqs.includes(3)) {
    if (jokerCount > 0) {
      return HandTypes.four
    }

    return HandTypes.three
  }

  if (freqs.includes(2)) {
    const pairCount = freqs.reduce((sum, curr) => (curr === 2) ? sum += 1 : sum, 0)

    if (pairCount > 1) {
      if (jokerCount === 2) {
        return HandTypes.four
      } else if (jokerCount === 1) {
        return HandTypes.full
      } else {
        return HandTypes.twoPair
      }
    } else {
      if (jokerCount > 0) {
        return HandTypes.three
      }

      return HandTypes.pair
    }
  }

  if (jokerCount > 0) {
    return HandTypes.pair
  }

  return HandTypes.high
}

const compareHands = (a: Hand, b: Hand) => {
  const aChars = a.cards.split('')
  const bChars = b.cards.split('')

  let idx = 0
  let aCharVal = CARDS[aChars[idx]]
  let bCharVal = CARDS[bChars[idx]]

  while (aCharVal === bCharVal) {
    idx ++ 
    aCharVal = CARDS[aChars[idx]]
    bCharVal = CARDS[bChars[idx]]
  }

  return aCharVal - bCharVal
}

const compareHands2 = (a: Hand, b: Hand) => {
  const aChars = a.cards.split('')
  const bChars = b.cards.split('')

  //console.log(`${JSON.stringify(aChars)} vs ${JSON.stringify(bChars)}`)

  let idx = 0
  let aChar = aChars[idx]
  let bChar = bChars[idx]

  //console.log(`aChar: ${aChar}, bChar: ${bChar}`)

  while (aChar === bChar) {
    idx++ 
    aChar = aChars[idx]
    bChar = bChars[idx]

    //console.log(`aChar: ${aChar}, bChar: ${bChar}`)
  }

  const aCharVal = CARDS_2[aChar]
  const bCharVal = CARDS_2[bChar]

  // console.log(`aCharVal: ${aCharVal} vs bCharVal: ${bCharVal} = ${aCharVal - bCharVal}`)

  return aCharVal - bCharVal
}

const part1 = () => {
  getData().then((data) => {
    const sets = new Map<HandTypes, Hand[]>()

    for (const hand of data) {
      const handValue = rankHand(hand.cards)
      const currentSet = sets.get(handValue) || []

      currentSet.push(hand)
      sets.set(handValue, currentSet)
    }

    for (const [handType, hands] of sets.entries()) {
      hands.sort(compareHands)
      sets.set(handType, hands)
    }

    const completeSet: Hand[] = []

    for (const hand of sets.get(HandTypes.high) || []) {
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.pair) || []) {
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.twoPair) || []) {
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.three) || []) {
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.full) || []) {
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.four) || []) {
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.five) || []) {
      completeSet.push(hand)
    }

    let sum = 0

    for (let idx = 0; idx < completeSet.length; idx++) {
      const rank = idx + 1
      const hand = completeSet[idx]

      sum += rank * hand.bid
    }
    console.log(`part 1: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

// part1()

const part2 = () => {
  getData().then((data) => {
    const sets = new Map<HandTypes, Hand[]>()

    for (const hand of data) {
      // console.log(hand.cards)
      const handValue = rankHand2(hand.cards)
      console.log(`rank: ${handValue}`)
      const currentSet = sets.get(handValue) || []

      currentSet.push(hand)
      sets.set(handValue, currentSet)
    }

    for (const [handType, hands] of sets.entries()) {
      // console.log(`unsorted: ${JSON.stringify(hands)}`)
      hands.sort(compareHands2)
      // console.log(`sorted: ${JSON.stringify(hands)}`)
      sets.set(handType, hands)
    }

    const completeSet: Hand[] = []

    for (const hand of sets.get(HandTypes.high) || []) {
      // console.log(hand)
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.pair) || []) {
      // console.log(hand)
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.twoPair) || []) {
      // console.log(hand)
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.three) || []) {
      // console.log(hand)
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.full) || []) {
      // console.log(hand)
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.four) || []) {
      // console.log(hand)
      completeSet.push(hand)
    }

    for (const hand of sets.get(HandTypes.five) || []) {
      // console.log(hand)
      completeSet.push(hand)
    }

    console.log(completeSet)

    let sum = 0

    for (let idx = 0; idx < completeSet.length; idx++) {
      const rank = idx + 1
      const hand = completeSet[idx]
      const value = rank * hand.bid
      // console.log(value)

      sum += value
    }
    console.log(`part 2: ${sum}`)
  }).catch((e) => {
    console.log(e)
  })
}

part2()
