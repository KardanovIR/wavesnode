import net = require('net')
import Base58 = require("base-58")
import { HandshakeSchema, Schema, MessageCode, Handshake, Block } from "./schema/messages"
import { serializeMessage, deserializeMessage } from "./schema/serialization"
import { connect } from 'net';
import Rx = require('rx-lite')
import { triggerAsyncId } from 'async_hooks';
import { loadavg } from 'os';
import { setInterval, setTimeout } from 'timers';
import * as Primitives from './schema/primitives';
import { IDictionary } from './generic/IDictionary';
import * as LRU from 'lru-cache'
import { write, IReadBuffer } from './binary/BufferBE';
import { IncomingBuffer } from './binary/IncomingBuffer';
import * as Long from 'long';
import * as fs from 'fs'

interface IncomingNetworkMessage {
  code: number,
  bytes: IReadBuffer
}

interface IMessageHandler {
  messageStream(message: IncomingNetworkMessage): Rx.IObservable<any>
}