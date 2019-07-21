<template>
    <div class="wallet-from-passphrase">
        <input type="text" v-model="passphrase" class="border p-4 mr-4" />

        <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded"
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
