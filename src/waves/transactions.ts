import { version } from "punycode";

export interface ITransfer {
  recipient: string
  amount: number
}

export interface IMassTransferTransaction {
  fee: number
  timestamp: number
  assetId?: string
  attachment?: string
  transfers: ITransfer[]
}

export interface ISignedMassTransferTransaction extends IMassTransferTransaction {
  type: number
  version: number
  senderPublicKey: string
  proofs: string[]
}