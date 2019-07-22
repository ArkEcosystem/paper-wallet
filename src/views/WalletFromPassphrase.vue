<template>
    <div class="flex items-center wallet-from-passphrase mt-5">
        <input type="text" placeholder="Enter your passphrase" v-model="passphrase" class="border p-4 mr-5" />

        <button
            class="primary-action-button"
            @click="generateWallet"
        >Generate</button>

        <Wallet :wallet="wallet" v-if="wallet" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Wallet from "@/components/Wallet.vue";
import { walletFromBIP39 } from "@/crypto";
import { IWallet } from "@/interfaces";

@Component({
    components: {
        Wallet,
    },
})
export default class WalletFromPassphrase extends Vue {
    public passphrase: string | null = null;
    public wallet: IWallet | null = null;

    public generateWallet() {
        try {
            this.wallet = walletFromBIP39(this.passphrase);
        } catch (error) {
            // invalid passphrase, give some error indicator
        }
    }
}
</script>
