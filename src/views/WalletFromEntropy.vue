<template>
    <div class="wallet-from-entropy mt-5">
        <div v-if="!wallet" class="relative">
            <Spinner size="huge" />
            <div class="absolute left-0 right-0 mx-auto text-center" style="top:25%;">
                <span class="entropy-title">E{{ entropyProgress.title }}</span>
                <hr />
                <span class="entropy-subtitle">{{ entropyProgress.subtitle }}</span>
            </div>
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
import Spinner from "vue-simple-spinner"
import Wallet from "@/components/Wallet.vue";
import { walletFromEntropy } from "@/crypto";
import { IWallet } from "@/interfaces";

@Component({
    components: {
        Wallet,
        Spinner
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
