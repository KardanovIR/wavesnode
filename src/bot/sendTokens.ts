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
import { sendMail } from './mail/sendMail'
import { telegrammToken, tokenSendConfig } from './secret';
import * as Waves from 'waves-api'
import { Database as sqlite } from 'sqlite3'
import { KeyValueStoreTyped } from '../generic/KeyValueStore';


const w = Waves.create(Waves.MAINNET_CONFIG);

interface IBirthdayParticipantInfo {
  emaiConfirmed: boolean,
  wallet: string,
  botTokenSent: boolean
}


const encodeDecode = {
  encode: <T>(obj: T): string => JSON.stringify(obj),
  decode: <T>(value: string): T => <T>JSON.parse(value)
}


const db = new sqlite('birthdayParticipants')
const { encode, decode } = encodeDecode

const birthdayParticipants = KeyValueStoreTyped<IBirthdayParticipantInfo>('birthdayParticipants')


db.serialize(() => {
  db.all('Select * from kvstore', function (err, rows: { key: string, value: string }[]) {
    const r = rows.map(r => ({ key: r.key, value: JSON.parse(r.value) })).filter((r) => r.value.botTokenSent == false).forEach((kv) => {
      const bp: IBirthdayParticipantInfo = kv.value
      sendToken(bp.wallet).then(x => {
        bp.botTokenSent = true
        birthdayParticipants.update(kv.key, bp)
        console.log(bp.wallet)
      })
    })
  })
})

async function sendToken(wallet: string) {

  const transferData = {
    recipient: wallet,
    assetId: tokenSendConfig.assetId,
    amount: tokenSendConfig.amount,
    feeAssetId: 'WAVES',
    fee: 100000,
    attachment: '',
    timestamp: Date.now()
  }

  const anotherSeed = w.Seed.fromExistingPhrase(tokenSendConfig.seed);


  w.API.Node.v1.assets.transfer(transferData, anotherSeed.keyPair).then(z => { })

}
