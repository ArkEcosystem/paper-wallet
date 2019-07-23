<template>
    <div>
        <div class="flex items-center wallet-from-passphrase mt-5">
            <input type="text" placeholder="Enter your passphrase" v-model="passphrase" class="border p-4 mr-5" />

            <button class="primary-action-button" @click="generateWallet">Generate</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { walletFromBIP39 } from "@/crypto";

@Component
export default class WalletFromPassphrase extends Vue {
    public passphrase: string | null = null;

    public generateWallet() {
        try {
            this.$router.push({
                name: "wallet",
                params: { wallet: btoa(JSON.stringify(walletFromBIP39(this.passphrase))) },
            });
        } catch (error) {
            // invalid passphrase, give some error indicator
        }
    }
}
</script>
