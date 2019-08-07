import secp256k1 from "secp256k1";
import { sync } from "simple-sha256";
import { Buffer } from "buffer/";

// NOTE: secp256k1 expects a node.js Buffer but the polyfill has all methods we need so the @ts-ignore let us run it
export const signMessage = (message: string, passphrase: string) => {
    const privateKey = Buffer.from(sync(passphrase), "hex");

    return {
        // @ts-ignore
        publicKey: secp256k1.publicKeyCreate(privateKey).toString("hex"),
        signature: secp256k1
            // @ts-ignore
            .signatureExport(secp256k1.sign(Buffer.from(sync(message), "hex"), privateKey).signature)
            .toString("hex"),
        message,
    };
};

export const verifyMessage = ({ message, publicKey, signature }) => {
    return secp256k1.verify(
        // @ts-ignore
        Buffer.from(sync(message), "hex"),
        // @ts-ignore
        secp256k1.signatureImport(Buffer.from(signature, "hex")),
        Buffer.from(publicKey, "hex"),
    );
};
