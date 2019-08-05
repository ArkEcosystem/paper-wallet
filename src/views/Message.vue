<template>
    <div v-if="message" class="bg-white rounded-lg mt-10 px-6 sm:px-10 py-6 lg:px-16 lg:py-10 max-w-2xl">
        <div class="flex flex-col wallet-property-row">
            <span>Message</span>
            <span class="font-semibold text-sm break-all">{{ message.message }}</span>
        </div>
        <div class="flex flex-col wallet-property-row py-6">
            <span>Public Key</span>
            <span class="font-semibold text-sm break-all">{{ message.publicKey }}</span>
        </div>
        <div class="flex flex-col pt-6">
            <span>Signature</span>
            <span class="font-semibold text-sm break-all">{{ message.signature }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class Message extends Vue {
    private message: { message: string; publicKey: string; signature: string } | null = null;

    public mounted() {
        try {
            this.message = JSON.parse(this.$route.params.message);
        } catch {
            this.$router.push("/");
        }
    }
}
</script>

<style>
.wallet-property-row {
    @apply .border-b .border-dashed .border-gray-400 .pb-6;
}
</style>
