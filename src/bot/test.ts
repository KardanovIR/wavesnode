import { KeyValueStoreTyped } from '../generic/KeyValueStore';
import { validateAddress } from './WavesCrypto';
import { WavesNotifications } from './WavesNotifications';
import { Database } from './Database';
import { getHeight, getLastBlocks } from '../wavesApi/blocks';
import { getAddressesFromObj } from '../wavesApi/utils';

async function main() {
  const blocks = await getLastBlocks(10)
  const transactions = blocks.map(b => b.transactions).reduce((a, b) => a.concat(b))
  const addresses = getAddressesFromObj(transactions)
  console.log(addresses.length)
}

main()