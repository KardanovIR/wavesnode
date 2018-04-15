import { validateAddress } from "./bot/WavesCrypto";
import { readFileSync, writeFileSync } from "fs";
import * as linq from 'linq'


const wallets: string[] = []
const filesToMerge = process.argv.slice(2)
filesToMerge.map(f => readFileSync(f, { encoding: 'utf8' })
  .split('\n')).reduce((a, b) => a.concat(b))
  .forEach(x => {
    try {
      x = x.trim()
      if (!validateAddress(x)) {
        if (x.length > 0)
          console.log(x)
      }
      else {
        wallets.push(x)
      }
    }
    catch (ex) {
    }
  })

const distinctWallets = linq.from(wallets).distinct().toArray()

console.log(wallets.length)
console.log(distinctWallets.length)

writeFileSync(filesToMerge.map(x => x.replace('/', '_')).join('_') + '_merged', distinctWallets.join('\n'))
