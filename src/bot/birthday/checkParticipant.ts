import * as TelegramBot from 'node-telegram-bot-api'
import { Database, IUser } from '../Database'
import { Text, Icons } from '../Text'
import { WavesNotifications } from '../balanceMonitor'
import * as uuid from 'uuid/v4'
import { validateAddress } from '../WavesCrypto'
import { IDictionary } from '../../generic/IDictionary'
import { IAsset } from '../../wavesApi/IAsset'
import { formatAsset, formatAssetBalance } from '../../wavesApi/formatAsset'
import { getBalance, wavesAsset } from '../../wavesApi/getBalance'
import { menu, IContext, PageCreationCommands, update, navigate, close, promt } from '../pages/framework'
import { KeyValueStore, KeyValueStoreTyped } from '../../generic/KeyValueStore'
import { sendMail } from '../mail/sendMail'
import { telegrammToken, tokenSendConfig } from '../secret';
import * as Waves from 'waves-api'
import * as linq from 'linq'
import { airdrop } from '../../waves/send';
import { count } from 'rxjs/operator/count';


interface IBirthdayParticipantInfo {
  emaiConfirmed: boolean,
  wallet: string,
  botTokenSent: boolean
}

const birthdayParticipants = KeyValueStoreTyped<IBirthdayParticipantInfo>('birthdayParticipants')

async function checkParticipants() {
  var addresses = []
  var participants: { key: string, value: IBirthdayParticipantInfo }[] = []

  var failed = 0
  var success = 0

  const p = await birthdayParticipants.all()

  p.filter(x => x.value.botTokenSent == false).forEach(p => {
    const address = p.value.wallet
    participants.push(p)
    addresses.push(address)
    if (addresses.length == 100) {
      const a = addresses
      const p = participants
      addresses = []
      participants = []
      airdrop(tokenSendConfig.assetId, 1, a, tokenSendConfig.seed)
        .then(x => {
          success += a.length
          p.forEach(async x => {
            x.value.botTokenSent = true
            await birthdayParticipants.update(x.key, x.value)
          })
          console.log('Fixed wallets: ' + success)
        })
        .catch(x => {
          console.log(x)
          process.abort()
          failed += a.length
          console.log('Failed wallets: ' + failed)
          console.log(a.join('\n'))
        })
    }
  })

  if (participants.length > 0) {
    const a = addresses
    const p = participants
    addresses = []
    participants = []
    airdrop(tokenSendConfig.assetId, 1, a, tokenSendConfig.seed)
      .then(x => {
        success += a.length
        p.forEach(async x => {
          x.value.botTokenSent = true
          await birthdayParticipants.update(x.key, x.value)
        })
        console.log('Fixed wallets: ' + success)
      })
      .catch(x => {
        console.log(x)
        process.abort()
        failed += a.length
        console.log('Failed wallets: ' + failed)
        console.log(a.join('\n'))
      })
  }
}

checkParticipants()


