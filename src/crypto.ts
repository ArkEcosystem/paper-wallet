import { entropyToMnemonic, mnemonicToEntropy } from "bip39";
import { Managers, Identities } from "@arkecosystem/crypto";

Managers.configManager.setFromPreset("mainnet"); // @TODO: make this configurable

export const walletFromBIP39 = passphrase => ({
    passphrase,
    address: Identities.Address.fromPassphrase(passphrase),
    publicKey: Identities.PublicKey.fromPassphrase(passphrase),
    wif: Identities.WIF.fromPassphrase(passphrase),
    entropy: mnemonicToEntropy(passphrase),
});

export const walletFromEntropy = entropy => walletFromBIP39(entropyToMnemonic(entropy));
