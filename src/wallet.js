import { randomBytes } from "crypto";
import * as bip39 from "bip39";
import { Managers, Identities } from "@arkecosystem/crypto";

angular.module("wallet", []).factory("wallet", () => {
    Managers.configManager.setFromPreset("mainnet"); // @TODO: make this configurable

    return {
        mnemonicToData: passphrase => {
            if (!passphrase) {
                passphrase = bip39.generateMnemonic();
            }

            let publicKey = Identities.PublicKey.fromPassphrase(passphrase);
            let address = Identities.Address.fromPassphrase(passphrase);
            let wif = Identities.WIF.fromPassphrase(passphrase);

            return {
                passphrase,
                passphraseqr: '{"passphrase":"' + passphrase + '"}',
                address: address,
                addressqr: '{"a":"' + address + '"}',
                publicKey: publicKey,
                wif: wif,
                entropy: bip39.mnemonicToEntropy(passphrase),
            };
        },
        validateMnemonic: mnemonic => {
            return bip39.validateMnemonic(mnemonic);
        },
        randomBytes,
        entropyToMnemonic: bip39.entropyToMnemonic,
    };
});
