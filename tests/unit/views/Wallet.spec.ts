import { shallowMount } from "@vue/test-utils";
import Wallet from "@/views/Wallet.vue";
import { walletDummy } from "../../__fixtures__/wallet";

const createWrapper = () =>
    shallowMount(Wallet, {
        mocks: {
            $route: {
                name: "wallet",
                path: "/wallet/:id",
                params: { wallet: JSON.stringify(walletDummy) },
            },
        },
        stubs: {
            qrcode: true,
        },
    });

describe("Wallet.vue", () => {
    it("sets props.wallet.passphrase when mounted", () => {
        expect(createWrapper().vm.$data.wallet.passphrase).toContain(walletDummy.passphrase);
    });

    it("sets props.wallet.address when mounted", () => {
        expect(createWrapper().vm.$data.wallet.address).toContain(walletDummy.address);
    });

    it("sets props.wallet.publicKey when mounted", () => {
        expect(createWrapper().vm.$data.wallet.publicKey).toContain(walletDummy.publicKey);
    });

    it("sets props.wallet.wif when mounted", () => {
        expect(createWrapper().vm.$data.wallet.wif).toContain(walletDummy.wif);
    });

    it("sets props.wallet.entropy when mounted", () => {
        expect(createWrapper().vm.$data.wallet.entropy).toContain(walletDummy.entropy);
    });

    it("should redirect to the home page if the wallet identifier is not present", () => {
        const wrapper = shallowMount(Wallet, {
            mocks: {
                $router: {
                    push: jest.fn(),
                },
            },
            stubs: {
                qrcode: true,
            },
        });

        expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$router.push).toBeCalledWith("/");
    });
});
