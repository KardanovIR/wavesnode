import { ByteBuffer } from 'byte-buffer'

export interface ISchema {
  encode(buffer: ByteBuffer, obj: any)
  decode(buffer: ByteBuffer): any
}