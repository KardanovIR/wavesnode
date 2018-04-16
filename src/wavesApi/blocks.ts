import axios from 'axios'
import { validateAddress } from '../bot/WavesCrypto';
import { assert } from 'expect';

const baseUrl = 'https://nodes.wavesnodes.com/'

interface IWavesBlock {
  version: number
  timestamp: number
  reference: string
  'nxt-consensus': {
    'base-target': number
    'generation-signature': string
  },
  features: number[]
  generator: string
  signature: string
  blocksize: number
  transactionCount: number
  height: number
  fee: number
  transactions: any[]
}

export const get = async (url: string) => {
  const r = await axios.get(baseUrl + url)
  if (r.status != 200 || !r.data || r.data.status == 'error')
    throw 'Something went wrong'

  return r.data
}

export const getHeight = async (): Promise<number> =>
  (await get('blocks/height')).height

export const getBlocks = async (from: number, to: number): Promise<IWavesBlock[]> =>
  await get(`blocks/seq/${from}/${to}`)

export const getLastBlocks = async (howMany?: number): Promise<IWavesBlock[]> => {
  if (!howMany)
    howMany = 0
  const height = await getHeight()
  return await getBlocks(height - howMany, height)
}

export const getLastBlock = async (): Promise<any> => {
  const data = await axios.get(`https://nodes.wavesnodes.com/blocks/last`)
  return data.data
}


export const getLastSolidBlock = async (): Promise<any> => {
  try {
    const data = await axios.get(`https://nodes.wavesnodes.com/blocks/headers/last`)
    if (data.status != 200 || data.data.status == 'error') {
      return undefined
    }
    return await getBlock(data.data.reference)
  }
  catch (ex) {
    return undefined
  }
}

export const getNextSolidBlock = async (signature: string): Promise<any> => {
  try {
    const block = await getNextBlock(signature)

    if (!block)
      return undefined

    const nextBlock = await getNextBlock(block.signature)

    if (nextBlock) {
      return block
    }

    return undefined
  }
  catch (ex) {
    return undefined
  }
}

export const getBlock = async (signature: string): Promise<any> => {
  try {
    const data = await axios.get(`https://nodes.wavesnodes.com/blocks/signature/${signature}`)
    if (data.status != 200 || data.data.status == 'error') {
      return undefined
    }

    return data.data
  } catch (error) {
    return undefined
  }
}

export const getNextBlock = async (signature: string): Promise<any> => {
  try {
    const data = await axios.get(`https://nodes.wavesnodes.com/blocks/child/${signature}`)
    if (data.status != 200 || data.data.status == 'error') {
      return undefined
    }

    return data.data
  } catch (error) {
    return undefined
  }
}
