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
import * as fs from 'fs'
import * as readline from 'readline'
import { airdrop } from '../../waves/send';

async function main() {
  const birthdayParticipants = KeyValueStoreTyped<IBirthdayParticipantInfo>('birthdayParticipants')

  const p = await birthdayParticipants.all()

  const file = readline.createInterface({
    input: fs.createReadStream(process.cwd() + '/' + process.argv[2]),
  })

  interface IBirthdayParticipantInfo {
    emaiConfirmed: boolean,
    wallet: string,
    botTokenSent: boolean
  }

  let count = 0

  file.on('line', function (address: string) {
    p.filter(x => x.value.wallet == address).forEach(async x => {
      x.value.botTokenSent = true
      await birthdayParticipants.update(x.key, x.value)
      count++
      console.log(count)
    })
  })

  file.on('close', function () {
  })
}

main()