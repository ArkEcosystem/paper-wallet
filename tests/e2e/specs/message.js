// https://docs.cypress.io/api/introduction/api.html
import fixture from "../../__fixtures__/message.json";

describe("Message - Sign", () => {
    it("should fail if no message is given", () => {
        cy.visit("/");
        cy.contains("Or sign / verify a message").click();
        cy.contains("a", "Sign Message");
        cy.contains("Sign Message").click();
        cy.url().should("eq", "http://localhost:8080/#/message/sign");

        cy.contains("Sign").click();

        cy.contains("div", "Please fill out the message.");
    });

    it("should fail if no passphrase is given", () => {
        cy.visit("/");
        cy.contains("Or sign / verify a message").click();
        cy.contains("a", "Sign Message");
        cy.contains("Sign Message").click();
        cy.url().should("eq", "http://localhost:8080/#/message/sign");

        cy.get("#message-message").type(fixture.data.message);
        cy.contains("Sign").click();

        cy.contains("div", "Please fill out the passphrase.");
    });

    it("should sign a message (bip39)", () => {
        cy.visit("/");
        cy.contains("Or sign / verify a message").click();
        cy.contains("a", "Sign Message");
        cy.contains("Sign Message").click();
        cy.url().should("eq", "http://localhost:8080/#/message/sign");

        cy.get("#message-message").type("Hello World");
        cy.get("#message-passphrase").type(
            "size another stool celery ball secret burden giant alter gravity jacket brief",
        );
        cy.contains("Sign").click();
        cy.url().should("eq", "http://localhost:8080/#/message");

        cy.contains("span", fixture.data.message);
        cy.contains("span", "039387c299adb4c9f7ba532934d3e210eb21d374cb285926d3d49c8c71e18bc4de");
        cy.contains(
            "span",
            "30450221008baa804110ab7282cf4411f76b6367aaefd8eba230b98ddd82eaa2abb2880cde022044f03e60bccd78a33a2f763bbef11d764a53338e930989c66686853056623036",
        );
    });

    it("should sign a message (no bip39)", () => {
        cy.visit("/");
        cy.contains("Or sign / verify a message").click();
        cy.contains("a", "Sign Message");
        cy.contains("Sign Message").click();
        cy.url().should("eq", "http://localhost:8080/#/message/sign");

        cy.get("#message-message").type(fixture.data.message);
        cy.get("#message-passphrase").type(fixture.passphrase);
        cy.contains("Sign").click();
        cy.contains("Sign Anyway").click();
        cy.url().should("eq", "http://localhost:8080/#/message");

        cy.contains("span", fixture.data.message);
        cy.contains("span", fixture.data.publicKey);
        cy.contains("span", fixture.data.signature);
    });
});

describe("Message - Verify", () => {
    it("should fail if no message is given", () => {
        cy.visit("/");
        cy.contains("Or sign / verify a message").click();
        cy.contains("a", "Verify Message");
        cy.contains("Verify Message").click();
        cy.url().should("eq", "http://localhost:8080/#/message/verify");

        cy.contains("Verify").click();

        cy.contains("div", "Please fill out the message.");
    });

    it("should fail if no public key is given", () => {
        cy.visit("/");
        cy.contains("Or sign / verify a message").click();
        cy.contains("a", "Verify Message");
        cy.contains("Verify Message").click();
        cy.url().should("eq", "http://localhost:8080/#/message/verify");

        cy.get("#message-message").type(fixture.data.message);
        cy.contains("Verify").click();

        cy.contains("div", "Please fill out the publicKey.");
    });

    it("should fail if no signature is given", () => {
        cy.visit("/");
        cy.contains("Or sign / verify a message").click();
        cy.contains("a", "Verify Message");
        cy.contains("Verify Message").click();
        cy.url().should("eq", "http://localhost:8080/#/message/verify");

        cy.get("#message-message").type(fixture.data.message);
        cy.get("#message-publicKey").type(fixture.data.publicKey);
        cy.contains("Verify").click();

        cy.contains("div", "Please fill out the signature.");
    });

    it("should pass to verify a valid message", () => {
        cy.visit("/");
        cy.contains("Or sign / verify a message").click();
        cy.contains("a", "Verify Message");
        cy.contains("Verify Message").click();
        cy.url().should("eq", "http://localhost:8080/#/message/verify");

        cy.get("#message-message").type(fixture.data.message);
        cy.get("#message-publicKey").type(fixture.data.publicKey);
        cy.get("#message-signature").type(fixture.data.signature);
        cy.contains("Verify").click();

        cy.contains("div", "The message has been successfully verified.");
    });

    it("should fail to verify an invalid message", () => {
        cy.visit("/");
        cy.contains("Or sign / verify a message").click();
        cy.contains("a", "Verify Message");
        cy.contains("Verify Message").click();
        cy.url().should("eq", "http://localhost:8080/#/message/verify");

        cy.get("#message-message").type("different message");
        cy.get("#message-publicKey").type(fixture.data.publicKey);
        cy.get("#message-signature").type(fixture.data.signature);
        cy.contains("Verify").click();

        cy.contains("div", "The message could not be verified.");
    });
});
