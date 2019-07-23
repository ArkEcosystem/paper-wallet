<template>
    <div id="app" class="flex flex-col items-center">
        <div id="content">
            <h1>ARK Paper Wallet</h1>
            <span class="text-center">Generate Your Own Unique ARK Passphrase and Address</span>

            <router-view />

            <modal :is-open="isOpen" @close="closeSettings()"></modal>

            <button class="text-gray-500 inline-link mt-10" type="button" @click="openSettings()">Choose Network</button>

            <div class="flex flex-col text-gray-500 text-center mt-10 mb-5">
                <span>
                    Hosted by GitHub Pages. Source code is available
                    <a class="inline-link" href target="_blank">here</a>. You can download and run locally
                    <a class="inline-link" href target="_blank">here</a>
                </span>
                <span class="text-sm mt-2">
                    Made with ❤️
                    <a class="inline-link" href target="_blank">ARK.io</a>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Modal from "@/components/Modal.vue";

@Component({
    components: {
        Modal
    },
})
export default class App extends Vue {
    private isOpen: boolean = false;

    public openSettings(): void {
        this.isOpen = true;
    }

    public closeSettings(): void {
        this.isOpen = false;
    }

}
</script>

<style lang="stylus">
#content {
    background-image: url('assets/img/background.png');
}
</style>
