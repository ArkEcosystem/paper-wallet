<template>
    <div>
        <div class="flex items-center wallet-from-passphrase mt-5">
            <input
                type="text"
                placeholder="Enter your passphrase"
                v-model="passphrase"
                class="border p-4 mr-5"
                id="wallet-passphrase"
            />
            <button class="primary-action-button" @click.prevent="generateWallet">Generate</button>
        </div>
        <div class="flex flex-col items-center" v-if="errorText">
            <Alert :message="errorText" type="error" />
            <button class="text-gray-500 inline-link mt-3" @click.prevent="forceGenerateWallet">Generate Anyway</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { validateMnemonic } from "bip39";
import { walletFromBIP39 } from "@/crypto";
import Alert from "@/components/Alert.vue";

@Component({ components: { Alert } })
export default class WalletFromPassphrase extends Vue {
    public passphrase: string | null = null;
    public errorText: string | null = null;

    public generateWallet(): void {
        if (!this.passphrase) {
            this.errorText = "Please fill out the passphrase.";
            return;
        }

        if (!validateMnemonic(this.passphrase)) {
            this.errorText = "The passphrase does not appear to be BIP39";
            return;
        }

        this.forceGenerateWallet();
    }

    public forceGenerateWallet(): void {
        this.errorText = null;

        this.$router.push({
            name: "wallet",
            params: { wallet: JSON.stringify(walletFromBIP39(this.passphrase)) },
        });
    }
}
</script>

<style>
/* Custom Networks */
input[type="text"] {
    appearance: none;
    @apply .bg-transparent .py-2 .border-t-0 .border-l-0 .border-r-0 .border-b-2 .border-gray-500 .rounded-none;
}
</style>
