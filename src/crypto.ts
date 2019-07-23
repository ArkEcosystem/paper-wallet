import { entropyToMnemonic, mnemonicToEntropy } from "bip39";
import secp256k1 from "secp256k1";
import RIPEMD160 from "ripemd160";
import { sync } from "simple-sha256";
import { Buffer } from "buffer/";
import wif from "wif";
import bs58check from "bs58check";

const getAddress = (publicKey: string): string => {
    const buffer = Buffer.from(new RIPEMD160().update(Buffer.from(publicKey, "hex")).digest("hex"), "hex");
    const payload = Buffer.alloc(21);

    payload.writeUInt8(23, 0); // @TODO: make the 23 configurable
    buffer.copy(payload, 1);

    return bs58check.encode(payload);
};

const getPublicKey = (privateKey: Buffer): string => secp256k1.publicKeyCreate(privateKey).toString("hex");
const getWIF = (privateKey: Buffer): string => wif.encode(170, privateKey, true); // @TODO: make the 170 configurable

export const walletFromBIP39 = passphrase => {
    const privateKey: Buffer = Buffer.from(sync(passphrase), "hex");
    const publicKey: string = getPublicKey(privateKey);

    return {
        passphrase,
        address: getAddress(publicKey),
        publicKey,
        wif: getWIF(privateKey),
        entropy: mnemonicToEntropy(passphrase),
    };
};

export const walletFromEntropy = entropy => walletFromBIP39(entropyToMnemonic(entropy));
