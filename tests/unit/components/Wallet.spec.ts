import { shallowMount } from "@vue/test-utils";
import Wallet from "@/components/Wallet.vue";
import { walletDummy } from "../../__fixtures__/wallet";

describe("Wallet.vue", () => {
    it("renders props.wallet.passphrase when passed", () => {
        const wrapper = shallowMount(Wallet, {
            propsData: { wallet: walletDummy },
            stubs: {
                qrcode: true,
            },
        });

        expect(wrapper.text()).toContain(walletDummy.passphrase);
    });

    it("renders props.wallet.address when passed", () => {
        const wrapper = shallowMount(Wallet, {
            propsData: { wallet: walletDummy },
            stubs: {
                qrcode: true,
            },
        });

        expect(wrapper.text()).toContain(walletDummy.address);
    });

    it("renders props.wallet.publicKey when passed", () => {
        const wrapper = shallowMount(Wallet, {
            propsData: { wallet: walletDummy },
            stubs: {
                qrcode: true,
            },
        });

        expect(wrapper.text()).toContain(walletDummy.publicKey);
    });

    it("renders props.wallet.wif when passed", () => {
        const wrapper = shallowMount(Wallet, {
            propsData: { wallet: walletDummy },
            stubs: {
                qrcode: true,
            },
        });

        expect(wrapper.text()).toContain(walletDummy.wif);
    });

    it("renders props.wallet.entropy when passed", () => {
        const wrapper = shallowMount(Wallet, {
            propsData: { wallet: walletDummy },
            stubs: {
                qrcode: true,
            },
        });

        expect(wrapper.text()).toContain(walletDummy.entropy);
    });
});
