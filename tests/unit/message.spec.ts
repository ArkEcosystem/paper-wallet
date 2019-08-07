import { signMessage, verifyMessage } from "@/message";
import fixture from "../__fixtures__/message.json";

describe("Message", () => {
    it("should sign a message", () => {
        expect(signMessage(fixture.data.message, fixture.passphrase)).toEqual(fixture.data);
    });

    it("should verify a message", () => {
        expect(verifyMessage(fixture.data)).toBe(true);
    });

    it("should fail to verify a message", () => {
        expect(verifyMessage({ ...fixture.data, ...{ message: "different message" } })).toBe(false);
    });
});
