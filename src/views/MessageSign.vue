<template>
    <div class="w-full sm:w-auto">
        <div class="flex flex-col sm:flex-row sm:justify-start items-center wallet-from-passphrase mt-5">
            <input
                type="text"
                placeholder="Enter your message"
                v-model="message"
                class="border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-message"
            />

            <input
                type="password"
                placeholder="Enter your passphrase"
                v-model="passphrase"
                class="border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-passphrase"
            />

            <button class="primary-action-button mb-5" @click.prevent="signMessage">Sign</button>
        </div>

        <div class="flex flex-col items-center" v-if="errorText">
            <Alert :message="errorText" type="error" />
            <button v-if="showForceSign" class="text-gray-500 inline-link mt-3" @click.prevent="forceSignMessage">
                Sign Anyway
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { validateMnemonic } from "bip39";
import Alert from "@/components/Alert.vue";
import { signMessage } from "../message";

@Component({ components: { Alert } })
export default class MessageSign extends Vue {
    public message: string | null = null;
    public passphrase: string | null = null;
    public errorText: string | null = null;
    public showForceSign: boolean | null = null;

    public signMessage(): void {
        this.showForceSign = false;

        if (!this.message) {
            this.errorText = "Please fill out the message.";
            return;
        }

        if (!this.passphrase) {
            this.errorText = "Please fill out the passphrase.";
            return;
        }

        if (!validateMnemonic(this.passphrase)) {
            this.errorText = "The passphrase does not appear to be BIP39";
            this.showForceSign = true;
            return;
        }

        this.forceSignMessage();
    }

    public forceSignMessage(): void {
        this.errorText = null;

        this.$router.push({
            name: "message",
            params: { message: JSON.stringify(signMessage(this.message, this.passphrase)) },
        });
    }
}
</script>

<style>
/* Custom Networks */
input[type="text"],
input[type="password"] {
    appearance: none;
    @apply .bg-transparent .py-2 .border-t-0 .border-l-0 .border-r-0 .border-b-2 .border-gray-500 .rounded-none;
}
</style>
