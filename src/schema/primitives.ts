import ByteBuffer = require('byte-buffer');
import {Int64BE} from "int64-buffer"
import Bignum = require('bignum');
const Base58 = require('base-58');

  //Byte size and string contents
   export const string = {
    encode: (b, v) => {
      b.writeUnsignedByte(v.length)
      b.writeString(v)
    },
    decode: b => b.readString(b.readUnsignedByte())
  }

  export const fixedStringBase58 = size => ({
    encode: (b, v) => b.write(Base58.decode(v)),
    decode: b => Base58.encode(b.read(size).raw)
  })
  //Sequence of three ints
  export const version = {
    encode: (b, v) => v.split('.', 3).forEach(i => b.writeInt(i)),
    decode: b => `${b.readInt()}.${b.readInt()}.${b.readInt()}`
  }
  export const long = {
    encode: (b, v) => b.write(v.toArrayBuffer()),
    decode: b => new Int64BE(b.read(8).raw)
  }
  export const int = {
    encode: (b, v) => b.writeInt(v),
    decode: b => b.readInt()
  }
  export const byte = {
    encode: (b, v) => b.writeByte(v),
    decode: b => b.readByte()
  }
  //Int size and bytes
  export const bytes = {
    encode: (b, v) => {
      b.writeInt(v.length)
      b.write(v)
    },
    decode: b => b.read(b.readInt())
  }
  export const fixedBytes = size => ({
    encode: (b, v) => b.write(v),
    decode: b => b.read(size)
  })
  //Int size and schema
  export const array = (serialize, deserialize) => schema => ({
    encode: (b, v) => {
      b.writeInt(v.length)
      v.forEach(i => serialize(b, i, schema))
    },
    decode: b => {
      var count = b.readInt()
      var result = []
      for (var i = 0; i < count; i++) {
        result.push(deserialize(b, schema))
      }
      return result
    }
  })
  export const bigInt = size => ({
    encode: (b, v) => b.write(v.toBuffer()),
    decode: b => Bignum.fromBuffer(b.read(size).raw)
  })