<template>
    <div class="wallet-from-entropy">
        <div v-if="!wallet">
            <span class="entropy-title">E{{ entropyProgress.title }}</span>
            <hr />
            <span class="entropy-subtitle">{{ entropyProgress.subtitle }}</span>
        </div>

        <Wallet :wallet="wallet" v-if="wallet" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Generator } from "more-entropy";
import { randomBytes } from "crypto";
import Wallet from "@/components/Wallet.vue";
import { walletFromEntropy } from "@/crypto";
import { IWallet } from "@/interfaces";

@Component({
    components: {
        Wallet,
    },
})
export default class WalletFromEntropy extends Vue {
    public entropy: number[] = [];
    public entropyCurrent: number | null = null;
    public entropyProgress: Record<string, string | number> | null = {};
    public entropyTimer: NodeJS.Timeout | null = null;
    public wallet: IWallet | null = null;

    public mounted(): void {
        this.entropyTimer = setInterval(this.generateEntropyProgress, 100);

        new Generator().generate(2048, values => {
            this.entropy = values.concat(Array.from(randomBytes(256)));

            this.generateWallet();
        });
    }

    public generateWallet(): void {
        try {
            this.wallet = walletFromEntropy(this.shuffle(this.entropy).slice(0, 16));
        } catch (error) {
            // invalid passphrase, give some error indicator
        } finally {
            clearInterval(this.entropyTimer);
        }
    }

    private shuffle(items: number[]): number[] {
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        return items;
    }

    private generateEntropyProgress(): void {
        let value: string = this.numberBetween(1, 100).toString();

        while (value.length < 3) {
            value = "0" + value;
        }

        this.entropyProgress = {
            title: randomBytes(20)
                .toString("hex")
                .substring(0, 1)
                .toUpperCase(),
            subtitle: value,
        };
    }

    private numberBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
</script>
