<template>
    <div v-if="wallet">
        <div id="wallet-details" v-if="wallet">
            <input type="hidden" id="wallet-address" :value="wallet.address" />
            <input type="hidden" id="wallet-passphrase" :value="wallet.passphrase" />

            <div class="bg-white rounded-t-lg mt-10 px-6 sm:px-10 py-6 lg:px-16 lg:py-10">
                <div class="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
                    <span class="text-gray-500">
                        <span class="font-semibold">{{ name }}</span>
                        {{ network }} ( {{ date }} )
                    </span>
                </div>
                <div class="flex flex-col sm:flex-row items-center wallet-property-row pb-6">
                    <qrcode :value="codeForAddress" :options="{ width: 100 }"></qrcode>
                    <div class="flex flex-col ml-3">
                        <div class="flex">
                            <span>Address</span>
                            <button
                                id="address-copy"
                                class="print-ignore text-gray-500 ml-3"
                                @click="copy('#wallet-address', 'isAddressCopying')"
                            >
                                <svg
                                    width="12px"
                                    height="16px"
                                    viewBox="0 0 16 19"
                                    class="fill-current"
                                    :class="{ 'animated wobble': isAddressCopying }"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M11.000,-0.000 L1.999,-0.000 C0.899,-0.000 -0.000,0.941 -0.000,2.091 L-0.000,13.000 L1.999,13.000 L1.999,2.000 L11.000,2.000 L11.000,-0.000 ZM14.000,3.994 L5.999,3.994 C4.900,3.994 3.999,4.944 3.999,6.106 L3.999,16.888 C3.999,18.049 4.900,19.000 5.999,19.000 L14.000,19.000 C15.099,19.000 16.000,18.049 16.000,16.888 L16.000,6.106 C16.000,4.944 15.099,3.994 14.000,3.994 ZM14.000,17.000 L5.999,17.000 L5.999,6.000 L14.000,6.000 L14.000,17.000 Z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <span class="font-semibold sm:text-lg break-all" id="w-address">{{ wallet.address }}</span>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row items-center pt-6">
                    <qrcode :value="codeForPassphrase" :options="{ width: 100 }"></qrcode>
                    <div class="flex flex-col ml-3 w-full">
                        <div class="flex">
                            <span>Passphrase</span>
                            <button
                                id="passphrase-copy"
                                class="print-ignore text-gray-500 ml-3"
                                @click="copy('#wallet-passphrase', 'isPassphraseCopying')"
                            >
                                <svg
                                    width="12px"
                                    height="16px"
                                    viewBox="0 0 16 19"
                                    class="fill-current"
                                    :class="{ 'animated wobble': isPassphraseCopying }"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M11.000,-0.000 L1.999,-0.000 C0.899,-0.000 -0.000,0.941 -0.000,2.091 L-0.000,13.000 L1.999,13.000 L1.999,2.000 L11.000,2.000 L11.000,-0.000 ZM14.000,3.994 L5.999,3.994 C4.900,3.994 3.999,4.944 3.999,6.106 L3.999,16.888 C3.999,18.049 4.900,19.000 5.999,19.000 L14.000,19.000 C15.099,19.000 16.000,18.049 16.000,16.888 L16.000,6.106 C16.000,4.944 15.099,3.994 14.000,3.994 ZM14.000,17.000 L5.999,17.000 L5.999,6.000 L14.000,6.000 L14.000,17.000 Z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div class="passphrase-grid mt-2">
                            <div
                                v-for="(word, index) in passphraseWords"
                                :key="word"
                                class="relative py-1 px-2 border border-gray-300 rounded text-center"
                            >
                                <span>{{ word }}</span>
                                <span class="passphrase-index">{{ index + 1 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-100 rounded-b-lg px-6 sm:px-10 py-6 lg:px-16 lg:py-10">
                <div class="flex flex-col wallet-property-row" v-if="wallet.entropy">
                    <span>Entropy</span>
                    <span class="font-semibold text-sm break-all" id="w-entropy">{{ wallet.entropy }}</span>
                </div>
                <div class="flex flex-col wallet-property-row pb-6" :class="{ 'pt-6': wallet.entropy }">
                    <span>Public Key</span>
                    <span class="font-semibold text-sm break-all" id="w-publicKey">{{ wallet.publicKey }}</span>
                </div>
                <div class="flex flex-col pt-6">
                    <span>WIF</span>
                    <span class="font-semibold text-sm break-all" id="w-wif">{{ wallet.wif }}</span>
                </div>
            </div>
        </div>

        <div class="flex justify-center items-center mt-5 print-ignore">
            <button class="secondary-action-button mr-5" @click="save">
                <span class="mr-3">Save</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="15"
                    viewBox="0 0 12 15"
                    class="fill-current"
                    :class="{ 'animated wobble': isSaving }"
                >
                    <path
                        d="M725.329,1059.71l-0.659-.75a0.5,0.5,0,0,0-.7-0.05L722,1060.64v-7.14a0.5,0.5,0,0,0-.5-0.5h-1a0.5,0.5,0,0,0-.5.5v7.14l-1.965-1.73a0.5,0.5,0,0,0-.7.05l-0.659.75a0.5,0.5,0,0,0,.046.71l3.954,3.46a0.512,0.512,0,0,0,.659,0l3.953-3.46A0.5,0.5,0,0,0,725.329,1059.71ZM726.5,1066h-11a0.5,0.5,0,0,0-.5.5v1a0.5,0.5,0,0,0,.5.5h11a0.5,0.5,0,0,0,.5-0.5v-1A0.5,0.5,0,0,0,726.5,1066Z"
                        transform="translate(-715 -1053)"
                    />
                </svg>
            </button>
            <button class="icon-button" @click="print">
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 21 19" class="fill-current">
                    <path
                        d="M792.118,1060.88A2.88,2.88,0,0,0,790,1060h-1v-3a3.606,3.606,0,0,0-.313-1.38,3.567,3.567,0,0,0-.75-1.18l-2.375-2.38a3.686,3.686,0,0,0-1.188-.75A3.564,3.564,0,0,0,783,1051h-5.5a1.418,1.418,0,0,0-1.063.44,1.436,1.436,0,0,0-.438,1.06v7.5h-1a3.01,3.01,0,0,0-3,3v4.5a0.472,0.472,0,0,0,.149.35,0.478,0.478,0,0,0,.351.15H776v0.5a1.5,1.5,0,0,0,1.5,1.5h10a1.416,1.416,0,0,0,1.062-.44,1.432,1.432,0,0,0,.438-1.06V1068h3.5a0.48,0.48,0,0,0,.352-0.15,0.471,0.471,0,0,0,.148-0.35V1063A2.9,2.9,0,0,0,792.118,1060.88ZM787,1068h-9v-2h9v2Zm0-6h-9v-9h5v2.5a1.432,1.432,0,0,0,.438,1.06,1.456,1.456,0,0,0,1.063.44H787v5Zm2.851,1.85a0.487,0.487,0,0,1-.7,0,0.488,0.488,0,0,1,0-.7,0.487,0.487,0,0,1,.7,0A0.486,0.486,0,0,1,789.852,1063.85Z"
                        transform="translate(-772 -1051)"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import html2canvas from "html2canvas";
import Component from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { config } from "@/config";
import { IWallet } from "@/interfaces";

@Component
export default class Wallet extends Vue {
    private wallet: IWallet = null;
    private isAddressCopying: boolean = false;
    private isPassphraseCopying: boolean = false;
    private isSaving: boolean = false;

    public mounted() {
        try {
            this.wallet = JSON.parse(this.$route.params.wallet);
        } catch {
            this.$router.push("/");
        }
    }

    get name(): string {
        return config.getName();
    }

    get date(): string {
        return new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    get network(): string {
        const network: string = config.getNetwork();
        const name: string = config.getName();

        return name === "Custom"
            ? ` | Prefix ${config.getAddressPrefix()} - WIF ${config.getWIF()}`
            : ` | ${network.charAt(0).toUpperCase() + network.slice(1)}`;
    }

    get codeForAddress() {
        return JSON.stringify({ address: this.wallet.address });
    }

    get codeForPassphrase() {
        return JSON.stringify({ passphrase: this.wallet.passphrase });
    }

    get passphraseWords() {
        return this.wallet.passphrase.split(" ");
    }

    public print() {
        window.print();
    }

    public copy(selector, copyClass) {
        const element = document.querySelector(selector);
        element.setAttribute("type", "text");
        // @ts-ignore
        element.select();
        try {
            document.execCommand("copy");
            // copied
        } catch (err) {
            // not copied
        }
        element.setAttribute("type", "hidden");
        window.getSelection().removeAllRanges();

        this.animate(copyClass);
    }

    public save() {
        /* Hide the icons so they don't show up in the image */
        const address = document.querySelector("#address-copy");
        const passphrase = document.querySelector("#passphrase-copy");
        address.classList.add("hidden");
        passphrase.classList.add("hidden");

        html2canvas(document.querySelector("#wallet-details"), {
            x: 150,
            y: 430,
            scrollX: 0,
            scrollY: 0,
            width: 737,
            height: this.wallet.entropy ? 800 : 615,
            windowWidth: 1024,
            windowHeight: 800,
        }).then(canvas => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/jpeg");
            link.download = `ark-paper-wallet-${this.wallet.address}.jpg`;
            link.click();

            this.animate("isSaving");
        });

        address.classList.remove("hidden");
        passphrase.classList.remove("hidden");
    }

    private animate(key: string): void {
        this[key] = true;
        setTimeout(() => (this[key] = false), 1000);
    }
}
</script>

<style>
.wallet-property-row {
    @apply .border-b .border-dashed .border-gray-400 .pb-6;
}

.passphrase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    grid-gap: 0.75rem 0.75rem;
}

.passphrase-index {
    left: 5px;
    top: 3px;
    font-size: 0.6rem;
    @apply .absolute .font-semibold .text-gray-500;
}
</style>
