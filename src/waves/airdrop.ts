import * as fs from 'fs'
import * as readline from 'readline'
import { airdrop } from './send';
import { Scheduler } from 'rx-core';

const assetId = 'FNFEwvwXEW2w8bzCFhMFL51xXkCt8xAB8gzxqmYRFVx9'
const seed = 'flush also theory reunion match useful dial era crystal perfect output today consider forest general'
const amount = 1

const file = readline.createInterface({
  input: fs.createReadStream(process.cwd() + '/' + process.argv[2]),
  output: fs.createWriteStream(process.cwd() + '/' + process.argv[2] + "_success"),
})

var addresses = []

var failed = 0
var success = 0

const flush = (self) => {
  const a = addresses
  addresses = []
  const w = a.join('\n') + '\n'
  airdrop(assetId, amount, a, seed)
    .then(x => {
      self.output.write(w)
      success += a.length
      console.log('Success wallets: ' + success)
    })
    .catch(x => {
      console.log(x)
      process.abort()
      failed += a.length
      console.log('Failed wallets: ' + failed)
      fs.appendFileSync(process.cwd() + '/' + process.argv[2] + '_failed', w)
    })
}

file.on('line', function (address: string) {
  addresses.push(address)
  if (addresses.length == 100) {
    flush(this)
  }
})

file.on('close', function () {
  flush(this)
})