import fs = require('fs')
import readline = require('readline')

const FILE = './static/day8data.txt'

class Node {
  value: string
  left: string
  right: string

  constructor(value: string, left: string, right: string) {
    this.value = value
    this.left = left
    this.right = right
  }

  aNode = () => this.value.charAt(2) === 'A'
  zNode = () => this.value.charAt(2) === 'Z'
}

class Data {
  dirs: string[]
  nodes: Map<string, Node>

  constructor() {
    this.dirs = []
    this.nodes = new Map<string, Node>()
  }
}

const getData = () => {
  return new Promise<Data>((resolve, reject) => {
    const data: Data = new Data()

    try {
      const reader = readline.createInterface({ input: fs.createReadStream(FILE) })
      reader.on('line', (row: string) => {
        if (row.length > 0 && row.includes('=')) {
          const [value, lr] = row.split(' = ')
          const [l, r] = lr.substring(1, 9).split(', ')

          data.nodes.set(value, new Node(value, l, r))
        } else if (row.length > 0) {
          data.dirs = row.split('')
        }
      })
      reader.on('close', () => { resolve(data) })
    } catch(e) {
      reject(e)
    }
  })
}

const part1 = () => {
  getData().then((data) => {
    let steps = 0
    let currentNode: Node | null = data.nodes.get('AAA') || null
    const target = 'ZZZ'

    while (currentNode?.value !== target) {
      const stack = [...data.dirs]
      let dir = ''
      stack.reverse()

      while (stack.length > 0 && currentNode?.value !== target) {
        dir = stack.pop() || ''
        currentNode = (dir === 'L') ? data.nodes.get(currentNode?.left || '') || null :
          data.nodes.get(currentNode?.right || '') || null
        steps++
      }
    }

    console.log(`part 1: ${steps}`)
  }).catch((e) => {
    console.log(e)
  })
}

// part1()

const part2 = () => {
  getData().then((data) => {
    const startNodes: Node[] = Array.from(data.nodes.values()).filter(node => node.aNode())
    let steps: number[] = []

    for (const node of startNodes) {
      let currentNode: Node | null = node
      let count = 0

      while(currentNode !== null && !currentNode.zNode()) {
        const stack = [...data.dirs]
        stack.reverse()

        while (stack.length > 0 && currentNode !== null && !currentNode.zNode()) {
          const dir = stack.pop()

          currentNode = (dir === 'L') ? data.nodes.get(currentNode.left || '') || null :
            data.nodes.get(currentNode.right || '') || null
          count++
        }
      }

      steps.push(count)
    }
    console.log(steps)

    const gcd = (a: number, b: number): number => {
      if (b === 0) { return a }

      return gcd(b, a % b)
    }

    const lcm = (a: number, b: number) => {
      return a * b / gcd(a, b)
    }

    const totalSteps = (values: number[]): number => {
      if (values.length === 2) {
        return lcm(values[0], values[1])
      } else {
        return lcm(values[0], totalSteps(values.slice(1)))
      }
    }

    console.log(`part 2: ${totalSteps(steps)}`)
  }).catch((e) => {
    console.log(e)
  })
}

part2()
