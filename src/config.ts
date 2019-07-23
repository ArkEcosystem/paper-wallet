class Config {
    private readonly keyPrefix: string = "paper-wallet";
    private readonly tokens: Record<string, object> = {
        ark: {
            mainnet: {
                addressPrefix: 23,
                wif: 170,
            },
            devnet: {
                addressPrefix: 30,
                wif: 170,
            },
        },
    };

    private addressPrefix: number | undefined = undefined;
    private wif: number | undefined = undefined;

    public constructor() {
        if (!this.get("token")) {
            this.set("token", "ark");
        }

        if (!this.get("network")) {
            this.set("network", "mainnet");
        }

        this.load();
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

    public getAddressPrefix(): number {
        return this.addressPrefix;
    }

    public setAddressPrefix(value: number): void {
        this.addressPrefix = value;
    }

    public getWIF(): number {
        return this.wif;
    }

    public setWIF(value: number): void {
        this.wif = value;
    }

    private load(): void {
        const { addressPrefix, wif } = this.tokens[this.getToken()][this.getNetwork()];

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
