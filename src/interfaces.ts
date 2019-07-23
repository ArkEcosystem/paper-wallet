export interface IWallet {
    passphrase: string;
    address: string;
    publicKey: string;
    wif: string;
    entropy: string;
}

export interface ITokenNetwork {
    addressPrefix: number;
    wif: number;
}

export interface IToken {
    name: string;
    networks: Record<string, ITokenNetwork>;
}
