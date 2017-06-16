
import crypto from 'crypto'

import bip39 from 'bip39'
import bip38 from 'bip38'
import wif from 'wif'
import arkjs from 'arkjs'

function mnemonicToData(passphrase) {
  if (!passphrase) {
    passphrase = bip39.generateMnemonic()
  }

  let networks = arkjs.networks
  let ecpair = arkjs.ECPair.fromSeed(passphrase, networks.ark)

  let publicKey = ecpair.getPublicKeyBuffer().toString('hex')
  let address = ecpair.getAddress().toString('hex')
  let wif = ecpair.toWIF()

  return {
    passphrase,
    passphraseqr: '{"passphrase":"'+passphrase+'"}',
    address: address,
    addressqr: '{"a":"'+address+'"}',
    publicKey: publicKey,
    wif: wif,
    entropy: bip39.mnemonicToEntropy(passphrase),
    seed: bip39.mnemonicToSeedHex(passphrase),
  }
}

angular.module('wallet', [])
  .factory('wallet', () => {

    return {
      mnemonicToData: mnemonicToData,
      validateMnemonic: (mnemonic) => {
        return bip39.validateMnemonic(mnemonic)
      },
      encryptPassphrase: (entropy, password) => {
        var buffer = new Buffer(entropy)
        var encrypted = bip38.encrypt(buffer, false, password)

        return encrypted
      },
      decryptPassphrase: (password, encrypted) => {
        let promise = new Promise((resolve, reject) => {
          var decrypt = bip38.decrypt(encrypted, password)

          if(!decrypt) {
            reject()
          } else {
            var mnemonic = decrypt.privateKey.toString('utf-8');
            var passphrase = bip39.entropyToMnemonic(mnemonic)
            var wallet = mnemonicToData(passphrase)
            var address = wallet.address
          }

          resolve({ address, passphrase })
        })

        return promise
      },
      randomBytes: crypto.randomBytes,
      entropyToMnemonic: bip39.entropyToMnemonic
    }
  })
