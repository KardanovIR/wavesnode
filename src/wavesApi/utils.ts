import * as linq from 'linq'
import * as JSPath from 'jspath'
import * as WavesAPI from 'waves-api';

const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG);

export const getAddressesFromObj = (block): string[] => {
  const result = linq.from(JSPath.apply('..sender | ..recipient | ..senderPublicKey', block)).distinct()
    .select((x: string) => {
      if (!x.startsWith('3P')) {
        try {
          return Waves.tools.getAddressFromPublicKey(x)
        } catch (error) {
        }
      }
    }).where(x => x).distinct().toArray()

  return result
}
