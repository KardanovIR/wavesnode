import axios from 'axios'
import { IMassTransferTransaction } from './transactions'
import { signMassTranserTransaction } from './sign'

const apiBase = 'http://nodes.wavesnodes.com/'

export const sendMassTransferTransaction = async (tx: IMassTransferTransaction, seed: string) => {
  const signedTx = signMassTranserTransaction(tx, seed)
  return axios.post(apiBase + 'transactions/broadcast', signedTx)
}

export const airdrop = async (assetId: string, amount: number, addresses: string[], seed: string) => {
  const signedTx = signMassTranserTransaction({
    assetId,
    fee: 100000 + 50000 * addresses.length,
    transfers: addresses.map(a => ({ recipient: a, amount })),
    timestamp: Date.now(),
  }, seed)
  //return axios.post(apiBase + 'transactions/broadcast', signedTx)
  return axios.get(apiBase + 'blocks/height')
}
