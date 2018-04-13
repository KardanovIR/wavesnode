import * as TelegramBot from 'node-telegram-bot-api'
import { Database, IUser } from './Database'
import { Text, Icons } from './Text'
import { WavesNotifications } from './balanceMonitor'
import * as uuid from 'uuid/v4'
import { validateAddress } from './WavesCrypto'
import { IDictionary } from '../generic/IDictionary'
import { IAsset } from '../wavesApi/IAsset'
import { formatAsset, formatAssetBalance } from '../wavesApi/formatAsset'
import { getBalance, wavesAsset } from '../wavesApi/getBalance'
import { menu, IContext, PageCreationCommands, update, navigate, close, promt } from './pages/framework'
import { KeyValueStore, KeyValueStoreTyped } from '../generic/KeyValueStore'
import { sendMail } from './mail/sendMail'
import { telegrammToken, tokenSendConfig } from './secret';
import * as Waves from 'waves-api'


interface IBirthdayParticipantInfo {
  emaiConfirmed: boolean,
  wallet: string,
  botTokenSent: boolean
}

const birthdayParticipants = KeyValueStoreTyped<IBirthdayParticipantInfo>('birthdayParticipants')

async function checkParticipant(id: string) {
  const p = await birthdayParticipants.get(id, false)
  if (p) {
    console.log(p.value)
  }
  else {
    console.log('none')
  }
}

checkParticipant(process.argv0)


