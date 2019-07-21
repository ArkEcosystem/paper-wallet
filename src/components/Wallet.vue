<template>
    <div>
        <ul class="list-disc">
            <li>
                <strong>Passphrase:</strong>
                {{ wallet.passphrase }}
            </li>
            <li>
                <strong>Address:</strong>
                {{ wallet.address }}
            </li>
            <li>
                <strong>Public Key:</strong>
                {{ wallet.publicKey }}
            </li>
            <li>
                <strong>Wif:</strong>
                {{ wallet.wif }}
            </li>
            <li>
                <strong>Entropy:</strong>
                {{ wallet.entropy }}
            </li>
        </ul>

        <qrcode :value="codeForAddress" :options="{ width: 200 }"></qrcode>
        <qrcode :value="codeForPassphrase" :options="{ width: 200 }"></qrcode>

        <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded"
            @click="print"
        >Print</button>

        <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded"
            @click="save"
        >Save</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import html2canvas from "html2canvas";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { IWallet } from "@/interfaces";

@Component
export default class Wallet extends Vue {
    @Prop({ required: true }) public wallet: IWallet;

    get codeForAddress() {
        return JSON.stringify({ address: this.wallet.address });
    }

    get codeForPassphrase() {
        return JSON.stringify({ passphrase: this.wallet.passphrase });
    }

    public print() {
        window.print();
    }

    public save() {
        html2canvas(document.querySelector("html")).then(canvas => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            link.download = "ark-paper-wallet.jpg";
            link.click();
        });
    }
}
</script>
