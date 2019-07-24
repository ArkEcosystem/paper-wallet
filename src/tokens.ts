import { IToken } from "./interfaces";

export const tokens: Record<string, IToken> = {
    ark: {
        name: "ARK",
        networks: {
            mainnet: {
                addressPrefix: 23,
                wif: 170,
            },
            devnet: {
                addressPrefix: 30,
                wif: 170,
            },
        },
    },
    kapu: {
        name: "KAPU",
        networks: {
            mainnet: {
                addressPrefix: 45,
                wif: 170,
            },
            devnet: {
                addressPrefix: 30,
                wif: 170,
            },
        },
    },
    persona: {
        name: "PERSONA",
        networks: {
            mainnet: {
                addressPrefix: 55,
                wif: 80,
            },
            devnet: {
                addressPrefix: 31,
                wif: 186,
            },
        },
    },
    qredit: {
        name: "Qredit",
        networks: {
            mainnet: {
                addressPrefix: 58,
                wif: 187,
            },
            devnet: {
                addressPrefix: 30,
                wif: 170,
            },
        },
    },
};
