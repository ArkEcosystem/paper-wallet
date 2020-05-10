import secp256k1 from "secp256k1";
import { sync } from "simple-sha256";
import { Buffer } from "buffer/";

export const signMessage = (message: string, passphrase: string) => {
    const privateKey = Buffer.from(sync(passphrase), "hex");

    return {
        publicKey: Buffer.from(secp256k1.publicKeyCreate(privateKey)).toString("hex"),
        signature: Buffer.from(
            secp256k1.signatureExport(secp256k1.ecdsaSign(Buffer.from(sync(message), "hex"), privateKey).signature),
        ).toString("hex"),
        message,
    };
};

export const verifyMessage = ({ message, publicKey, signature }) => {
    return secp256k1.ecdsaVerify(
        secp256k1.signatureImport(Uint8Array.from(Buffer.from(signature, "hex"))),
        Buffer.from(sync(message), "hex"),
        Buffer.from(publicKey, "hex"),
    );
};
