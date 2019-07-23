<template>
    <div
        :class="type ? `alert-${type}` : 'opacity-0 hidden'"
        class="alert block w-full rounded px-4 py-2 mt-4 text-white"
    >
        <div class="flex justify-between items-center text-left message font-semibold">
            <span v-html="message"></span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { config } from "../config";
import { IToken, ITokenNetwork } from "../interfaces";

@Component
export default class AlertMessage extends Vue {
    @Prop({ required: true }) public message: string;
    @Prop({ default: "info" }) public type: string;
    @Prop({ default: 5000 }) public duration: number;
    @Prop({ default: false }) public dismissible: boolean;
}
</script>

<style scoped>
.alert {
    transition: opacity, hidden 0.2s ease-in, background-color 0.1s ease-in;
}

.alert-error {
    background-color: #ec1b38;
}

.alert-success {
    background-color: #3bb15c;
}

.alert-info {
    background-color: #2199e5;
}

.alert-warn {
    background-color: #e5a721;
    color: #b03b12;
}

.button-close {
    padding: 12px;
    background: rgba(255, 255, 255, 0.2);
}

.button-close:hover {
    background: rgba(0, 0, 0, 0.1);
}
</style>
