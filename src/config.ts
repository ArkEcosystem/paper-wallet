import { IToken } from "./interfaces";
import { tokens } from "./tokens";

class Config {
    private readonly keyPrefix: string = "paper-wallet";

    public constructor() {
        if (!this.get("token")) {
            this.set("token", "ark");
        }

        if (!this.get("network")) {
            this.set("network", "mainnet");
        }

        this.load();
    }

    public getTokens(): Record<string, IToken> {
        return tokens;
    }

    public getToken(): string {
        return this.get("token");
    }

    public setToken(value: string): void {
        this.set("token", value);
    }

    public getNetwork(): string {
        return this.get("network");
    }

    public setNetwork(value: string): void {
        this.set("network", value);

        this.load();
    }

    public getName(): string {
        return this.get("name");
    }

    public setName(value: string): void {
        this.set("name", value);
    }

    public getAddressPrefix(): number {
        return +this.get("addressPrefix");
    }

    public setAddressPrefix(value: number): void {
        this.set("addressPrefix", value.toString());
    }

    public getWIF(): number {
        return +this.get("wif");
    }

    public setWIF(value: number): void {
        this.set("wif", value.toString());
    }

    private load(): void {
        if (this.getName() === "Custom") {
            return;
        }

        const { name, networks } = tokens[this.getToken()];
        const { addressPrefix, wif } = networks[this.getNetwork()];

        this.setName(name);
        this.setAddressPrefix(addressPrefix);
        this.setWIF(wif);
    }

    private get(key: string): string {
        return localStorage.getItem(`${this.keyPrefix}.${key}`);
    }

    private set(key: string, value: string): void {
        localStorage.setItem(`${this.keyPrefix}.${key}`, value);
    }
}

export const config = new Config();
