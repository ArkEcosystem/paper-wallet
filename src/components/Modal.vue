<template>
    <div v-if="isOpen">
        <div class="modal-backdrop" @click="close()" />
        <div class="modal-content">
            <div class="modal-top">
                <span class="font-bold text-2xl">Select a Network</span>
                <span>Choose the network to use for the paper wallet</span>
                <img src="@/assets/img/globe.png" />
            </div>
            <div class="modal-bottom">
                <div v-if="!useCustom">
                    <span class="mr-3 block w-full text-sm font-bold text-gray-500">Network</span>
                    <div class="flex">
                        <select v-model="selectedToken" class="w-full sm:w-4/5 container-inputs">
                            <option v-for="token in tokens" :value="token.value" :key="token.label">{{
                                token.label
                            }}</option>
                        </select>

                        <button class="light-button font-bold sm:w-1/5" @click.prevent="saveConfigFromNetwork">
                            Save
                        </button>
                    </div>
                    <span class="text-xs inline-link" @click="toggleCustom(true)">Want to use a custom network?</span>
                </div>
                <div v-else>
                    <span class="mr-3 block w-full text-sm font-bold text-gray-500">Network</span>
                    <div class="flex">
                        <div class="flex mr-4 container-inputs">
                            <input
                                type="number"
                                v-model="customAddressPrefix"
                                placeholder="Address Prefix"
                                class="w-2/4 mr-4"
                            />

                            <input type="number" v-model="customWIF" placeholder="WIF" class="w-2/4" />
                        </div>

                        <button class="light-button font-bold w-1/5" @click.prevent="saveConfigFromCustom">Save</button>
                    </div>
                    <span class="text-xs inline-link" @click="toggleCustom(false)"
                        >Want to use an existing network?</span
                    >
                </div>
                <Alert :message="error" type="error" v-if="error" />
            </div>

            <div class="modal-close-button" @click="close">
                <svg width="15" height="15" viewBox="0 0 15 15" class="fill-current">
                    <path
                        d="M1764,6323.5l-1.5-1.5-6,6-6-6-1.5,1.5,6,6-6,6,1.5,1.5,6-6,6,6,1.5-1.5-6-6Z"
                        transform="translate(-1749 -6322)"
                    />
                </svg>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { config } from "@/config";
import { IToken, ITokenNetwork } from "@/interfaces";
import Alert from "@/components/Alert.vue";

@Component({ components: { Alert } })
export default class Modal extends Vue {
    @Prop({ required: true }) public isOpen: boolean;

    public tokens: Array<{ label: string; value: { token: string; network: string } }> = [];
    public selectedToken: { token: string; network: string } = {
        token: "ark",
        network: "mainnet",
    };
    public customAddressPrefix: number | null = null;
    public customWIF: number | null = null;
    public useCustom: boolean = false;
    public error: string | null = null;

    public mounted(): void {
        for (const token of Object.values(config.getTokens())) {
            for (const [network, details] of Object.entries(token.networks)) {
                this.tokens.push({
                    label: `${token.name} | ${network.charAt(0).toUpperCase() + network.slice(1)}`,
                    value: { token: token.name, network },
                });
            }
        }

        this.useCustom = config.getName() === "Custom";

        if (this.useCustom) {
            this.customAddressPrefix = config.getAddressPrefix();
            this.customWIF = config.getWIF();
        }

        this.selectedToken = this.tokens[0].value;
    }

    private saveConfigFromNetwork(): void {
        config.setName(this.selectedToken.token);
        config.setToken(this.selectedToken.token.toLowerCase());
        config.setNetwork(this.selectedToken.network);

        this.close();
    }

    private saveConfigFromCustom(): void {
        if (this.customAddressPrefix && this.customWIF) {
            config.setName("Custom");
            config.setAddressPrefix(this.customAddressPrefix);
            config.setWIF(this.customWIF);

            this.close();
        } else {
            this.error = "Please fill out the address prefix and wif.";
        }
    }

    private close(): void {
        this.$emit("close");
    }

    private toggleCustom(value: boolean): void {
        this.useCustom = value;
    }
}
</script>

<style>
.modal-top {
    background-color: #2d2f38;
    @apply .flex .flex-col .rounded-t-lg .p-10 .text-white;
}

.modal-top img {
    width: 8rem;
    @apply .mt-3 .self-center;
}

.modal-bottom {
    @apply .bg-white .rounded-b-lg .p-10;
}

.modal-content {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    @apply .fixed .rounded-lg .overflow-auto .z-10;
}

@screen sm {
    .modal-content {
        max-width: 30rem;
        @apply .w-full;
    }

    .modal-top img {
        width: 12rem;
    }
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.4);
    @apply .w-screen .h-screen .fixed .left-0 .top-0 .z-10 .overflow-hidden;
}

.modal-close-button {
    top: 10px;
    right: 10px;
    @apply .absolute .text-white .cursor-pointer;
}

@screen sm {
    /* Inputs */
    .container-inputs {
        min-width: 311px !important;
    }
}

/* Existing Networks */
select {
    appearance: none;
    background: url("../assets/img/icons/dropdown.svg") 96% / 20px no-repeat transparent;
    @apply .bg-white .mr-4 .py-2 .border-b-2 .border-gray-500 .rounded-none;
}

/* Custom Networks */
input[type="number"] {
    appearance: none;
    @apply .bg-white .py-2 .border-b-2 .border-gray-500 .rounded-none;
}

/* Shared */
select:focus,
input[type="number"]:focus {
    border-color: #2585ff;
}
</style>
