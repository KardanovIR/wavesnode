import { IDictionary } from '../generic/IDictionary';
import { IWalletBalances } from '../wavesApi/IWalletBalances';
import { getBalance } from '../wavesApi/getBalance'
import { ObservableNodeConnection } from '../observableNodeConnection';
import { MessageCode } from '../schema/messages';
import { Observable, Subscription, Subscriber, Subject, ReplaySubject } from 'rxjs/Rx';
import { IDatabase } from './Database';
import { KeyValueStoreTyped } from "../generic/KeyValueStore";
import { getLastBlockSignature } from "../wavesApi/getLastBlockSignature";
import { getLastBlock, getBlock, getNextBlock, getLastSolidBlock, getNextSolidBlock, getLastBlocks } from "../wavesApi/blocks";
import { getAddressesFromObj } from "../wavesApi/utils";

export interface IWalletNotifications {
  balances: Observable<IWalletBalances>
  addWallet: (address: string) => void
}

export const WavesNotifications = (db: IDatabase): IWalletNotifications => {
  const accountsToUpdate = KeyValueStoreTyped<string>('accountsToUpdate')

  async function discoverAccounts() {
    try {
      const blocks = await getLastBlocks(10)
      const transactions = blocks.map(b => b.transactions).reduce((a, b) => a.concat(b))
      const addresses = getAddressesFromObj(transactions)

      let count = 0
      const p = addresses.map(async a => {
        const subscriptions = await db.getAddressSubscriptions(a)
        if (subscriptions && subscriptions.length > 0) {
          await accountsToUpdate.insert(a, '')
          count++
        }
      })

      await Promise.all(p)

      if (count > 0)
        update()
    }
    catch (ex) {
      console.log(ex)
    }

    setTimeout(discoverAccounts, 1000 * 30)
  }

  const balances = new ReplaySubject<IWalletBalances>()
  let isUpdateRunning = false
  async function update() {
    if (isUpdateRunning)
      return

    isUpdateRunning = true
    const account = await accountsToUpdate.get(undefined, true)
    if (!account) {
      console.log('No addresses to update')
      isUpdateRunning = false
      return
    }

    console.log(`Updating address: ${account.key}`)

    try {
      const b = await getBalance(account.key)
      balances.next(b)
    } catch (ex) {
      console.log(ex)
    }

    isUpdateRunning = false
    setImmediate(update)
  }

  discoverAccounts()
  update()

  return {
    balances,
    addWallet: async (wallet: string) => {
      await accountsToUpdate.insert(wallet, '')
      update()
    }
  }
}
