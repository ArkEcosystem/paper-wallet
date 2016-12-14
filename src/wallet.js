
import crypto from 'crypto'

import bip39 from 'bip39'
import arkjs from 'arkjs'

angular.module('wallet', [])
  .factory('wallet', () => {

    return {
      mnemonicToData: (passphrase) => {
        if (!passphrase) {
          passphrase = bip39.generateMnemonic()
        }

        let kp = arkjs.crypto.getKeys(passphrase)

        return {
          passphrase,
          address: arkjs.crypto.getAddress(kp.publicKey),
          publicKey: kp.publicKey,
          privateKey: kp.privateKey,
          entropy: bip39.mnemonicToEntropy(passphrase),
          seed: bip39.mnemonicToSeedHex(passphrase),
        }
      },
      validateMnemonic: (mnemonic) => {
        return bip39.validateMnemonic(mnemonic)
      },
      randomBytes: crypto.randomBytes,
      entropyToMnemonic: bip39.entropyToMnemonic
    }
  })
