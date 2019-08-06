<template>
    <div class="w-full sm:w-auto">
        <div class="flex flex-col sm:flex-row flex-wrap justify-center items-center wallet-from-passphrase mt-5">
            <input
                type="text"
                placeholder="Enter your message"
                v-model="message"
                class="border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-message"
            />

            <input
                type="text"
                placeholder="Enter your public key"
                v-model="publicKey"
                class="border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-publicKey"
            />

            <input
                type="text"
                placeholder="Enter your signature"
                v-model="signature"
                class="border p-4 w-full sm:w-auto sm:mr-5 mb-5"
                id="message-signature"
            />

            <button class="primary-action-button mb-5" @click.prevent="verifyMessage">Verify</button>
        </div>

        <div class="flex flex-col items-center">
            <Alert :message="errorText" type="error" v-if="errorText" />

            <Alert message="The message has been successfully verified." type="success" v-if="isValid === true" />

            <Alert message="The message could not be verified." type="error" v-if="isValid === false" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Alert from "@/components/Alert.vue";
import { signMessage, verifyMessage } from "../message";

@Component({ components: { Alert } })
export default class MessageVerify extends Vue {
    public message: string | null = null;
    public publicKey: string | null = null;
    public signature: string | null = null;

    public isValid: boolean | null = null;
    public errorText: string | null = null;

    public verifyMessage(): void {
        if (!this.message) {
            this.errorText = "Please fill out the message.";
            return;
        }

        if (!this.publicKey) {
            this.errorText = "Please fill out the publicKey.";
            return;
        }

        if (!this.signature) {
            this.errorText = "Please fill out the signature.";
            return;
        }

        this.errorText = null;

        try {
            this.isValid = verifyMessage({
                message: this.message,
                publicKey: this.publicKey,
                signature: this.signature,
            });
        } catch (error) {
            this.isValid = false;
        }
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
