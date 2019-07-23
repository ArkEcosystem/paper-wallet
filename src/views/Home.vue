<template>
    <div class="home">
        <div class="flex flex-col sm:flex-row flex-wrap mt-5">
            <router-link class="primary-action-button mb-5 sm:mb-0 sm:mr-5 whitespace-no-wrap" to="/wallet-from-entropy"
                >Create a new wallet</router-link
            >
            <router-link class="link-button whitespace-no-wrap" to="/wallet-from-passphrase"
                >Enter a secret passphrase</router-link
            >

            <!-- @TODO: move to modal -->
            <select @change="saveConfigFromNetwork" v-model="selectedToken">
                <option v-for="token in tokens" :value="token.value" :key="token.label">{{ token.label }}</option>
            </select>

            <input type="text" v-model="customAddressPrefix" placeholder="customAddressPrefix" />
            <input type="text" v-model="customWIF" placeholder="customWIF" />
            <button @click.prevent="saveConfigFromCustom">Save Custom</button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { config } from "../config";
import { IToken, ITokenNetwork } from "../interfaces";

@Component
export default class Home extends Vue {
    public tokens: Array<{ label: string; value: { token: string; network: string } }> = [];
    public selectedToken: { token: string; network: string } = {
        token: "ark",
        network: "mainnet",
    };
    public customAddressPrefix: number | null = null;
    public customWIF: number | null = null;

    public mounted(): void {
        for (const token of Object.values(config.getTokens())) {
            for (const [network, details] of Object.entries(token.networks)) {
                this.tokens.push({
                    label: `${token.name} | ${network.charAt(0).toUpperCase() + network.slice(1)}`,
                    value: { token: token.name, network },
                });
            }
        }

        this.selectedToken = this.tokens[0].value;
    }

    public saveConfigFromNetwork(): void {
        config.setName(this.selectedToken.token);
        config.setToken(this.selectedToken.token.toLowerCase());
        config.setNetwork(this.selectedToken.network);
    }

    public saveConfigFromCustom(): void {
        config.setName("Custom");
        config.setAddressPrefix(this.customAddressPrefix);
        config.setWIF(this.customWIF);
    }
}
</script>
